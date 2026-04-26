"use node";

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
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const userId = await requireActionUserId(ctx);
    const chat = await ctx.runQuery(internal.agentChat.getForSend, {
      chatId: args.chatId,
      userId,
    });

    if (!chat) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Chat not found" });
    }

    const languageModel = await resolveLanguageModel(ctx, userId, args.model);

    const result = await zermindAgent.streamText(
      ctx,
      { userId, threadId: chat.agentThreadId },
      {
        prompt: args.prompt,
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
