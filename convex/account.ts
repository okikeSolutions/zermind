import { listMessages } from "@convex-dev/agent";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { zermindAgent } from "./agent";
import { requireUserId } from "./lib/auth";
import { rateLimiter } from "./rateLimits";

export const stats = query({
  args: {},
  returns: v.object({
    chats: v.number(),
    messages: v.number(),
    apiKeys: v.number(),
    usageLogs: v.number(),
    accountAge: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const [chats, apiKeys, usageLogs] = await Promise.all([
      ctx.db
        .query("chats")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .take(1000),
      ctx.db
        .query("apiKeys")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .take(1000),
      ctx.db
        .query("usageLogs")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .take(1000),
    ]);

    const nodeGroups = await Promise.all(
      chats.map((chat) =>
        ctx.db
          .query("zermindNodes")
          .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
          .take(1000),
      ),
    );
    const messages = nodeGroups.flat();

    const oldestChat = chats.reduce<number | null>((oldest, chat) => {
      return oldest === null || chat.createdAt < oldest ? chat.createdAt : oldest;
    }, null);

    const accountAge = oldestChat
      ? Math.floor((Date.now() - oldestChat) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      chats: chats.length,
      messages: messages.length,
      apiKeys: apiKeys.length,
      usageLogs: usageLogs.length,
      accountAge,
    };
  },
});

function extractExportAttachments(message?: { content?: unknown }) {
  if (!message || !Array.isArray(message.content)) return [];

  return message.content.flatMap((part, index) => {
    if (typeof part !== "object" || part === null || !("type" in part)) return [];

    const typedPart = part as {
      type: string;
      image?: string;
      data?: string;
      mediaType?: string;
      mimeType?: string;
      filename?: string;
    };

    if (typedPart.type !== "image" && typedPart.type !== "file") return [];

    const url = typedPart.type === "image" ? typedPart.image : typedPart.data;
    if (!url) return [];

    return [
      {
        id: `${typedPart.type}-${index}`,
        name: typedPart.filename ?? (typedPart.type === "image" ? "Image" : "File"),
        mimeType: typedPart.mediaType ?? typedPart.mimeType ?? "application/octet-stream",
        url,
        type: typedPart.type === "image" ? "image" : "document",
      },
    ];
  });
}

export const exportMine = mutation({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    await rateLimiter.limit(ctx, "accountExport", { key: userId, throws: true });

    const [chats, apiKeys, usageLogs] = await Promise.all([
      ctx.db
        .query("chats")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .order("desc")
        .take(1000),
      ctx.db
        .query("apiKeys")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .take(1000),
      ctx.db
        .query("usageLogs")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .order("desc")
        .take(1000),
    ]);

    const chatsWithMessages = await Promise.all(
      chats.map(async (chat) => {
        const [paginated, nodes, files] = await Promise.all([
          listMessages(ctx, components.agent, {
            threadId: chat.agentThreadId,
            paginationOpts: { numItems: 1000, cursor: null },
            excludeToolMessages: true,
          }),
          ctx.db
            .query("zermindNodes")
            .withIndex("by_chatId_and_createdAt", (q) => q.eq("chatId", chat._id))
            .order("asc")
            .take(1000),
          ctx.db
            .query("fileAttachments")
            .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
            .take(1000),
        ]);

        const nodesByMessageId = new Map(nodes.map((node) => [node.agentMessageId, node]));
        const messages = paginated.page
          .filter(
            (message) => message.message?.role === "user" || message.message?.role === "assistant",
          )
          .sort((a, b) => a._creationTime - b._creationTime)
          .map((message) => {
            const node = nodesByMessageId.get(message._id);
            const role = message.message?.role === "user" ? "user" : "assistant";
            return {
              id: message._id,
              role,
              content: message.text ?? message.error ?? "",
              status: message.status,
              model: role === "assistant" ? message.model : null,
              error: message.error ?? null,
              createdAt: new Date(node?.createdAt ?? message._creationTime).toISOString(),
              parentId: node?.parentAgentMessageId ?? null,
              branchName: node?.branchName ?? null,
              mindMap: {
                xPosition: node?.xPosition ?? 0,
                yPosition: node?.yPosition ?? 0,
                nodeType: node?.nodeType ?? "conversation",
                isCollapsed: node?.isCollapsed ?? false,
                isLocked: node?.isLocked ?? false,
                lastEditedBy: node?.lastEditedBy ?? null,
                editedAt: node?.editedAt ? new Date(node.editedAt).toISOString() : null,
              },
              attachments: extractExportAttachments(message.message),
            };
          });

        return {
          id: chat._id,
          agentThreadId: chat.agentThreadId,
          title: chat.title ?? null,
          mode: chat.mode,
          isCollaborative: chat.isCollaborative,
          shareId: chat.shareId ?? null,
          createdAt: new Date(chat.createdAt).toISOString(),
          updatedAt: new Date(chat.updatedAt).toISOString(),
          messages,
          files: await Promise.all(
            files.map(async (file) => ({
              id: file._id,
              storageId: file.storageId,
              name: file.name,
              mimeType: file.mimeType,
              size: file.size,
              type: file.type,
              url: await ctx.storage.getUrl(file.storageId),
              createdAt: new Date(file.createdAt).toISOString(),
            })),
          ),
        };
      }),
    );

    return {
      exportDate: new Date().toISOString(),
      userId,
      summary: {
        totalChats: chatsWithMessages.length,
        totalMessages: chatsWithMessages.reduce((sum, chat) => sum + chat.messages.length, 0),
        totalApiKeys: apiKeys.length,
        totalUsageLogs: usageLogs.length,
      },
      chats: chatsWithMessages,
      apiKeys: apiKeys.map((key) => ({
        id: key._id,
        provider: key.provider,
        keyName: key.keyName,
        isActive: key.isActive,
        createdAt: new Date(key.createdAt).toISOString(),
        lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt).toISOString() : null,
      })),
      usageLogs: usageLogs.map((log) => ({
        id: log._id,
        model: log.model,
        chatId: log.chatId ?? null,
        createdAt: new Date(log.createdAt).toISOString(),
      })),
    };
  },
});

