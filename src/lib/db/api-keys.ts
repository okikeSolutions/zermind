import prisma from '@/lib/prisma';
import { encryptApiKey, decryptApiKey, createApiKeyPreview } from '@/lib/crypto';
import { 
  ApiKeySchema,
  PublicApiKeySchema,
  type ApiKey,
  type PublicApiKey,
  type Provider
} from '@/lib/schemas/api-keys';

// Get all API keys for a user (returns public data only)
export async function getUserApiKeys(userId: string): Promise<PublicApiKey[]> {
  const rawKeys = await prisma.apiKey.findMany({
    where: {
      userId
    },
    orderBy: [
      { isActive: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  // Transform to public schema (no decryption needed for preview)
  return rawKeys.map(key => {
    const decryptedKey = decryptApiKey(key.encryptedKey);
    const keyPreview = createApiKeyPreview(decryptedKey);
    
    return PublicApiKeySchema.parse({
      ...key,
      keyPreview
    });
  });
}

// Get active API key for a specific provider
export async function getActiveApiKey(userId: string, provider: Provider): Promise<string | null> {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      userId,
      provider,
      isActive: true
    },
    orderBy: {
      lastUsedAt: 'desc'
    }
  });

  if (!apiKey) return null;

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  });

  return decryptApiKey(apiKey.encryptedKey);
}

// Create a new API key
export async function createApiKey(
  userId: string,
  provider: Provider,
  apiKey: string,
  keyName: string
): Promise<PublicApiKey> {
  // Encrypt the API key
  const encryptedKey = encryptApiKey(apiKey);
  const keyPreview = createApiKeyPreview(apiKey);

  const newKey = await prisma.apiKey.create({
    data: {
      userId,
      provider,
      encryptedKey,
      keyName
    }
  });

  return PublicApiKeySchema.parse({
    ...newKey,
    keyPreview
  });
}

// Update an API key (name and active status only)
export async function updateApiKey(
  keyId: string,
  userId: string,
  updates: { keyName?: string; isActive?: boolean }
): Promise<PublicApiKey> {
  const updatedKey = await prisma.apiKey.update({
    where: {
      id: keyId,
      userId // Ensure user owns the key
    },
    data: updates
  });

  const decryptedKey = decryptApiKey(updatedKey.encryptedKey);
  const keyPreview = createApiKeyPreview(decryptedKey);

  return PublicApiKeySchema.parse({
    ...updatedKey,
    keyPreview
  });
}

// Delete an API key
export async function deleteApiKey(keyId: string, userId: string): Promise<boolean> {
  try {
    await prisma.apiKey.delete({
      where: {
        id: keyId,
        userId // Ensure user owns the key
      }
    });
    return true;
  } catch (error) {
    console.error('Error deleting API key:', error);
    return false;
  }
}

// Check if user has any API keys for a provider
export async function hasApiKeyForProvider(userId: string, provider: Provider): Promise<boolean> {
  const count = await prisma.apiKey.count({
    where: {
      userId,
      provider,
      isActive: true
    }
  });
  
  return count > 0;
}

// Get API key by ID (with decryption - use carefully)
export async function getApiKeyById(keyId: string, userId: string): Promise<ApiKey | null> {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: keyId,
      userId
    }
  });

  if (!apiKey) return null;

  return ApiKeySchema.parse(apiKey);
}

// Test API key format and basic validation
export async function validateApiKeyExists(userId: string, provider: Provider, keyName: string): Promise<boolean> {
  const existing = await prisma.apiKey.findFirst({
    where: {
      userId,
      provider,
      keyName
    }
  });
  
  return !!existing;
} 