import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { type Id } from "./_generated/dataModel";
import { attachment, chatMode, collaborationRole, messageRole, nodeType } from "./schema";
import { requireUserId } from "./lib/auth";

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

const collaborationChat = v.object({
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
  returns: v.union(
    v.object({
      chat: collaborationChat,
      session: sessionInfo,
      userId: v.string(),
      userRole: collaborationRole,
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
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

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId_and_createdAt", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .take(500);

    const sessionData = await formatSession(ctx, session, userId);
    return {
      chat: { ...chat, isCollaborative: true, messages },
      session: sessionData,
      userId,
      userRole: sessionData.userRole ?? (isOwner ? "owner" : "collaborator"),
    };
  },
});