export const deleteMyData = mutation({
  args: {
    confirmation: v.literal("DELETE MY ACCOUNT"),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const [chats, apiKeys, usageLogs, feedback, userParticipations, sentInvitations, userFiles] =
      await Promise.all([
        ctx.db
          .query("chats")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .take(1000),
        ctx.db
          .query("apiKeys")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .take(1000),
        ctx.db
          .query("usageLogs")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .take(1000),
        ctx.db
          .query("feedback")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .take(1000),
        ctx.db
          .query("sessionParticipants")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .take(1000),
        ctx.db
          .query("collaborationInvitations")
          .withIndex("by_inviterId", (q) => q.eq("inviterId", userId))
          .take(1000),
        ctx.db
          .query("fileAttachments")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .take(1000),
      ]);

    const [nodeGroups, fileGroups, sessionGroups, participantGroups, invitationGroups] =
      await Promise.all([
        Promise.all(
          chats.map((chat) =>
            ctx.db
              .query("zermindNodes")
              .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
              .take(1000),
          ),
        ),
        Promise.all(
          chats.map((chat) =>
            ctx.db
              .query("fileAttachments")
              .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
              .take(1000),
          ),
        ),
        Promise.all(
          chats.map((chat) =>
            ctx.db
              .query("collaborationSessions")
              .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
              .take(1000),
          ),
        ),
        Promise.all(
          chats.map((chat) =>
            ctx.db
              .query("sessionParticipants")
              .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
              .take(1000),
          ),
        ),
        Promise.all(
          chats.map((chat) =>
            ctx.db
              .query("collaborationInvitations")
              .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
              .take(1000),
          ),
        ),
      ]);
    const messages = nodeGroups.flat();
    const files = fileGroups.flat();
    const sessions = sessionGroups.flat();
    const participants = participantGroups.flat();
    const invitations = invitationGroups.flat();

    const participantIds = new Set(
      [...participants, ...userParticipations].map((item) => item._id),
    );
    const invitationIds = new Set([...invitations, ...sentInvitations].map((item) => item._id));
    const fileIds = new Set([...files, ...userFiles].map((item) => item._id));
    const storageIds = new Set([...files, ...userFiles].map((item) => item.storageId));

    await Promise.all([
      ...messages.map((message) => ctx.db.delete(message._id)),
      ...Array.from(storageIds).map((storageId) => ctx.storage.delete(storageId)),
      ...Array.from(fileIds).map((fileId) => ctx.db.delete(fileId)),
      ...Array.from(participantIds).map((participantId) => ctx.db.delete(participantId)),
      ...sessions.map((session) => ctx.db.delete(session._id)),
      ...Array.from(invitationIds).map((invitationId) => ctx.db.delete(invitationId)),
      ...chats.map((chat) => ctx.db.delete(chat._id)),
      ...apiKeys.map((key) => ctx.db.delete(key._id)),
      ...usageLogs.map((log) => ctx.db.delete(log._id)),
      ...feedback.map((item) => ctx.db.delete(item._id)),
    ]);

    for (const chat of chats) {
      await zermindAgent.deleteThreadAsync(ctx, { threadId: chat.agentThreadId });
    }

    return {
      success: true,
      message: `Deleted ${chats.length} chats, ${messages.length} messages, ${apiKeys.length} API keys, and ${usageLogs.length} usage logs.`,
    };
  },
});
