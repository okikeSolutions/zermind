import { Presence } from "@convex-dev/presence";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireUserId } from "./lib/auth";

export const presence = new Presence(components.presence);

const presenceData = v.object({
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  color: v.optional(v.string()),
  cursor: v.optional(v.object({ x: v.number(), y: v.number() })),
  selectedNodeId: v.optional(v.union(v.string(), v.null())),
  updatedAt: v.optional(v.number()),
});

const presenceState = v.object({
  userId: v.string(),
  online: v.boolean(),
  lastDisconnected: v.number(),
  data: v.optional(presenceData),
});

function normalizePresenceData(data: unknown) {
  if (typeof data !== "object" || data === null) return undefined;
  const value = data as {
    name?: unknown;
    email?: unknown;
    color?: unknown;
    cursor?: unknown;
    selectedNodeId?: unknown;
    updatedAt?: unknown;
  };
  const cursor =
    typeof value.cursor === "object" &&
    value.cursor !== null &&
    typeof (value.cursor as { x?: unknown }).x === "number" &&
    typeof (value.cursor as { y?: unknown }).y === "number"
      ? { x: (value.cursor as { x: number }).x, y: (value.cursor as { y: number }).y }
      : undefined;

  return {
    ...(typeof value.name === "string" ? { name: value.name } : {}),
    ...(typeof value.email === "string" ? { email: value.email } : {}),
    ...(typeof value.color === "string" ? { color: value.color } : {}),
    ...(cursor ? { cursor } : {}),
    ...(typeof value.selectedNodeId === "string" || value.selectedNodeId === null
      ? { selectedNodeId: value.selectedNodeId }
      : {}),
    ...(typeof value.updatedAt === "number" ? { updatedAt: value.updatedAt } : {}),
  };
}

async function requirePresenceRoomAccess(ctx: MutationCtx, roomId: string, userId: string) {
  const authenticatedUserId = await requireUserId(ctx);
  if (userId !== authenticatedUserId) {
    throw new Error("Presence user mismatch");
  }

  const chatIdString = roomId.startsWith("chat-collaboration:")
    ? roomId.slice("chat-collaboration:".length)
    : null;
  if (!chatIdString) {
    throw new Error("Invalid presence room");
  }

  const chatId = ctx.db.normalizeId("chats", chatIdString);
  if (!chatId) {
    throw new Error("Invalid presence room");
  }

  const chat = await ctx.db.get(chatId);
  if (!chat) {
    throw new Error("Presence room not found");
  }
  if (chat.userId === authenticatedUserId) return;

  const cutoff = Date.now() - 5 * 60 * 1000;
  const session = await ctx.db
    .query("collaborationSessions")
    .withIndex("by_chatId_and_lastActivity", (q) =>
      q.eq("chatId", chatId).gte("lastActivity", cutoff),
    )
    .order("desc")
    .first();
  if (!session) {
    throw new Error("Presence room not found");
  }

  const participant = await ctx.db
    .query("sessionParticipants")
    .withIndex("by_sessionId_and_userId", (q) =>
      q.eq("sessionId", session._id).eq("userId", authenticatedUserId),
    )
    .first();
  if (!participant) {
    throw new Error("Presence room not found");
  }
}

export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  returns: v.object({
    roomToken: v.string(),
    sessionToken: v.string(),
  }),
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    await requirePresenceRoomAccess(ctx, roomId, userId);
    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

export const list = query({
  args: { roomToken: v.string() },
  returns: v.array(presenceState),
  handler: async (ctx, { roomToken }) => {
    const users = await presence.list(ctx, roomToken);
    return users.map((user) => ({
      userId: user.userId,
      online: user.online,
      lastDisconnected: user.lastDisconnected,
      data: normalizePresenceData(user.data),
    }));
  },
});

export const updateData = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    data: v.optional(presenceData),
  },
  returns: v.null(),
  handler: async (ctx, { roomId, userId, data }) => {
    await requirePresenceRoomAccess(ctx, roomId, userId);
    return await presence.updateRoomUser(ctx, roomId, userId, data);
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  returns: v.null(),
  handler: async (ctx, { sessionToken }) => {
    return await presence.disconnect(ctx, sessionToken);
  },
});
