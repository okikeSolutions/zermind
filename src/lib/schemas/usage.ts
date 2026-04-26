import { z } from "zod";

export const UsageStatsSchema = z.object({
  totalRequests: z.number(),
  modelUsage: z.record(z.string(), z.number()),
  dailyUsage: z.record(z.string(), z.number()),
  userCount: z.number(),
});

export type UsageStats = z.infer<typeof UsageStatsSchema>;
