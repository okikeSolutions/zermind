import { z } from "zod";

// Feedback type enum
export const FeedbackTypeSchema = z.enum([
  "bug",
  "feature",
  "general",
  "improvement",
  "complaint",
  "compliment",
]);

// Feedback status enum
export const FeedbackStatusSchema = z.enum(["open", "in_progress", "resolved", "closed"]);

// Feedback priority enum
export const FeedbackPrioritySchema = z.enum(["low", "medium", "high", "critical"]);

// Base feedback schema
export const FeedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  message: z.string(),
  type: FeedbackTypeSchema.default("general"),
  status: FeedbackStatusSchema.default("open"),
  priority: FeedbackPrioritySchema.default("medium"),
  userAgent: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Feedback creation schema (for API requests)
export const CreateFeedbackSchema = z.object({
  message: z
    .string()
    .min(1, "Feedback message is required")
    .max(2000, "Feedback message is too long"),
  type: FeedbackTypeSchema.optional().default("general"),
});

// Feedback update schema (for admin use)
export const UpdateFeedbackSchema = z.object({
  status: FeedbackStatusSchema.optional(),
  priority: FeedbackPrioritySchema.optional(),
});

// API response schemas
export const CreateFeedbackResponseSchema = FeedbackSchema;

export const GetFeedbackResponseSchema = z.object({
  feedback: z.array(FeedbackSchema),
});

// Error response schema
export const FeedbackErrorResponseSchema = z.object({
  error: z.string(),
});

// Type exports (inferred from schemas)
export type FeedbackType = z.infer<typeof FeedbackTypeSchema>;
export type FeedbackStatus = z.infer<typeof FeedbackStatusSchema>;
export type FeedbackPriority = z.infer<typeof FeedbackPrioritySchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;
export type UpdateFeedback = z.infer<typeof UpdateFeedbackSchema>;
export type CreateFeedbackResponse = z.infer<typeof CreateFeedbackResponseSchema>;
export type GetFeedbackResponse = z.infer<typeof GetFeedbackResponseSchema>;
export type FeedbackErrorResponse = z.infer<typeof FeedbackErrorResponseSchema>;
