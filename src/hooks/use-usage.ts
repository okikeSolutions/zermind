"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { type UsageStats } from "@/lib/schemas/usage";

export function useUsageStats() {
  const stats = useQuery(api.usage.myStats, {});

  return {
    data: (stats ?? {
      totalRequests: 0,
      modelUsage: {},
      dailyUsage: {},
      userCount: 0,
    }) satisfies UsageStats,
    isLoading: stats === undefined,
    error: null as Error | null,
  };
}
