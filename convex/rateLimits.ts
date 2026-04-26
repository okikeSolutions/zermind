import { DAY, HOUR, MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  aiSendBurst: { kind: "token bucket", rate: 6, period: MINUTE, capacity: 6 },
  aiSendHourly: { kind: "fixed window", rate: 100, period: HOUR },

  fileUploadUrlBurst: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 10 },
  fileUploadUrlHourly: { kind: "fixed window", rate: 30, period: HOUR },
  fileSaveHourly: { kind: "fixed window", rate: 60, period: HOUR },

  feedbackCreate: { kind: "fixed window", rate: 5, period: HOUR },

  collaborationStart: { kind: "fixed window", rate: 10, period: HOUR },
  collaborationInvite: { kind: "fixed window", rate: 20, period: HOUR },
  collaborationJoin: { kind: "fixed window", rate: 30, period: HOUR },

  chatCreate: { kind: "fixed window", rate: 30, period: HOUR },
  shareLinkGenerate: { kind: "fixed window", rate: 20, period: HOUR },

  apiKeyCreate: { kind: "fixed window", rate: 10, period: HOUR },
  accountExport: { kind: "fixed window", rate: 5, period: DAY },
});

export const limitAiSend = internalMutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await rateLimiter.limit(ctx, "aiSendBurst", { key: args.userId, throws: true });
    await rateLimiter.limit(ctx, "aiSendHourly", { key: args.userId, throws: true });
    return null;
  },
});

export const limitApiKeyCreate = internalMutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await rateLimiter.limit(ctx, "apiKeyCreate", { key: args.userId, throws: true });
    return null;
  },
});
