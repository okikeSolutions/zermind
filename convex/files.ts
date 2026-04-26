import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { rateLimiter } from "./rateLimits";

const fileType = v.union(v.literal("image"), v.literal("document"));

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "fileUploadUrlBurst", { key: userId, throws: true });
    await rateLimiter.limit(ctx, "fileUploadUrlHourly", { key: userId, throws: true });
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveUploadedFile = mutation({
  args: {
    storageId: v.id("_storage"),
    chatId: v.optional(v.id("chats")),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
    type: fileType,
  },
  returns: v.object({
    id: v.string(),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
    url: v.string(),
    storageId: v.id("_storage"),
    type: fileType,
  }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "fileSaveHourly", { key: userId, throws: true });

    if (args.chatId) {
      const chat = await ctx.db.get(args.chatId);
      if (!chat || chat.userId !== userId) {
        throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
      }
    }

    const metadata = await ctx.db.system.get(args.storageId);
    if (!metadata) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Uploaded file not found" });
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Uploaded file not available" });
    }

    await ctx.db.insert("fileAttachments", {
      userId,
      chatId: args.chatId,
      storageId: args.storageId,
      name: args.name,
      mimeType: args.mimeType,
      size: args.size,
      type: args.type,
      createdAt: Date.now(),
    });

    return {
      id: args.storageId,
      name: args.name,
      mimeType: args.mimeType,
      size: args.size,
      url,
      storageId: args.storageId,
      type: args.type,
    };
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const remove = mutation({
  args: { storageId: v.id("_storage") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const record = await ctx.db
      .query("fileAttachments")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .first();

    if (!record || record.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "File not found" });
    }

    await ctx.storage.delete(args.storageId);
    await ctx.db.delete(record._id);
    return { success: true };
  },
});
