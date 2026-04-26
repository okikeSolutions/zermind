import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits

// Get encryption key from environment variable
function getEncryptionKey(): Buffer {
  const key = process.env.API_KEY_ENCRYPTION_SECRET;

  if (!key) {
    throw new Error("API_KEY_ENCRYPTION_SECRET environment variable is required");
  }

  // If key is shorter than required, derive a proper key using PBKDF2
  if (key.length < KEY_LENGTH) {
    return crypto.pbkdf2Sync(key, "zermind-salt", 100000, KEY_LENGTH, "sha256");
  }

  // If key is longer, truncate to required length
  return Buffer.from(key.slice(0, KEY_LENGTH));
}

/**
 * Encrypts an API key using AES-256-GCM
 * Returns base64 encoded string containing IV + auth tag + encrypted data
 */
export function encryptApiKey(apiKey: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16); // 128-bit IV for GCM

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    cipher.setAAD(Buffer.from("zermind-api-key")); // Additional authenticated data

    let encrypted = cipher.update(apiKey, "utf8", "base64");
    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag();

    // Combine IV + auth tag + encrypted data
    const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, "base64")]);

    return combined.toString("base64");
  } catch (error) {
    console.error("Error encrypting API key:", error);
    throw new Error("Failed to encrypt API key");
  }
}

/**
 * Decrypts an API key encrypted with encryptApiKey
 */
export function decryptApiKey(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedData, "base64");

    // Extract components
    const iv = combined.subarray(0, 16);
    const authTag = combined.subarray(16, 32);
    const encrypted = combined.subarray(32);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAAD(Buffer.from("zermind-api-key"));
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Error decrypting API key:", error);
    throw new Error("Failed to decrypt API key");
  }
}

/**
 * Creates a preview of an API key (first 4 + last 4 characters)
 * Safe for displaying in UI
 */
export function createApiKeyPreview(apiKey: string): string {
  if (apiKey.length <= 8) {
    return "****";
  }

  const start = apiKey.slice(0, 4);
  const end = apiKey.slice(-4);
  const middle = "*".repeat(Math.min(apiKey.length - 8, 20));

  return `${start}${middle}${end}`;
}

/**
 * Validates that an API key has a reasonable format
 * This is a basic check before encryption
 */
export function validateApiKeyFormat(apiKey: string, provider: string): boolean {
  // Remove whitespace
  const cleanKey = apiKey.trim();

  // Basic length checks by provider
  switch (provider) {
    case "openrouter":
      // OpenRouter keys typically start with 'sk-or-' and are ~60 chars
      return cleanKey.startsWith("sk-or-") && cleanKey.length >= 40;
    case "openai":
      // OpenAI keys start with 'sk-' and are ~50 chars
      return cleanKey.startsWith("sk-") && cleanKey.length >= 40;
    case "anthropic":
      // Anthropic keys start with 'sk-ant-' and are longer
      return cleanKey.startsWith("sk-ant-") && cleanKey.length >= 40;
    default:
      // Generic validation - must be at least 20 chars and contain alphanumeric + special chars
      return cleanKey.length >= 20 && /^[A-Za-z0-9_-]+$/.test(cleanKey);
  }
}
