import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const chatMode = v.union(v.literal("chat"), v.literal("mind"));

export const nodeType = v.union(
  v.literal("conversation"),
  v.literal("branching_point"),
  v.literal("insight"),
);

export const messageRole = v.union(v.literal("user"), v.literal("assistant"));

export const collaborationRole = v.union(
  v.literal("owner"),
  v.literal("collaborator"),
  v.literal("viewer"),
);

export const attachment = v.object({
  id: v.string(),
  name: v.string(),
  mimeType: v.string(),
  size: v.number(),
  url: v.string(),
  type: v.union(v.literal("image"), v.literal("document")),
});

export default defineSchema({
  chats: defineTable({
    userId: v.string(),
    agentThreadId: v.string(),
    title: v.optional(v.string()),
    shareId: v.optional(v.string()),
    mode: chatMode,
    isCollaborative: v.boolean(),
    templateId: v.optional(v.id("conversationTemplates")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_updatedAt", ["userId", "updatedAt"])
    .index("by_agentThreadId", ["agentThreadId"])
    .index("by_shareId", ["shareId"])
    .index("by_mode", ["mode"])
    .index("by_templateId", ["templateId"]),

  zermindNodes: defineTable({
    chatId: v.id("chats"),
    agentThreadId: v.string(),
    agentMessageId: v.string(),
    parentAgentMessageId: v.optional(v.string()),
    branchName: v.optional(v.string()),
    xPosition: v.number(),
    yPosition: v.number(),
    nodeType,
    isCollapsed: v.boolean(),
    isLocked: v.boolean(),
    lastEditedBy: v.optional(v.string()),
    editedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_chatId", ["chatId"])
    .index("by_chatId_and_createdAt", ["chatId", "createdAt"])
    .index("by_agentMessageId", ["agentMessageId"])
    .index("by_parentAgentMessageId", ["parentAgentMessageId"]),

  apiKeys: defineTable({
    userId: v.string(),
    provider: v.union(
      v.literal("openrouter"),
      v.literal("openai"),
      v.literal("anthropic"),
      v.literal("meta"),
      v.literal("google"),
    ),
    encryptedKey: v.string(),
    keyPreview: v.string(),
    keyName: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastUsedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_provider", ["userId", "provider"])
    .index("by_userId_and_isActive", ["userId", "isActive"])
    .index("by_userId_and_provider_and_keyName", ["userId", "provider", "keyName"]),

  usageLogs: defineTable({
    userId: v.string(),
    model: v.string(),
    chatId: v.optional(v.id("chats")),
    agentThreadId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_model", ["model"])
    .index("by_createdAt", ["createdAt"])
    .index("by_userId_and_createdAt", ["userId", "createdAt"])
    .index("by_userId_and_model", ["userId", "model"])
    .index("by_chatId", ["chatId"]),

  feedback: defineTable({
    userId: v.string(),
    message: v.string(),
    type: v.string(),
    status: v.string(),
    priority: v.string(),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_priority", ["priority"])
    .index("by_createdAt", ["createdAt"]),

  conversationTemplates: defineTable({
    name: v.string(),
    description: v.string(),
    creatorId: v.string(),
    structure: v.any(),
    isPublic: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_creatorId", ["creatorId"])
    .index("by_isPublic", ["isPublic"])
    .index("by_createdAt", ["createdAt"]),

  collaborationSessions: defineTable({
    chatId: v.id("chats"),
    activeSince: v.number(),
    lastActivity: v.number(),
  })
    .index("by_chatId", ["chatId"])
    .index("by_chatId_and_lastActivity", ["chatId", "lastActivity"])
    .index("by_lastActivity", ["lastActivity"]),

  sessionParticipants: defineTable({
    sessionId: v.id("collaborationSessions"),
    chatId: v.id("chats"),
    userId: v.string(),
    role: collaborationRole,
    joinedAt: v.number(),
    lastActivity: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_sessionId_and_userId", ["sessionId", "userId"])
    .index("by_chatId", ["chatId"])
    .index("by_userId", ["userId"]),

  collaborationInvitations: defineTable({
    chatId: v.id("chats"),
    inviterId: v.string(),
    inviteeEmail: v.string(),
    role: collaborationRole,
    chatTitle: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("revoked")),
  })
    .index("by_chatId", ["chatId"])
    .index("by_inviterId", ["inviterId"])
    .index("by_inviteeEmail", ["inviteeEmail"]),
});
