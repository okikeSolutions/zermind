import { z } from "zod";

// Attachment schema
export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string().refine((url) => url.startsWith("data:"), {
    message: "URL must be a data URL starting with 'data:'",
  }), // Data URL for direct processing (no server storage)
  type: z.enum(["image", "document"]),
});

// Base message schema
export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.coerce.date(),
  model: z.string().nullish(), // Handles both null and undefined
  attachments: z.array(AttachmentSchema).default([]),
  parentId: z.string().nullish(), // For conversation branching
  branchName: z.string().nullish(), // User-defined branch labels
  xPosition: z.number().default(0), // Mind map coordinates
  yPosition: z.number().default(0), // Mind map coordinates
  nodeType: z.enum(["conversation", "branching_point", "insight"]).default("conversation"),
  isCollapsed: z.boolean().default(false), // For mind map UI state
  isLocked: z.boolean().default(false), // For preventing concurrent edits
  lastEditedBy: z.string().nullish(), // User ID who last edited
  editedAt: z.coerce.date().nullish(), // When last edited
});

// Message creation schema (for API requests)
export const CreateMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Message content is required"),
  model: z.string().nullish(), // Handles both null and undefined
  attachments: z.array(AttachmentSchema).optional().default([]),
  parentId: z.string().optional(), // For conversation branching
  branchName: z.string().optional(), // User-defined branch labels
  xPosition: z.number().optional().default(0), // Mind map coordinates
  yPosition: z.number().optional().default(0), // Mind map coordinates
  nodeType: z
    .enum(["conversation", "branching_point", "insight"])
    .optional()
    .default("conversation"),
});

// Chat schema
export const ChatSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  userId: z.string(),
  mode: z.enum(["chat", "mind"]).default("chat"), // Track interaction mode
  isCollaborative: z.boolean().default(false), // For real-time collaboration
  templateId: z.string().nullish(), // Reference to conversation templates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  shareId: z.string().nullable().optional(),
});

// Chat with messages schema
export const ChatWithMessagesSchema = ChatSchema.extend({
  messages: z.array(MessageSchema),
});

// Chat list item schema (for sidebar)
export const ChatListItemSchema = ChatSchema.extend({
  _count: z.object({
    messages: z.number(),
  }),
  messages: z
    .array(
      z.object({
        content: z.string(),
        createdAt: z.coerce.date(),
        attachments: z.array(AttachmentSchema).optional().default([]),
      }),
    )
    .max(1)
    .optional()
    .default([]), // Only latest message for preview
});

// Chat creation schema (for API requests)
export const CreateChatSchema = z.object({
  title: z.string().optional(),
});

// Chat update schema
export const UpdateChatSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

// API response schemas
export const GetUserChatsResponseSchema = z.object({
  chats: z.array(ChatListItemSchema),
});

export const CreateChatResponseSchema = ChatSchema;

export const GetChatResponseSchema = ChatWithMessagesSchema;

export const DeleteChatResponseSchema = z.object({
  success: z.boolean(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
});

// Type exports (inferred from schemas)
export type Attachment = z.infer<typeof AttachmentSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type CreateMessage = z.infer<typeof CreateMessageSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type ChatWithMessages = z.infer<typeof ChatWithMessagesSchema>;
export type ChatListItem = z.infer<typeof ChatListItemSchema>;
export type CreateChat = z.infer<typeof CreateChatSchema>;
export type UpdateChat = z.infer<typeof UpdateChatSchema>;
export type GetUserChatsResponse = z.infer<typeof GetUserChatsResponseSchema>;
export type CreateChatResponse = z.infer<typeof CreateChatResponseSchema>;
export type GetChatResponse = z.infer<typeof GetChatResponseSchema>;
export type DeleteChatResponse = z.infer<typeof DeleteChatResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
