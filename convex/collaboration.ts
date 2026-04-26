import { listMessages } from "@convex-dev/agent";
import { ConvexError, v } from "convex/values";
import { components } from "./_generated/api";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { type Id } from "./_generated/dataModel";
import { chatMode, collaborationRole, nodeType } from "./schema";
import { requireUserId } from "./lib/auth";
import { rateLimiter } from "./rateLimits";

const ACTIVE_SESSION_MS = 5 * 60 * 1000;
const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const sessionInfo = v.object({
  id: v.id("collaborationSessions"),
  chatId: v.id("chats"),
  activeSince: v.number(),
  lastActivity: v.number(),
  participantCount: v.number(),
  isParticipant: v.boolean(),
  userRole: v.optional(collaborationRole),
});

const collaborationMessage = v.object({
  _id: v.string(),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  parentId: v.optional(v.string()),
  branchName: v.optional(v.string()),
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
  model: v.optional(v.string()),
  attachments: v.array(
    v.object({
      id: v.string(),
      name: v.string(),
      mimeType: v.string(),
      size: v.number(),
      url: v.string(),
      type: v.union(v.literal("image"), v.literal("document")),
    }),
  ),
  xPosition: v.number(),
  yPosition: v.number(),
  nodeType,
  isCollapsed: v.boolean(),
  isLocked: v.boolean(),
  lastEditedBy: v.optional(v.string()),
  editedAt: v.optional(v.number()),
  createdAt: v.number(),
});

const joinAndGetChatResult = v.object({
  chat: v.object({
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
    messages: v.array(collaborationMessage),
  }),
  session: sessionInfo,
  userId: v.string(),
  userRole: collaborationRole,
});

async function getActiveSession(ctx: QueryCtx | MutationCtx, chatId: Id<"chats">) {
  const cutoff = Date.now() - ACTIVE_SESSION_MS;
  return await ctx.db
    .query("collaborationSessions")
    .withIndex("by_chatId_and_lastActivity", (q) =>
      q.eq("chatId", chatId).gte("lastActivity", cutoff),
    )
    .order("desc")
    .first();
}

async function listParticipants(
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<"collaborationSessions">,
) {
  return await ctx.db
    .query("sessionParticipants")
    .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
    .collect();
}

async function ensureParticipant(
  ctx: MutationCtx,
  sessionId: Id<"collaborationSessions">,
  chatId: Id<"chats">,
  userId: string,
  role: "owner" | "collaborator" | "viewer",
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("sessionParticipants")
    .withIndex("by_sessionId_and_userId", (q) => q.eq("sessionId", sessionId).eq("userId", userId))
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, {
      role: existing.role === "owner" ? "owner" : role,
      lastActivity: now,
    });
    return existing._id;
  }

  return await ctx.db.insert("sessionParticipants", {
    sessionId,
    chatId,
    userId,
    role,
    joinedAt: now,
    lastActivity: now,
  });
}

async function formatSession(
  ctx: QueryCtx | MutationCtx,
  session: NonNullable<Awaited<ReturnType<typeof getActiveSession>>>,
  userId: string,
) {
  const participants = await listParticipants(ctx, session._id);
  const participant = participants.find((p) => p.userId === userId);

  return {
    id: session._id,
    chatId: session.chatId,
    activeSince: session.activeSince,
    lastActivity: session.lastActivity,
    participantCount: participants.length,
    isParticipant: Boolean(participant),
    userRole: participant?.role,
  };
}

export const getSession = query({
  args: { chatId: v.id("chats") },
  returns: v.union(sessionInfo, v.null()),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    if (!chat) return null;

    const session = await getActiveSession(ctx, args.chatId);
    if (!session) return null;

    if (chat.userId !== userId) {
      const participant = await ctx.db
        .query("sessionParticipants")
        .withIndex("by_sessionId_and_userId", (q) =>
          q.eq("sessionId", session._id).eq("userId", userId),
        )
        .first();
      if (!participant) return null;
    }

    return await formatSession(ctx, session, userId);
  },
});

export const start = mutation({
  args: { chatId: v.id("chats") },
  returns: sessionInfo,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "collaborationStart", { key: userId, throws: true });

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
    }

    const now = Date.now();
    let session = await getActiveSession(ctx, args.chatId);
    if (!session) {
      const sessionId = await ctx.db.insert("collaborationSessions", {
        chatId: args.chatId,
        activeSince: now,
        lastActivity: now,
      });
      await ctx.db.patch(args.chatId, { isCollaborative: true, updatedAt: now });
      session = await ctx.db.get(sessionId);
    } else {
      await ctx.db.patch(session._id, { lastActivity: now });
      session = await ctx.db.get(session._id);
    }

    if (!session) {
      throw new ConvexError({ code: "INTERNAL_ERROR", message: "Session not created" });
    }

    await ensureParticipant(ctx, session._id, args.chatId, userId, "owner");
    return await formatSession(ctx, session, userId);
  },
});

