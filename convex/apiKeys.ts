import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import type { Id } from "./_generated/dataModel";

const provider = v.union(
  v.literal("openrouter"),
  v.literal("openai"),
  v.literal("anthropic"),
  v.literal("meta"),
  v.literal("google"),
);

const publicApiKey = v.object({
  _id: v.id("apiKeys"),
  _creationTime: v.number(),
  provider,
  keyName: v.string(),
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
  lastUsedAt: v.optional(v.number()),
  keyPreview: v.string(),
});

function toPublicApiKey(key: {
  _id: Id<"apiKeys">;
  _creationTime: number;
  provider: "openrouter" | "openai" | "anthropic" | "meta" | "google";
  keyName: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  lastUsedAt?: number;
  keyPreview: string;
}) {
  return {
    _id: key._id,
    _creationTime: key._creationTime,
    provider: key.provider,
    keyName: key.keyName,
    isActive: key.isActive,
    createdAt: key.createdAt,
    updatedAt: key.updatedAt,
    lastUsedAt: key.lastUsedAt,
    keyPreview: key.keyPreview,
  };
}

export const listMine = query({
  args: {},
  returns: v.array(publicApiKey),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);

    return keys
      .sort((a, b) => Number(b.isActive) - Number(a.isActive) || b.createdAt - a.createdAt)
      .map((key) => toPublicApiKey(key));
  },
});

export const update = mutation({
  args: {
    keyId: v.id("apiKeys"),
    keyName: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  returns: publicApiKey,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const key = await ctx.db.get(args.keyId);

    if (!key || key.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "API key not found" });
    }

    await ctx.db.patch(args.keyId, {
      ...(args.keyName !== undefined ? { keyName: args.keyName } : {}),
      ...(args.isActive !== undefined ? { isActive: args.isActive } : {}),
      updatedAt: Date.now(),
    });

    const updated = await ctx.db.get(args.keyId);
    if (!updated) {
      throw new ConvexError({ code: "NOT_FOUND", message: "API key not found" });
    }

    return toPublicApiKey(updated);
  },
});

export const remove = mutation({
  args: { keyId: v.id("apiKeys") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const key = await ctx.db.get(args.keyId);

    if (!key || key.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "API key not found" });
    }

    await ctx.db.delete(args.keyId);
    return { success: true };
  },
});

export const createEncrypted = internalMutation({
  args: {
    userId: v.string(),
    provider,
    encryptedKey: v.string(),
    keyPreview: v.string(),
    keyName: v.string(),
  },
  returns: publicApiKey,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("apiKeys")
      .withIndex("by_userId_and_provider_and_keyName", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider).eq("keyName", args.keyName),
      )
      .unique();

    if (existing) {
      throw new ConvexError({
        code: "DUPLICATE_KEY_NAME",
        message: "A key with this name already exists for this provider",
      });
    }

    const now = Date.now();
    const id = await ctx.db.insert("apiKeys", {
      userId: args.userId,
      provider: args.provider,
      encryptedKey: args.encryptedKey,
      keyPreview: args.keyPreview,
      keyName: args.keyName,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    const key = await ctx.db.get(id);
    if (!key) {
      throw new ConvexError({ code: "INTERNAL_ERROR", message: "API key not created" });
    }

    return toPublicApiKey(key);
  },
});

export const getActiveEncrypted = internalQuery({
  args: {
    userId: v.string(),
    provider,
  },
  returns: v.union(
    v.object({
      _id: v.id("apiKeys"),
      encryptedKey: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_userId_and_provider", (q) =>
        q.eq("userId", args.userId).eq("provider", args.provider),
      )
      .take(50);

    const activeKeys = keys.filter((key) => key.isActive);
    activeKeys.sort((a, b) => (b.lastUsedAt ?? 0) - (a.lastUsedAt ?? 0));
    const key = activeKeys[0];

    if (!key) return null;
    return { _id: key._id, encryptedKey: key.encryptedKey };
  },
});

export const markUsed = internalMutation({
  args: { keyId: v.id("apiKeys") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.keyId, { lastUsedAt: Date.now(), updatedAt: Date.now() });
    return null;
  },
});
