import { z } from "zod";

// Supported AI providers enum
export const ProviderEnum = z.enum(["openrouter", "openai", "anthropic", "meta", "google"]);

// Base API key schema (for database operations)
export const ApiKeySchema = z.object({
  id: z.string(),
  userId: z.string(),
  provider: ProviderEnum,
  encryptedKey: z.string(),
  keyName: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastUsedAt: z.coerce.date().nullable(),
});

// API key creation schema (for frontend forms)
export const CreateApiKeySchema = z.object({
  provider: ProviderEnum,
  apiKey: z
    .string()
    .min(1, "API key is required")
    .regex(/^[A-Za-z0-9_-]+$/, "API key contains invalid characters")
    .max(500, "API key is too long"),
  keyName: z
    .string()
    .min(1, "Key name is required")
    .max(50, "Key name is too long")
    .regex(/^[A-Za-z0-9\s_-]+$/, "Key name contains invalid characters"),
});

// API key update schema
export const UpdateApiKeySchema = z.object({
  keyName: z
    .string()
    .min(1, "Key name is required")
    .max(50, "Key name is too long")
    .regex(/^[A-Za-z0-9\s_-]+$/, "Key name contains invalid characters")
    .optional(),
  isActive: z.boolean().optional(),
});

// API key validation schema (for testing keys)
export const ValidateApiKeySchema = z.object({
  provider: ProviderEnum,
  apiKey: z.string().min(1, "API key is required"),
});

// Public API key schema (excludes sensitive data)
export const PublicApiKeySchema = z.object({
  id: z.string(),
  provider: ProviderEnum,
  keyName: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastUsedAt: z.coerce.date().nullable(),
  keyPreview: z.string(), // Shows only first 4 and last 4 characters
});

// API response schemas
export const GetUserApiKeysResponseSchema = z.object({
  apiKeys: z.array(PublicApiKeySchema),
});

export const CreateApiKeyResponseSchema = PublicApiKeySchema;

export const UpdateApiKeyResponseSchema = PublicApiKeySchema;

export const DeleteApiKeyResponseSchema = z.object({
  success: z.boolean(),
});

export const ValidateApiKeyResponseSchema = z.object({
  isValid: z.boolean(),
  provider: ProviderEnum,
  errorMessage: z.string().optional(),
});

// Error response schema
export const ApiKeyErrorResponseSchema = z.object({
  error: z.string(),
  field: z.string().optional(), // For field-specific validation errors
});

// Type exports (inferred from schemas)
export type Provider = z.infer<typeof ProviderEnum>;
export type ApiKey = z.infer<typeof ApiKeySchema>;
export type CreateApiKey = z.infer<typeof CreateApiKeySchema>;
export type UpdateApiKey = z.infer<typeof UpdateApiKeySchema>;
export type ValidateApiKey = z.infer<typeof ValidateApiKeySchema>;
export type PublicApiKey = z.infer<typeof PublicApiKeySchema>;
export type GetUserApiKeysResponse = z.infer<typeof GetUserApiKeysResponseSchema>;
export type CreateApiKeyResponse = z.infer<typeof CreateApiKeyResponseSchema>;
export type UpdateApiKeyResponse = z.infer<typeof UpdateApiKeyResponseSchema>;
export type DeleteApiKeyResponse = z.infer<typeof DeleteApiKeyResponseSchema>;
export type ValidateApiKeyResponse = z.infer<typeof ValidateApiKeyResponseSchema>;
export type ApiKeyErrorResponse = z.infer<typeof ApiKeyErrorResponseSchema>;
