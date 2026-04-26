"use node";

import crypto from "crypto";
import { ConvexError, v } from "convex/values";
import { action, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const AAD = Buffer.from("zermind-api-key");

type Provider = "openrouter" | "openai" | "anthropic" | "meta" | "google";

type PublicApiKey = {
  _id: Id<"apiKeys">;
  _creationTime: number;
  provider: Provider;
  keyName: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  lastUsedAt?: number;
  keyPreview: string;
};

const provider = v.union(
  v.literal("openrouter"),
  v.literal("openai"),
  v.literal("anthropic"),
  v.literal("meta"),
  v.literal("google"),
);

function getEncryptionKey(): Buffer {
  const key = process.env.API_KEY_ENCRYPTION_SECRET;

  if (!key) {
    throw new Error("API_KEY_ENCRYPTION_SECRET environment variable is required");
  }

  if (key.length < KEY_LENGTH) {
    return crypto.pbkdf2Sync(key, "zermind-salt", 100000, KEY_LENGTH, "sha256");
  }

  return Buffer.from(key.slice(0, KEY_LENGTH));
}

function encryptApiKey(apiKey: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(AAD);

  let encrypted = cipher.update(apiKey, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, "base64")]);
  return combined.toString("base64");
}

function createApiKeyPreview(apiKey: string): string {
  if (apiKey.length <= 8) return "****";
  const start = apiKey.slice(0, 4);
  const end = apiKey.slice(-4);
  const middle = "*".repeat(Math.min(apiKey.length - 8, 20));
  return `${start}${middle}${end}`;
}

function validateApiKeyFormat(apiKey: string, selectedProvider: string): boolean {
  const cleanKey = apiKey.trim();

  switch (selectedProvider) {
    case "openrouter":
      return cleanKey.startsWith("sk-or-") && cleanKey.length >= 40;
    case "openai":
      return cleanKey.startsWith("sk-") && cleanKey.length >= 40;
    case "anthropic":
      return cleanKey.startsWith("sk-ant-") && cleanKey.length >= 40;
    default:
      return cleanKey.length >= 20 && /^[A-Za-z0-9_-]+$/.test(cleanKey);
  }
}

async function getOptionalUserId(ctx: ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.tokenIdentifier ?? null;
}

async function requireUserId(ctx: ActionCtx) {
  const userId = await getOptionalUserId(ctx);
  if (!userId) {
    throw new ConvexError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return userId;
}

export const create = action({
  args: {
    provider,
    apiKey: v.string(),
    keyName: v.string(),
  },
  returns: v.object({
    _id: v.id("apiKeys"),
    _creationTime: v.number(),
    provider,
    keyName: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastUsedAt: v.optional(v.number()),
    keyPreview: v.string(),
  }),
  handler: async (ctx, args): Promise<PublicApiKey> => {
    const userId = await requireUserId(ctx);
    await ctx.runMutation(internal.rateLimits.limitApiKeyCreate, { userId });

    const apiKey = args.apiKey.trim();

    if (!validateApiKeyFormat(apiKey, args.provider)) {
      throw new ConvexError({
        code: "INVALID_API_KEY_FORMAT",
        message: "Invalid API key format for the selected provider",
      });
    }

    const created: PublicApiKey = await ctx.runMutation(internal.apiKeys.createEncrypted, {
      userId,
      provider: args.provider,
      encryptedKey: encryptApiKey(apiKey),
      keyPreview: createApiKeyPreview(apiKey),
      keyName: args.keyName,
    });
    return created;
  },
});
