import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";

export const log = mutation({
  args: {
    model: v.string(),
    chatId: v.optional(v.id("chats")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await ctx.db.insert("usageLogs", {
      userId,
      model: args.model,
      chatId: args.chatId,
      createdAt: Date.now(),
    });
    return null;
  },
});

export const logInternal = internalMutation({
  args: {
    userId: v.string(),
    model: v.string(),
    chatId: v.optional(v.id("chats")),
    agentThreadId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("usageLogs", {
      userId: args.userId,
      model: args.model,
      chatId: args.chatId,
      agentThreadId: args.agentThreadId,
      createdAt: Date.now(),
    });
    return null;
  },
});

export const myStats = query({
  args: {},
  returns: v.object({
    totalRequests: v.number(),
    modelUsage: v.record(v.string(), v.number()),
    dailyUsage: v.record(v.string(), v.number()),
    userCount: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const logs = await ctx.db
      .query("usageLogs")
      .withIndex("by_userId_and_createdAt", (q) =>
        q.eq("userId", userId).gte("createdAt", thirtyDaysAgo),
      )
      .take(1000);

    const allUserLogs = await ctx.db
      .query("usageLogs")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1000);

    const modelUsage: Record<string, number> = {};
    const dailyUsage: Record<string, number> = {};

    for (const log of logs) {
      modelUsage[log.model] = (modelUsage[log.model] ?? 0) + 1;
      const date = new Date(log.createdAt).toISOString().split("T")[0];
      dailyUsage[date] = (dailyUsage[date] ?? 0) + 1;
    }

    return {
      totalRequests: allUserLogs.length,
      modelUsage,
      dailyUsage,
      userCount: 1,
    };
  },
});
