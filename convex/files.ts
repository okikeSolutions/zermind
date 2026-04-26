import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { rateLimiter } from "./rateLimits";

const fileType = v.union(v.literal("image"), v.literal("document"));
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

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

    const existingRecord = await ctx.db
      .query("fileAttachments")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .first();
    if (existingRecord) {
      throw new ConvexError({ code: "DUPLICATE_FILE", message: "Uploaded file already saved" });
    }

    const metadata = await ctx.db.system.get(args.storageId);
    if (!metadata) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Uploaded file not found" });
    }
    if (metadata.size > MAX_FILE_SIZE_BYTES || metadata.size !== args.size) {
      throw new ConvexError({ code: "INVALID_FILE", message: "Invalid uploaded file size" });
    }
    if (metadata.contentType && metadata.contentType !== args.mimeType) {
      throw new ConvexError({ code: "INVALID_FILE", message: "Invalid uploaded file type" });
    }
    if (!ALLOWED_MIME_TYPES.has(args.mimeType)) {
      throw new ConvexError({ code: "INVALID_FILE", message: "Unsupported file type" });
    }
    if (args.type === "image" && !args.mimeType.startsWith("image/")) {
      throw new ConvexError({ code: "INVALID_FILE", message: "Invalid image attachment" });
    }
    if (args.type === "document" && args.mimeType !== "application/pdf") {
      throw new ConvexError({ code: "INVALID_FILE", message: "Invalid document attachment" });
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
    const userId = await requireUserId(ctx);
    const record = await ctx.db
      .query("fileAttachments")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .first();
    if (!record || record.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "File not found" });
    }
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const authorizeForSend = internalQuery({
  args: {
    storageId: v.id("_storage"),
    chatId: v.id("chats"),
    userId: v.string(),
  },
  returns: v.object({ authorized: v.boolean() }),
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("fileAttachments")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .first();

    return {
      authorized:
        !!record &&
        record.userId === args.userId &&
        (record.chatId === undefined || record.chatId === args.chatId),
    };
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
