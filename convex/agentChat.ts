import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export const getForSend = internalQuery({
  args: { chatId: v.id("chats"), userId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("chats"),
      userId: v.string(),
      agentThreadId: v.string(),
      title: v.optional(v.string()),
      isCollaborative: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) return null;
    const sendableChat = {
      _id: chat._id,
      userId: chat.userId,
      agentThreadId: chat.agentThreadId,
      title: chat.title,
      isCollaborative: chat.isCollaborative,
    };
    if (chat.userId === args.userId) return sendableChat;

    const cutoff = Date.now() - 5 * 60 * 1000;
    const session = await ctx.db
      .query("collaborationSessions")
      .withIndex("by_chatId_and_lastActivity", (q) =>
        q.eq("chatId", args.chatId).gte("lastActivity", cutoff),
      )
      .order("desc")
      .first();
    if (!session) return null;
    const participant = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_sessionId_and_userId", (q) =>
        q.eq("sessionId", session._id).eq("userId", args.userId),
      )
      .first();
    if (!participant || participant.role === "viewer") return null;
    return sendableChat;
  },
});
