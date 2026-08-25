import { z } from "zod";

import * as m from "@/paraglide/messages.js";
export const ProviderEnum = z.enum(["openrouter", "openai", "anthropic", "meta", "google"]);

export const CreateApiKeySchema = z.object({
  provider: ProviderEnum,
  apiKey: z.string().min(1, m.copy_api_key_is_required()),
  keyName: z.string().min(1, m.copy_key_name_is_required()).max(50, m.copy_key_name_is_too_long()),
});

export const UpdateApiKeySchema = z.object({
  keyName: z
    .string()
    .min(1, m.copy_key_name_is_required())
    .max(50, m.copy_key_name_is_too_long())
    .optional(),
  isActive: z.boolean().optional(),
});

export const PublicApiKeySchema = z.object({
  id: z.string(),
  provider: ProviderEnum,
  keyName: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastUsedAt: z.coerce.date().nullable(),
  keyPreview: z.string(),
});

export type Provider = z.infer<typeof ProviderEnum>;
export type CreateApiKey = z.infer<typeof CreateApiKeySchema>;
export type UpdateApiKey = z.infer<typeof UpdateApiKeySchema>;
export type PublicApiKey = z.infer<typeof PublicApiKeySchema>;
