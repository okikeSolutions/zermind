import { listMessages } from "@convex-dev/agent";
import { ConvexError, v } from "convex/values";
import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { type Doc, type Id } from "./_generated/dataModel";
import { chatMode } from "./schema";
import { zermindAgent } from "./agent";
import { requireUserId } from "./lib/auth";
import { rateLimiter } from "./rateLimits";

const chatDoc = v.object({
  _id: v.id("chats"),
  _creationTime: v.number(),
  userId: v.string(),
  agentThreadId: v.string(),
  title: v.optional(v.string()),
  shareId: v.optional(v.string()),
  mode: chatMode,
  isCollaborative: v.boolean(),
  templateId: v.optional(v.id("conversationTemplates")),
  createdAt: v.number(),
  updatedAt: v.number(),
});

async function requireOwnedChat(ctx: Parameters<typeof requireUserId>[0], chatId: Id<"chats">) {
  const userId = await requireUserId(ctx);
  const chat = await ctx.db.get(chatId);

  if (!chat || chat.userId !== userId) {
    throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
  }

  return { chat, userId };
}

function extractAttachments(message?: { content?: unknown }) {
  if (!message || !Array.isArray(message.content)) return [];
  return message.content.flatMap((part, index) => {
    if (typeof part !== "object" || part === null || !("type" in part)) return [];
    const typedPart = part as {
      type: string;
      image?: string;
      data?: string;
      mediaType?: string;
      mimeType?: string;
      filename?: string;
    };
    if (typedPart.type !== "image" && typedPart.type !== "file") return [];
    const url = typedPart.type === "image" ? typedPart.image : typedPart.data;
    if (!url) return [];
    const mimeType = typedPart.mediaType ?? typedPart.mimeType ?? "application/octet-stream";
    const attachmentType: "image" | "document" = typedPart.type === "image" ? "image" : "document";
    return [
      {
        id: `${typedPart.type}-${index}`,
        name: typedPart.filename ?? (typedPart.type === "image" ? "Image" : "File"),
        mimeType,
        size: 0,
        url,
        type: attachmentType,
      },
    ];
  });
}

function toUiAgentMessage(
  chatId: Id<"chats">,
  messageDoc: {
    _id: string;
    _creationTime: number;
    status: string;
    message?: { role: string; content?: unknown };
    text?: string;
    model?: string;
    error?: string;
  },
  node?: {
    parentAgentMessageId?: string;
    branchName?: string;
    xPosition: number;
    yPosition: number;
    nodeType: "conversation" | "branching_point" | "insight";
    isCollapsed: boolean;
    isLocked: boolean;
    lastEditedBy?: string;
    editedAt?: number;
    createdAt: number;
  },
) {
  const role = messageDoc.message?.role === "user" ? "user" : "assistant";
  return {
    _id: messageDoc._id,
    _creationTime: messageDoc._creationTime,
    chatId,
    parentId: node?.parentAgentMessageId,
    branchName: node?.branchName,
    role,
    content: messageDoc.text ?? messageDoc.error ?? "",
    model: role === "assistant" ? messageDoc.model : undefined,
    attachments: extractAttachments(messageDoc.message),
    xPosition: node?.xPosition ?? 0,
    yPosition: node?.yPosition ?? 0,
    nodeType: node?.nodeType ?? "conversation",
    isCollapsed: node?.isCollapsed ?? false,
    isLocked: node?.isLocked ?? false,
    lastEditedBy: node?.lastEditedBy,
    editedAt: node?.editedAt,
    createdAt: node?.createdAt ?? messageDoc._creationTime,
    status: messageDoc.status,
  };
}

