import { type Provider } from "@/lib/schemas/api-keys";

/**
 * Determines the provider from a model string
 */
export function getProviderFromModel(model: string): Provider {
  if (model.startsWith("openai/") || model.startsWith("gpt-")) {
    return "openai";
  }
  if (model.startsWith("anthropic/") || model.startsWith("claude-")) {
    return "anthropic";
  }
  if (model.startsWith("google/") || model.startsWith("gemini-")) {
    return "google";
  }
  if (model.startsWith("meta/") || model.startsWith("llama-")) {
    return "meta";
  }
  // Default to OpenRouter for any other models
  return "openrouter";
}

/**
 * Gets a user-friendly provider name
 */
export function getProviderDisplayName(provider: Provider): string {
  switch (provider) {
    case "openai":
      return "OpenAI";
    case "anthropic":
      return "Anthropic";
    case "google":
      return "Google";
    case "meta":
      return "Meta";
    case "openrouter":
      return "OpenRouter";
    default:
      return provider;
  }
}

/**
 * Gets the model display name without provider prefix
 */
export function getModelDisplayName(model: string): string {
  // Remove common provider prefixes
  return model
    .replace(/^(openai|anthropic|google|meta)\//i, "")
    .replace(/^(gpt-|claude-|gemini-|llama-)/i, (match) => match.toUpperCase());
}

/**
 * Checks if a model requires a specific provider (not available via OpenRouter)
 */
export function isDirectProviderModel(model: string): boolean {
  // These models typically require direct API access
  return model.startsWith("gpt-") || model.startsWith("claude-") || model.startsWith("gemini-");
}

/**
 * Model capabilities interface
 */
export interface ModelCapabilities {
  supportsImages: boolean;
  supportsDocuments: boolean;
  maxImageSize?: number; // in MB
  maxDocumentSize?: number; // in MB
  supportedImageTypes?: string[];
  supportedDocumentTypes?: string[];
}

/**
 * Gets model capabilities for file attachments
 */
export function getModelCapabilities(model: string): ModelCapabilities {
  const provider = getProviderFromModel(model);

  // Default capabilities - no file support
  const defaultCapabilities: ModelCapabilities = {
    supportsImages: false,
    supportsDocuments: false,
  };

  switch (provider) {
    case "openai":
      // GPT-4o and GPT-4o-mini support vision
      if (model.includes("gpt-4o")) {
        return {
          supportsImages: true,
          supportsDocuments: false, // OpenAI doesn't support document upload via vision API
          maxImageSize: 20, // 20MB limit
          supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        };
      }
      return defaultCapabilities;

    case "anthropic":
      // Claude 3+ models support vision
      if (model.includes("claude-3")) {
        return {
          supportsImages: true,
          supportsDocuments: false, // Claude doesn't support document upload directly
          maxImageSize: 5, // 5MB limit for Claude
          supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        };
      }
      return defaultCapabilities;

    case "google":
      // Gemini models support multimodal input
      if (model.includes("gemini")) {
        return {
          supportsImages: true,
          supportsDocuments: true, // Gemini can handle PDFs
          maxImageSize: 20,
          maxDocumentSize: 10,
          supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          supportedDocumentTypes: ["application/pdf"],
        };
      }
      return defaultCapabilities;

    case "openrouter":
    default:
      // OpenRouter supports many models with file capabilities
      // Check for specific model patterns that support vision/files
      const lowerModel = model.toLowerCase();

      // GPT-4o models via OpenRouter
      if (lowerModel.includes("gpt-4o") || lowerModel.includes("openai/gpt-4o")) {
        return {
          supportsImages: true,
          supportsDocuments: true, // OpenRouter adds PDF support
          maxImageSize: 20,
          maxDocumentSize: 10,
          supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          supportedDocumentTypes: ["application/pdf"],
        };
      }

      // Claude 3+ models via OpenRouter
      if (lowerModel.includes("claude-3") || lowerModel.includes("anthropic/claude-3")) {
        return {
          supportsImages: true,
          supportsDocuments: true, // OpenRouter adds PDF support
          maxImageSize: 5,
          maxDocumentSize: 10,
          supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          supportedDocumentTypes: ["application/pdf"],
        };
      }

      // Gemini models via OpenRouter
      if (lowerModel.includes("gemini") || lowerModel.includes("google/gemini")) {
        return {
          supportsImages: true,
          supportsDocuments: true,
          maxImageSize: 20,
          maxDocumentSize: 10,
          supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          supportedDocumentTypes: ["application/pdf"],
        };
      }

      // Other popular vision models via OpenRouter
      if (
        lowerModel.includes("llava") ||
        lowerModel.includes("llama-3.2-90b-vision") ||
        lowerModel.includes("llama-3.2-11b-vision") ||
        lowerModel.includes("qwen/qwen-2-vl") ||
        lowerModel.includes("mistral/pixtral")
      ) {
        return {
          supportsImages: true,
          supportsDocuments: true, // OpenRouter provides document parsing
          maxImageSize: 10,
          maxDocumentSize: 10,
          supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          supportedDocumentTypes: ["application/pdf"],
        };
      }

      return defaultCapabilities;
  }
}

/**
 * Checks if a model supports any file attachments
 */
export function modelSupportsAttachments(model: string): boolean {
  const capabilities = getModelCapabilities(model);
  return capabilities.supportsImages || capabilities.supportsDocuments;
}

/**
 * Gets allowed MIME types for a model
 */
export function getAllowedMimeTypes(model: string): string[] {
  const capabilities = getModelCapabilities(model);
  const allowedTypes: string[] = [];

  if (capabilities.supportsImages && capabilities.supportedImageTypes) {
    allowedTypes.push(...capabilities.supportedImageTypes);
  }

  if (capabilities.supportsDocuments && capabilities.supportedDocumentTypes) {
    allowedTypes.push(...capabilities.supportedDocumentTypes);
  }

  return allowedTypes;
}

/**
 * Gets maximum file size for a model based on file type
 */
export function getMaxFileSize(model: string, mimeType: string): number {
  const capabilities = getModelCapabilities(model);

  if (mimeType.startsWith("image/") && capabilities.maxImageSize) {
    return capabilities.maxImageSize * 1024 * 1024; // Convert MB to bytes
  }

  if (mimeType === "application/pdf" && capabilities.maxDocumentSize) {
    return capabilities.maxDocumentSize * 1024 * 1024; // Convert MB to bytes
  }

  return 5 * 1024 * 1024; // Default 5MB limit
}
