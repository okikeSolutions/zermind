import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { rateLimiter } from "./rateLimits";

const feedbackType = v.union(
  v.literal("bug"),
  v.literal("feature"),
  v.literal("general"),
  v.literal("improvement"),
  v.literal("complaint"),
  v.literal("compliment"),
);

const feedbackDoc = v.object({
  _id: v.id("feedback"),
  _creationTime: v.number(),
  userId: v.string(),
  message: v.string(),
  type: v.string(),
  status: v.string(),
  priority: v.string(),
  userAgent: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const create = mutation({
  args: {
    message: v.string(),
    type: v.optional(feedbackType),
    userAgent: v.optional(v.string()),
  },
  returns: feedbackDoc,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "feedbackCreate", { key: userId, throws: true });

    const now = Date.now();
    const id = await ctx.db.insert("feedback", {
      userId,
      message: args.message,
      type: args.type ?? "general",
      status: "open",
      priority: "medium",
      userAgent: args.userAgent,
      createdAt: now,
      updatedAt: now,
    });

    const feedback = await ctx.db.get(id);
    if (!feedback) {
      throw new Error("Feedback not created");
    }
    return feedback;
  },
});