export const listMine = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId_and_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return await Promise.all(
      chats.map(async (chat) => {
        const latest = await listMessages(ctx, components.agent, {
          threadId: chat.agentThreadId,
          paginationOpts: { numItems: 1, cursor: null },
          excludeToolMessages: true,
        });
        return {
          ...chat,
          messages: latest.page.map((message) => ({
            content: message.text ?? "",
            createdAt: message._creationTime,
            attachments: [],
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
    if (!chat || chat.userId !== userId) return null;
    return chat;
  },
});

async function chatWithAgentMessages(
  ctx: Parameters<typeof requireUserId>[0],
  chat: Doc<"chats">,
  chatId: Id<"chats">,
) {
  const [paginated, nodes] = await Promise.all([
    listMessages(ctx, components.agent, {
      threadId: chat.agentThreadId,
      paginationOpts: { numItems: 500, cursor: null },
      excludeToolMessages: true,
    }),
    ctx.db
      .query("zermindNodes")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
      .take(1000),
  ]);
  const nodesByMessageId = new Map(nodes.map((node) => [node.agentMessageId, node]));

  return {
    ...chat,
    messages: paginated.page
      .filter(
        (message) => message.message?.role === "user" || message.message?.role === "assistant",
      )
      .map((message) => toUiAgentMessage(chatId, message, nodesByMessageId.get(message._id))),
  };
}

export const getWithMessages = query({
  args: { chatId: v.id("chats") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    if (!chat) return null;

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

    return await chatWithAgentMessages(ctx, chat, args.chatId);
  },
});

export const getShared = query({
  args: { shareId: v.string() },
  returns: v.any(),
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .first();
    if (!chat) return null;
    return await chatWithAgentMessages(ctx, chat, chat._id);
  },
});

export const create = mutation({
  args: { title: v.optional(v.string()), mode: v.optional(chatMode) },
  returns: chatDoc,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "chatCreate", { key: userId, throws: true });

    const now = Date.now();
    const { threadId } = await zermindAgent.createThread(ctx, {
      userId,
      title: args.title ?? "Untitled Chat",
    });

    const chatId = await ctx.db.insert("chats", {
      userId,
      agentThreadId: threadId,
      title: args.title,
      mode: args.mode ?? "chat",
      isCollaborative: false,
      createdAt: now,
      updatedAt: now,
    });

    const chat = await ctx.db.get(chatId);
    if (!chat) throw new ConvexError({ code: "INTERNAL_ERROR", message: "Chat not created" });
    return chat;
  },
});

export const updateTitle = mutation({
  args: { chatId: v.id("chats"), title: v.string() },
  returns: chatDoc,
  handler: async (ctx, args) => {
    await requireOwnedChat(ctx, args.chatId);
    await ctx.db.patch(args.chatId, { title: args.title, updatedAt: Date.now() });
    const chat = await ctx.db.get(args.chatId);
    if (!chat) throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
    return chat;
  },
});

export const remove = mutation({
  args: { chatId: v.id("chats") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const { chat } = await requireOwnedChat(ctx, args.chatId);
    const agentThreadId = chat.agentThreadId;
    const [nodes, files, sessions, participants, invitations] = await Promise.all([
      ctx.db
        .query("zermindNodes")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .take(1000),
      ctx.db
        .query("fileAttachments")
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
      ...nodes.map((node) => ctx.db.delete(node._id)),
      ...files.map((file) => ctx.storage.delete(file.storageId)),
      ...files.map((file) => ctx.db.delete(file._id)),
      ...participants.map((participant) => ctx.db.delete(participant._id)),
      ...sessions.map((session) => ctx.db.delete(session._id)),
      ...invitations.map((invitation) => ctx.db.delete(invitation._id)),
    ]);
    await ctx.db.delete(args.chatId);
    await zermindAgent.deleteThreadAsync(ctx, { threadId: agentThreadId });
    return { success: true };
  },
});

export const generateShareLink = mutation({
  args: { chatId: v.id("chats") },
  returns: v.object({ shareId: v.string() }),
  handler: async (ctx, args) => {
    const { userId } = await requireOwnedChat(ctx, args.chatId);
    await rateLimiter.limit(ctx, "shareLinkGenerate", { key: userId, throws: true });

    const shareId = crypto.randomUUID();
    await ctx.db.patch(args.chatId, { shareId, updatedAt: Date.now() });
    return { shareId };
  },
});

export const removeShareLink = mutation({
  args: { chatId: v.id("chats") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    await requireOwnedChat(ctx, args.chatId);
    await ctx.db.patch(args.chatId, { shareId: undefined, updatedAt: Date.now() });
    return { success: true };
  },
});