export const join = mutation({
  args: { chatId: v.id("chats") },
  returns: sessionInfo,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "collaborationJoin", { key: userId, throws: true });

    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
    }

    const now = Date.now();
    const isOwner = chat.userId === userId;
    let session = await getActiveSession(ctx, args.chatId);

    if (!session) {
      if (!isOwner) {
        throw new ConvexError({
          code: "NO_ACTIVE_SESSION",
          message: "No active collaboration session",
        });
      }
      const sessionId = await ctx.db.insert("collaborationSessions", {
        chatId: args.chatId,
        activeSince: now,
        lastActivity: now,
      });
      await ctx.db.patch(args.chatId, { isCollaborative: true, updatedAt: now });
      session = await ctx.db.get(sessionId);
    } else {
      await ctx.db.patch(session._id, { lastActivity: now });
      session = await ctx.db.get(session._id);
    }

    if (!session) {
      throw new ConvexError({ code: "INTERNAL_ERROR", message: "Session not found" });
    }

    if (!isOwner && !chat.isCollaborative) {
      throw new ConvexError({ code: "FORBIDDEN", message: "This chat is not collaborative" });
    }

    await ensureParticipant(
      ctx,
      session._id,
      args.chatId,
      userId,
      isOwner ? "owner" : "collaborator",
    );

    return await formatSession(ctx, session, userId);
  },
});

export const leave = mutation({
  args: { sessionId: v.id("collaborationSessions") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const participant = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_sessionId_and_userId", (q) =>
        q.eq("sessionId", args.sessionId).eq("userId", userId),
      )
      .first();

    if (participant) {
      await ctx.db.delete(participant._id);
    }

    const remaining = await listParticipants(ctx, args.sessionId);
    if (remaining.length === 0) {
      const session = await ctx.db.get(args.sessionId);
      if (session) await ctx.db.delete(args.sessionId);
    }

    return { success: true };
  },
});

export const end = mutation({
  args: { chatId: v.id("chats"), sessionId: v.id("collaborationSessions") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    const session = await ctx.db.get(args.sessionId);

    if (!chat || chat.userId !== userId || !session || session.chatId !== args.chatId) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Access denied" });
    }

    const participants = await listParticipants(ctx, args.sessionId);
    await Promise.all(participants.map((participant) => ctx.db.delete(participant._id)));
    await ctx.db.delete(args.sessionId);
    await ctx.db.patch(args.chatId, { isCollaborative: false, updatedAt: Date.now() });

    return { success: true };
  },
});

export const invite = mutation({
  args: {
    chatId: v.id("chats"),
    inviteeEmail: v.string(),
    role: v.union(v.literal("collaborator"), v.literal("viewer")),
    chatTitle: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean(), invitationId: v.id("collaborationInvitations") }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "collaborationInvite", { key: userId, throws: true });

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Only the chat owner can invite collaborators",
      });
    }

    const now = Date.now();
    const invitationId = await ctx.db.insert("collaborationInvitations", {
      chatId: args.chatId,
      inviterId: userId,
      inviteeEmail: args.inviteeEmail.trim().toLowerCase(),
      role: args.role,
      chatTitle: args.chatTitle || chat.title,
      createdAt: now,
      expiresAt: now + INVITATION_TTL_MS,
      status: "pending",
    });

    return { success: true, invitationId };
  },
});

export const joinAndGetChat = mutation({
  args: { chatId: v.id("chats") },
  returns: v.union(joinAndGetChatResult, v.null()),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "collaborationJoin", { key: userId, throws: true });

    const chat = await ctx.db.get(args.chatId);
    if (!chat) return null;

    const now = Date.now();
    const isOwner = chat.userId === userId;
    let session = await getActiveSession(ctx, args.chatId);

    if (!session) {
      if (!isOwner) return null;
      const sessionId = await ctx.db.insert("collaborationSessions", {
        chatId: args.chatId,
        activeSince: now,
        lastActivity: now,
      });
      await ctx.db.patch(args.chatId, { isCollaborative: true, updatedAt: now });
      session = await ctx.db.get(sessionId);
    } else {
      await ctx.db.patch(session._id, { lastActivity: now });
      session = await ctx.db.get(session._id);
    }

    if (!session || (!isOwner && !chat.isCollaborative)) return null;

    await ensureParticipant(
      ctx,
      session._id,
      args.chatId,
      userId,
      isOwner ? "owner" : "collaborator",
    );

    const [paginated, nodes] = await Promise.all([
      listMessages(ctx, components.agent, {
        threadId: chat.agentThreadId,
        paginationOpts: { numItems: 500, cursor: null },
        excludeToolMessages: true,
      }),
      ctx.db
        .query("zermindNodes")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .take(1000),
    ]);
    const nodesByMessageId = new Map(nodes.map((node) => [node.agentMessageId, node]));
    const messages = paginated.page
      .filter(
        (message) => message.message?.role === "user" || message.message?.role === "assistant",
      )
      .map((message) => {
        const node = nodesByMessageId.get(message._id);
        const role: "user" | "assistant" = message.message?.role === "user" ? "user" : "assistant";
        return {
          _id: message._id,
          _creationTime: message._creationTime,
          chatId: args.chatId,
          parentId: node?.parentAgentMessageId,
          branchName: node?.branchName,
          role,
          content: message.text ?? message.error ?? "",
          model: role === "assistant" ? message.model : undefined,
          attachments: [],
          xPosition: node?.xPosition ?? 0,
          yPosition: node?.yPosition ?? 0,
          nodeType: node?.nodeType ?? "conversation",
          isCollapsed: node?.isCollapsed ?? false,
          isLocked: node?.isLocked ?? false,
          lastEditedBy: node?.lastEditedBy,
          editedAt: node?.editedAt,
          createdAt: node?.createdAt ?? message._creationTime,
        };
      });

    const sessionData = await formatSession(ctx, session, userId);
    return {
      chat: { ...chat, isCollaborative: true, messages },
      session: sessionData,
      userId,
      userRole: sessionData.userRole ?? (isOwner ? "owner" : "collaborator"),
    };
  },
});
