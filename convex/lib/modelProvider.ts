"use node";

import crypto from "crypto";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { internal } from "../_generated/api";
import type { ActionCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const AAD = Buffer.from("zermind-api-key");

export type Provider = "openrouter" | "openai" | "anthropic" | "meta" | "google";

export function getProviderFromModel(model: string): Provider {
  if (model.startsWith("openai/") || model.startsWith("gpt-")) return "openai";
  if (model.startsWith("anthropic/") || model.startsWith("claude-")) return "anthropic";
  if (model.startsWith("google/") || model.startsWith("gemini-")) return "google";
  if (model.startsWith("meta/") || model.startsWith("llama-")) return "meta";
  return "openrouter";
}

function getEncryptionKey(): Buffer {
  const key = process.env.API_KEY_ENCRYPTION_SECRET;
  if (!key) throw new Error("API_KEY_ENCRYPTION_SECRET environment variable is required");
  if (key.length < KEY_LENGTH) {
    return crypto.pbkdf2Sync(key, "zermind-salt", 100000, KEY_LENGTH, "sha256");
  }
  return Buffer.from(key.slice(0, KEY_LENGTH));
}

function decryptApiKey(encryptedData: string): string {
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedData, "base64");
  const iv = combined.subarray(0, 16);
  const authTag = combined.subarray(16, 32);
  const encrypted = combined.subarray(32);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAAD(AAD);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, undefined, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

async function getUserApiKey(ctx: ActionCtx, userId: string, provider: Provider) {
  const key: { _id: Id<"apiKeys">; encryptedKey: string } | null = await ctx.runQuery(
    internal.apiKeys.getActiveEncrypted,
    { userId, provider },
  );
  if (!key) return null;
  await ctx.runMutation(internal.apiKeys.markUsed, { keyId: key._id });
  return decryptApiKey(key.encryptedKey);
}

function normalizeModelForDirectProvider(model: string, provider: Provider) {
  switch (provider) {
    case "openai":
      return model.replace(/^openai\//, "");
    case "anthropic":
      return model.replace(/^anthropic\//, "");
    case "google":
      return model.replace(/^google\//, "");
    default:
      return model;
  }
}

function normalizeOpenRouterModel(model: string, provider: Provider) {
  if (model.includes("/")) return model;
  switch (provider) {
    case "openai":
      return `openai/${model}`;
    case "anthropic":
      return `anthropic/${model}`;
    case "google":
      return `google/${model}`;
    case "meta":
      return `meta-llama/${model}`;
    default:
      return model;
  }
}

export async function resolveLanguageModel(ctx: ActionCtx, userId: string, model: string) {
  const provider = getProviderFromModel(model);
  const userApiKey = await getUserApiKey(ctx, userId, provider);

  if (userApiKey) {
    switch (provider) {
      case "openai":
        return createOpenAI({ apiKey: userApiKey }).chat(
          normalizeModelForDirectProvider(model, provider),
        );
      case "anthropic":
        return createAnthropic({ apiKey: userApiKey }).chat(
          normalizeModelForDirectProvider(model, provider),
        );
      case "google":
        return createGoogleGenerativeAI({ apiKey: userApiKey }).chat(
          normalizeModelForDirectProvider(model, provider),
        );
      case "openrouter":
      case "meta":
      default:
        return createOpenRouter({ apiKey: userApiKey }).chat(model);
    }
  }

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterKey) {
    throw new Error(
      "OpenRouter API key not configured. Add your own API key in settings or configure OPENROUTER_API_KEY.",
    );
  }

  return createOpenRouter({ apiKey: openrouterKey }).chat(
    normalizeOpenRouterModel(model, provider),
  );
}
