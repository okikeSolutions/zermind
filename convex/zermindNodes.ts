import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { nodeType } from "./schema";
import { requireUserId } from "./lib/auth";

const nodeDoc = v.object({
  _id: v.id("zermindNodes"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  agentThreadId: v.string(),
  agentMessageId: v.string(),
  parentAgentMessageId: v.optional(v.string()),
  branchName: v.optional(v.string()),
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
  if (!chat) throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
  if (chat.userId === userId) return { chat, userId };

  const cutoff = Date.now() - 5 * 60 * 1000;
  const session = await ctx.db
    .query("collaborationSessions")
    .withIndex("by_chatId_and_lastActivity", (q) =>
      q.eq("chatId", chatId).gte("lastActivity", cutoff),
    )
    .order("desc")
    .first();
  if (!session) throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });

  const participant = await ctx.db
    .query("sessionParticipants")
    .withIndex("by_sessionId_and_userId", (q) =>
      q.eq("sessionId", session._id).eq("userId", userId),
    )
    .first();

  if (!participant || (requireEdit && participant.role === "viewer")) {
    throw new ConvexError({ code: "UNAUTHORIZED", message: "Not authorized" });
  }
  return { chat, userId };
}

export const listForChat = query({
  args: { chatId: v.id("chats") },
  returns: v.array(nodeDoc),
  handler: async (ctx, args) => {
    await requireChatAccess(ctx, args.chatId);
    return await ctx.db
      .query("zermindNodes")
      .withIndex("by_chatId_and_createdAt", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .take(1000);
  },
});

export const updatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        agentMessageId: v.string(),
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
      const node = await ctx.db
        .query("zermindNodes")
        .withIndex("by_agentMessageId", (q) => q.eq("agentMessageId", update.agentMessageId))
        .first();
      if (!node) continue;
      await requireChatAccess(ctx, node.chatId, true);
      await ctx.db.patch(node._id, {
        xPosition: update.xPosition,
        yPosition: update.yPosition,
        editedAt: now,
        lastEditedBy: userId,
      });
    }

    return { success: true };
  },
});

export const ensureForAgentMessages = internalMutation({
  args: {
    chatId: v.id("chats"),
    agentThreadId: v.string(),
    userId: v.string(),
    parentAgentMessageId: v.optional(v.string()),
    branchName: v.optional(v.string()),
    messages: v.array(
      v.object({
        agentMessageId: v.string(),
        role: v.string(),
        createdAt: v.number(),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    let index = 0;
    for (const message of args.messages) {
      if (message.role !== "user" && message.role !== "assistant") continue;
      const existing = await ctx.db
        .query("zermindNodes")
        .withIndex("by_agentMessageId", (q) => q.eq("agentMessageId", message.agentMessageId))
        .first();
      if (existing) continue;

      await ctx.db.insert("zermindNodes", {
        chatId: args.chatId,
        agentThreadId: args.agentThreadId,
        agentMessageId: message.agentMessageId,
        parentAgentMessageId: args.parentAgentMessageId,
        branchName: args.branchName,
        xPosition: index * 260,
        yPosition: message.role === "user" ? 0 : 180,
        nodeType: "conversation",
        isCollapsed: false,
        isLocked: false,
        lastEditedBy: args.userId,
        createdAt: message.createdAt,
      });
      index += 1;
    }
    return null;
  },
});
