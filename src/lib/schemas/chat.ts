import { z } from "zod";

export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  storageId: z.string().optional(),
  type: z.enum(["image", "document"]),
});

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.coerce.date(),
  model: z.string().nullish(),
  attachments: z.array(AttachmentSchema).default([]),
  parentId: z.string().nullish(),
  branchName: z.string().nullish(),
  xPosition: z.number().default(0),
  yPosition: z.number().default(0),
  nodeType: z.enum(["conversation", "branching_point", "insight"]).default("conversation"),
  isCollapsed: z.boolean().default(false),
  isLocked: z.boolean().default(false),
  lastEditedBy: z.string().nullish(),
  editedAt: z.coerce.date().nullish(),
});

export const ChatSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  userId: z.string(),
  mode: z.enum(["chat", "mind"]).default("chat"),
  isCollaborative: z.boolean().default(false),
  templateId: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  shareId: z.string().nullable().optional(),
});

export const ChatWithMessagesSchema = ChatSchema.extend({
  messages: z.array(MessageSchema),
});

export const ChatListItemSchema = ChatSchema.extend({
  _count: z.object({
    messages: z.number(),
  }),
  messages: z.array(
    z.object({
      content: z.string(),
      createdAt: z.coerce.date(),
      attachments: z.array(AttachmentSchema).default([]),
    }),
  ),
});

export const CreateChatSchema = z.object({
  title: z.string().optional(),
});

export const UpdateChatSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type Attachment = z.infer<typeof AttachmentSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type ChatWithMessages = z.infer<typeof ChatWithMessagesSchema>;
export type ChatListItem = z.infer<typeof ChatListItemSchema>;
export type CreateChat = z.infer<typeof CreateChatSchema>;
export type UpdateChat = z.infer<typeof UpdateChatSchema>;
