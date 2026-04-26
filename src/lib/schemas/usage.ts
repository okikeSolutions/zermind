import { z } from "zod";

// Base usage log schema
export const UsageLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  model: z.string(),
  chatId: z.string().nullable(),
  createdAt: z.coerce.date(),
});

// Usage log creation schema (for API requests)
export const CreateUsageLogSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  model: z.string().min(1, "Model is required"),
  chatId: z.string().nullable().optional(),
});

// Usage statistics schema
export const UsageStatsSchema = z.object({
  totalRequests: z.number(),
  modelUsage: z.record(z.string(), z.number()),
  dailyUsage: z.record(z.string(), z.number()),
  userCount: z.number(),
});

// Model usage entry schema (for the usage breakdown)
export const ModelUsageEntrySchema = z.object({
  model: z.string(),
  count: z.number(),
  percentage: z.number(),
});

// Daily usage entry schema
export const DailyUsageEntrySchema = z.object({
  date: z.string(),
  count: z.number(),
});

// API response schemas
export const GetUsageStatsResponseSchema = UsageStatsSchema;

export const CreateUsageLogResponseSchema = UsageLogSchema;

// Error response schema (reuse from chat if needed)
export const UsageErrorResponseSchema = z.object({
  error: z.string(),
});

// Type exports (inferred from schemas)
export type UsageLog = z.infer<typeof UsageLogSchema>;
export type CreateUsageLog = z.infer<typeof CreateUsageLogSchema>;
export type UsageStats = z.infer<typeof UsageStatsSchema>;
export type ModelUsageEntry = z.infer<typeof ModelUsageEntrySchema>;
export type DailyUsageEntry = z.infer<typeof DailyUsageEntrySchema>;
export type GetUsageStatsResponse = z.infer<typeof GetUsageStatsResponseSchema>;
export type CreateUsageLogResponse = z.infer<typeof CreateUsageLogResponseSchema>;
export type UsageErrorResponse = z.infer<typeof UsageErrorResponseSchema>;
