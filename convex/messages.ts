import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { type Id } from "./_generated/dataModel";
import { attachment, messageRole, nodeType } from "./schema";

const messageDoc = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  parentId: v.optional(v.id("messages")),
  branchName: v.optional(v.string()),
  role: messageRole,
  content: v.string(),
  model: v.optional(v.string()),
  attachments: v.array(attachment),
  xPosition: v.number(),
  yPosition: v.number(),
  nodeType,
  isCollapsed: v.boolean(),
  isLocked: v.boolean(),
  lastEditedBy: v.optional(v.string()),
  editedAt: v.optional(v.number()),
  createdAt: v.number(),
});

async function requireChatAccess(
  ctx: Parameters<typeof requireUserId>[0],
  chatId: Id<"chats">,
  requireEdit = false,
) {
  const userId = await requireUserId(ctx);
  const chat = await ctx.db.get(chatId);

  if (!chat) {
    throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
  }

  if (chat.userId === userId) {
    return { chat, userId };
  }

  const cutoff = Date.now() - 5 * 60 * 1000;
  const session = await ctx.db
    .query("collaborationSessions")
    .withIndex("by_chatId_and_lastActivity", (q) =>
      q.eq("chatId", chatId).gte("lastActivity", cutoff),
    )
    .order("desc")
    .first();

  if (!session) {
    throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
  }

  const participant = await ctx.db
    .query("sessionParticipants")
    .withIndex("by_sessionId_and_userId", (q) =>
      q.eq("sessionId", session._id).eq("userId", userId),
    )
    .first();

  if (!participant || (requireEdit && participant.role === "viewer")) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Not authorized to access this chat",
    });
  }

  return { chat, userId };
}

export const listForChat = query({
  args: { chatId: v.id("chats") },
  returns: v.array(messageDoc),
  handler: async (ctx, args) => {
    await requireChatAccess(ctx, args.chatId);

    return await ctx.db
      .query("messages")
      .withIndex("by_chatId_and_createdAt", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .take(500);
  },
});

export const create = mutation({
  args: {
    chatId: v.id("chats"),
    role: messageRole,
    content: v.string(),
    model: v.optional(v.string()),
    attachments: v.optional(v.array(attachment)),
    parentId: v.optional(v.id("messages")),
    branchName: v.optional(v.string()),
    xPosition: v.optional(v.number()),
    yPosition: v.optional(v.number()),
    nodeType: v.optional(nodeType),
    isCollapsed: v.optional(v.boolean()),
    isLocked: v.optional(v.boolean()),
  },
  returns: messageDoc,
  handler: async (ctx, args) => {
    const { userId } = await requireChatAccess(ctx, args.chatId, true);
    const now = Date.now();

    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent || parent.chatId !== args.chatId) {
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: "Parent message not found in this chat",
        });
      }
    }

    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
      model: args.model,
      attachments: args.attachments ?? [],
      parentId: args.parentId,
      branchName: args.branchName,
      xPosition: args.xPosition ?? 0,
      yPosition: args.yPosition ?? 0,
      nodeType: args.nodeType ?? "conversation",
      isCollapsed: args.isCollapsed ?? false,
      isLocked: args.isLocked ?? false,
      lastEditedBy: userId,
      createdAt: now,
    });

    await ctx.db.patch(args.chatId, { updatedAt: now });

    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new ConvexError({ code: "INTERNAL_ERROR", message: "Message not created" });
    }
    return message;
  },
});

export const updatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("messages"),
        xPosition: v.number(),
        yPosition: v.number(),
      }),
    ),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();

    for (const update of args.updates) {
      const message = await ctx.db.get(update.id);
      if (!message) {
        continue;
      }

      await requireChatAccess(ctx, message.chatId, true);

      await ctx.db.patch(update.id, {
        xPosition: update.xPosition,
        yPosition: update.yPosition,
        editedAt: now,
        lastEditedBy: userId,
      });
    }

    return { success: true };
  },
});
