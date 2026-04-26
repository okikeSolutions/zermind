import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { listMessages, syncStreams, vStreamArgs } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { query, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireUserId } from "./lib/auth";

async function canAccessChat(ctx: Parameters<typeof requireUserId>[0], chatId: Id<"chats">) {
  const userId = await requireUserId(ctx);
  const chat = await ctx.db.get(chatId);
  if (!chat) return null;
  if (chat.userId === userId) return { chat, userId, role: "owner" as const };

  const cutoff = Date.now() - 5 * 60 * 1000;
  const session = await ctx.db
    .query("collaborationSessions")
    .withIndex("by_chatId_and_lastActivity", (q) =>
      q.eq("chatId", chatId).gte("lastActivity", cutoff),
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
  return { chat, userId, role: participant.role };
}

function toUiMessage(messageDoc: {
  _id: string;
  _creationTime: number;
  status: string;
  message?: { role: string };
  text?: string;
  model?: string;
  error?: string;
}) {
  const role = messageDoc.message?.role === "user" ? "user" : "assistant";
  return {
    _id: messageDoc._id,
    _creationTime: messageDoc._creationTime,
    chatId: "agent",
    role,
    content: messageDoc.text ?? messageDoc.error ?? "",
    model: role === "assistant" ? messageDoc.model : undefined,
    attachments: [],
    xPosition: 0,
    yPosition: 0,
    nodeType: "conversation",
    isCollapsed: false,
    isLocked: false,
    createdAt: messageDoc._creationTime,
    status: messageDoc.status,
  };
}

export const getWithMessages = query({
  args: { chatId: v.id("chats") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const access = await canAccessChat(ctx, args.chatId);
    if (!access) return null;

    const paginated = await listMessages(ctx, components.agent, {
      threadId: access.chat.agentThreadId,
      paginationOpts: { numItems: 500, cursor: null },
      excludeToolMessages: true,
    });

    const nodes = await ctx.db
      .query("zermindNodes")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .take(1000);
    const nodesByAgentMessageId = new Map(nodes.map((node) => [node.agentMessageId, node]));

    return {
      ...access.chat,
      messages: paginated.page
        .filter(
          (message) => message.message?.role === "user" || message.message?.role === "assistant",
        )
        .map((message) => {
          const uiMessage = toUiMessage(message);
          const node = nodesByAgentMessageId.get(message._id);
          return node
            ? {
                ...uiMessage,
                chatId: args.chatId,
                parentId: node.parentAgentMessageId,
                branchName: node.branchName,
                xPosition: node.xPosition,
                yPosition: node.yPosition,
                nodeType: node.nodeType,
                isCollapsed: node.isCollapsed,
                isLocked: node.isLocked,
                lastEditedBy: node.lastEditedBy,
                editedAt: node.editedAt,
                createdAt: node.createdAt,
              }
            : { ...uiMessage, chatId: args.chatId };
        }),
    };
  },
});

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: v.optional(vStreamArgs),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_agentThreadId", (q) => q.eq("agentThreadId", args.threadId))
      .first();
    if (!chat || chat.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Thread not found" });
    }

    const paginated = await listMessages(ctx, components.agent, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
      excludeToolMessages: true,
    });
    const streams = args.streamArgs
      ? await syncStreams(ctx, components.agent, {
          threadId: args.threadId,
          streamArgs: args.streamArgs,
        })
      : undefined;
    return { ...paginated, streams };
  },
});

export const getForSend = internalQuery({
  args: { chatId: v.id("chats"), userId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("chats"),
      userId: v.string(),
      agentThreadId: v.string(),
      title: v.optional(v.string()),
      isCollaborative: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) return null;
    const sendableChat = {
      _id: chat._id,
      userId: chat.userId,
      agentThreadId: chat.agentThreadId,
      title: chat.title,
      isCollaborative: chat.isCollaborative,
    };
    if (chat.userId === args.userId) return sendableChat;

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
        q.eq("sessionId", session._id).eq("userId", args.userId),
      )
      .first();
    if (!participant || participant.role === "viewer") return null;
    return sendableChat;
  },
});
