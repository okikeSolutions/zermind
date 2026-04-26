import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { type Id } from "./_generated/dataModel";
import { attachment, chatMode, messageRole, nodeType } from "./schema";

const chatDoc = v.object({
  _id: v.id("chats"),
  _creationTime: v.number(),
  userId: v.string(),
  title: v.optional(v.string()),
  shareId: v.optional(v.string()),
  mode: chatMode,
  isCollaborative: v.boolean(),
  templateId: v.optional(v.id("conversationTemplates")),
  createdAt: v.number(),
  updatedAt: v.number(),
});

const messagePreview = v.object({
  content: v.string(),
  createdAt: v.number(),
  attachments: v.array(attachment),
});

const chatListItem = v.object({
  _id: v.id("chats"),
  _creationTime: v.number(),
  userId: v.string(),
  title: v.optional(v.string()),
  shareId: v.optional(v.string()),
  mode: chatMode,
  isCollaborative: v.boolean(),
  templateId: v.optional(v.id("conversationTemplates")),
  createdAt: v.number(),
  updatedAt: v.number(),
  messages: v.array(messagePreview),
});

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

const chatWithMessages = v.object({
  _id: v.id("chats"),
  _creationTime: v.number(),
  userId: v.string(),
  title: v.optional(v.string()),
  shareId: v.optional(v.string()),
  mode: chatMode,
  isCollaborative: v.boolean(),
  templateId: v.optional(v.id("conversationTemplates")),
  createdAt: v.number(),
  updatedAt: v.number(),
  messages: v.array(messageDoc),
});

async function requireOwnedChat(ctx: Parameters<typeof requireUserId>[0], chatId: Id<"chats">) {
  const userId = await requireUserId(ctx);
  const chat = await ctx.db.get(chatId);

  if (!chat || chat.userId !== userId) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "Chat not found",
    });
  }

  return { chat, userId };
}

export const listMine = query({
  args: {},
  returns: v.array(chatListItem),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId_and_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return await Promise.all(
      chats.map(async (chat) => {
        const latestMessages = await ctx.db
          .query("messages")
          .withIndex("by_chatId_and_createdAt", (q) => q.eq("chatId", chat._id))
          .order("desc")
          .take(1);

        return {
          ...chat,
          messages: latestMessages.map((message) => ({
            content: message.content,
            createdAt: message.createdAt,
            attachments: message.attachments,
          })),
        };
      }),
    );
  },
});

export const get = query({
  args: { chatId: v.id("chats") },
  returns: v.union(chatDoc, v.null()),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat || chat.userId !== userId) {
      return null;
    }

    return chat;
  },
});

export const getWithMessages = query({
  args: { chatId: v.id("chats") },
  returns: v.union(chatWithMessages, v.null()),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) {
      return null;
    }

    if (chat.userId !== userId) {
      const cutoff = Date.now() - 5 * 60 * 1000;
      const session = await ctx.db
        .query("collaborationSessions")
        .withIndex("by_chatId_and_lastActivity", (q) =>
          q.eq("chatId", args.chatId).gte("lastActivity", cutoff),
        )
        .order("desc")
        .first();

      if (!session) return null;

      const participant = await ctx.db
        .query("sessionParticipants")
        .withIndex("by_sessionId_and_userId", (q) =>
          q.eq("sessionId", session._id).eq("userId", userId),
        )
        .first();

      if (!participant) return null;
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId_and_createdAt", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .take(500);

    return { ...chat, messages };
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    mode: v.optional(chatMode),
  },
  returns: chatDoc,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const now = Date.now();

    const chatId = await ctx.db.insert("chats", {
      userId,
      title: args.title,
      mode: args.mode ?? "chat",
      isCollaborative: false,
      createdAt: now,
      updatedAt: now,
    });

    const chat = await ctx.db.get(chatId);
    if (!chat) {
      throw new ConvexError({ code: "INTERNAL_ERROR", message: "Chat not created" });
    }
    return chat;
  },
});

export const updateTitle = mutation({
  args: {
    chatId: v.id("chats"),
    title: v.string(),
  },
  returns: chatDoc,
  handler: async (ctx, args) => {
    await requireOwnedChat(ctx, args.chatId);

    await ctx.db.patch(args.chatId, {
      title: args.title,
      updatedAt: Date.now(),
    });

    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
    }
    return chat;
  },
});

export const remove = mutation({
  args: { chatId: v.id("chats") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    await requireOwnedChat(ctx, args.chatId);

    const [messages, sessions, participants, invitations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .take(1000),
      ctx.db
        .query("collaborationSessions")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .take(1000),
      ctx.db
        .query("sessionParticipants")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .take(1000),
      ctx.db
        .query("collaborationInvitations")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .take(1000),
    ]);

    await Promise.all([
      ...messages.map((message) => ctx.db.delete(message._id)),
      ...participants.map((participant) => ctx.db.delete(participant._id)),
      ...sessions.map((session) => ctx.db.delete(session._id)),
      ...invitations.map((invitation) => ctx.db.delete(invitation._id)),
    ]);
    await ctx.db.delete(args.chatId);

    return { success: true };
  },
});

export const generateShareLink = mutation({
  args: { chatId: v.id("chats") },
  returns: v.object({ shareId: v.string() }),
  handler: async (ctx, args) => {
    await requireOwnedChat(ctx, args.chatId);
    const shareId = crypto.randomUUID();

    await ctx.db.patch(args.chatId, {
      shareId,
      updatedAt: Date.now(),
    });

    return { shareId };
  },
});

export const removeShareLink = mutation({
  args: { chatId: v.id("chats") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    await requireOwnedChat(ctx, args.chatId);
    await ctx.db.patch(args.chatId, {
      shareId: undefined,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});
