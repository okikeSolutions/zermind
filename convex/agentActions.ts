"use node";

import type { ModelMessage } from "ai";
import { ConvexError, v } from "convex/values";
import { action, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { zermindAgent } from "./agent";
import { resolveLanguageModel } from "./lib/modelProvider";

async function requireActionUserId(ctx: ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return identity.tokenIdentifier;
}

export const send = action({
  args: {
    chatId: v.id("chats"),
    prompt: v.string(),
    model: v.string(),
    temperature: v.optional(v.number()),
    parentAgentMessageId: v.optional(v.string()),
    branchName: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          mimeType: v.string(),
          size: v.number(),
          url: v.string(),
          storageId: v.optional(v.id("_storage")),
          type: v.union(v.literal("image"), v.literal("document")),
        }),
      ),
    ),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await requireActionUserId(ctx);
    await ctx.runMutation(internal.rateLimits.limitAiSend, { userId });

    const chat = await ctx.runQuery(internal.agentChat.getForSend, {
      chatId: args.chatId,
      userId,
    });

    if (!chat) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
    }

    const languageModel = await resolveLanguageModel(ctx, userId, args.model);

    const content: ModelMessage[] = [
      {
        role: "user",
        content: [
          { type: "text", text: args.prompt },
          ...(await Promise.all(
            (args.attachments ?? []).map(async (attachment) => {
              if (!attachment.storageId) {
                throw new ConvexError({
                  code: "INVALID_ATTACHMENT",
                  message: "Attachment storage ID is required",
                });
              }
              const { authorized } = await ctx.runQuery(internal.files.authorizeForSend, {
                storageId: attachment.storageId,
                chatId: args.chatId,
                userId,
              });
              if (!authorized) {
                throw new ConvexError({ code: "NOT_FOUND", message: "Attachment not found" });
              }
              const url = await ctx.storage.getUrl(attachment.storageId);
              if (!url) {
                throw new ConvexError({ code: "NOT_FOUND", message: "Attachment not found" });
              }
              return attachment.type === "image"
                ? { type: "image" as const, image: url, mediaType: attachment.mimeType }
                : {
                    type: "file" as const,
                    data: url,
                    mediaType: attachment.mimeType,
                    filename: attachment.name,
                  };
            }),
          )),
        ],
      },
    ];

    const result = await zermindAgent.streamText(
      ctx,
      { userId, threadId: chat.agentThreadId },
      {
        prompt: content,
        model: languageModel,
        temperature: args.temperature ?? 0.7,
      },
      { saveStreamDeltas: true },
    );

    await ctx.runMutation(internal.zermindNodes.ensureForAgentMessages, {
      chatId: args.chatId,
      agentThreadId: chat.agentThreadId,
      userId,
      parentAgentMessageId: args.parentAgentMessageId,
      branchName: args.branchName,
      messages: (result.savedMessages ?? []).map((message) => ({
        agentMessageId: message._id,
        role: message.message?.role ?? "assistant",
        createdAt: message._creationTime,
      })),
    });

    await ctx.runMutation(internal.usage.logInternal, {
      userId,
      model: args.model,
      chatId: args.chatId,
      agentThreadId: chat.agentThreadId,
    });

    return { success: true };
  },
});
