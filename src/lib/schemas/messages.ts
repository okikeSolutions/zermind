import { z } from "zod";
import { AttachmentSchema } from "./chat";

// Node type enum for mind map
export const nodeTypeSchema = z.enum(["conversation", "branching_point", "insight"]);

// Message position schema
export const messagePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Create message with mind map positioning
export const createMessageWithPositionSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  parentId: z.string().optional(),
  branchName: z.string().max(100).optional(),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Content is required"),
  model: z.string().optional(),
  xPosition: z.number().default(0),
  yPosition: z.number().default(0),
  nodeType: nodeTypeSchema.default("conversation"),
});

// Update message position schema
export const updateMessagePositionSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
  xPosition: z.number(),
  yPosition: z.number(),
});

// Batch update positions schema
export const batchUpdatePositionsSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        xPosition: z.number(),
        yPosition: z.number(),
      }),
    )
    .min(1, "At least one update is required"),
});

// Create branching point schema
export const createBranchingPointSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  parentId: z.string().min(1, "Parent ID is required"),
  branchName: z.string().min(1, "Branch name is required").max(100),
  xPosition: z.number(),
  yPosition: z.number(),
  models: z.array(z.string()).optional(), // For multi-model branching
});

// Toggle message collapse schema
export const toggleMessageCollapseSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
  isCollapsed: z.boolean(),
});

// Message filter schema
export const messageFilterSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  nodeType: nodeTypeSchema.optional(),
  model: z.string().optional(),
  parentId: z.string().optional(),
  isCollapsed: z.boolean().optional(),
});

// Conversation path schema
export const conversationPathSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
});

// Delete message tree schema
export const deleteMessageTreeSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
  confirmDelete: z.boolean().refine((val) => val === true, "Confirmation required"),
});

// Mind map message schema (full message with metadata)
export const mindMapMessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  parentId: z.string().nullable(),
  branchName: z.string().nullable(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  model: z.string().nullable(),
  attachments: z.array(AttachmentSchema).default([]),
  xPosition: z.number(),
  yPosition: z.number(),
  nodeType: nodeTypeSchema,
  isCollapsed: z.boolean(),
  isLocked: z.boolean(),
  lastEditedBy: z.string().nullable(),
  editedAt: z.date().nullable(),
  createdAt: z.date(),
  children: z.array(z.string()).optional(), // Child message IDs
});

// Conversation tree structure schema
export const conversationTreeSchema = z.object({
  nodes: z.array(mindMapMessageSchema),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      type: z.string().optional(),
    }),
  ),
  rootNodeId: z.string().optional(),
});

// Message locking schema (for collaborative editing)
export const messageLockSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
  isLocked: z.boolean(),
  lockedBy: z.string().optional(),
});

// Multi-model branching schema
export const multiModelBranchingSchema = z.object({
  parentId: z.string().min(1, "Parent message ID is required"),
  prompt: z.string().min(1, "Prompt is required"),
  models: z.array(z.string()).min(2, "At least 2 models required for comparison"),
  branchName: z.string().max(100).optional(),
  layout: z.enum(["horizontal", "vertical", "radial"]).default("horizontal"),
});

// Message search schema
export const messageSearchSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  query: z.string().min(1, "Search query is required"),
  nodeTypes: z.array(nodeTypeSchema).optional(),
  models: z.array(z.string()).optional(),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
});

// Message export schema
export const messageExportSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  format: z.enum(["json", "markdown", "pdf", "html"]),
  includeMetadata: z.boolean().default(true),
  includePositions: z.boolean().default(true),
  nodeIds: z.array(z.string()).optional(), // Export specific nodes only
});

// Auto-layout schema
export const autoLayoutSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  algorithm: z.enum(["hierarchical", "force-directed", "radial", "tree"]).default("hierarchical"),
  spacing: z.object({
    x: z.number().min(50).default(300),
    y: z.number().min(50).default(150),
  }),
  animate: z.boolean().default(true),
});

// Export types
export type NodeType = z.infer<typeof nodeTypeSchema>;
export type MessagePosition = z.infer<typeof messagePositionSchema>;
export type CreateMessageWithPosition = z.infer<typeof createMessageWithPositionSchema>;
export type UpdateMessagePosition = z.infer<typeof updateMessagePositionSchema>;
export type BatchUpdatePositions = z.infer<typeof batchUpdatePositionsSchema>;
export type CreateBranchingPoint = z.infer<typeof createBranchingPointSchema>;
export type ToggleMessageCollapse = z.infer<typeof toggleMessageCollapseSchema>;
export type MessageFilter = z.infer<typeof messageFilterSchema>;
export type ConversationPath = z.infer<typeof conversationPathSchema>;
export type DeleteMessageTree = z.infer<typeof deleteMessageTreeSchema>;
export type MindMapMessage = z.infer<typeof mindMapMessageSchema>;
export type ConversationTree = z.infer<typeof conversationTreeSchema>;
export type MessageLock = z.infer<typeof messageLockSchema>;
export type MultiModelBranching = z.infer<typeof multiModelBranchingSchema>;
export type MessageSearch = z.infer<typeof messageSearchSchema>;
export type MessageExport = z.infer<typeof messageExportSchema>;
export type AutoLayout = z.infer<typeof autoLayoutSchema>;
