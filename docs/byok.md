# BYOK (Bring Your Own Key) Implementation

## Overview

This implementation allows users to securely store and use their own API keys for AI providers, enabling them to use their own credits instead of relying on the application's API keys.

## Security Features

### 🔐 Encryption at Rest

- API keys are encrypted using **AES-256-GCM** encryption before storage
- Each encrypted key includes:
  - Random 128-bit IV (Initialization Vector)
  - Authentication tag for integrity verification
  - Additional Authenticated Data (AAD) for extra security

### 🛡️ Key Management

- Encryption key derived from `API_KEY_ENCRYPTION_SECRET` environment variable
- Uses PBKDF2 with 100,000 iterations for key derivation
- Keys are never stored in plaintext
- Only key previews (first 4 + last 4 characters) are shown in UI

### 🔍 Access Control

- API keys are tied to specific user accounts
- Server-side validation ensures users can only access their own keys
- Proper authentication required for all operations

### 📡 Transmission Security

- API keys transmitted over HTTPS only
- Password-type input fields prevent shoulder surfing
- No logging of actual API key values

## Database Schema

```sql
-- API Key model for BYOK functionality
model ApiKey {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  provider      String   -- "openrouter", "openai", "anthropic", etc.
  encryptedKey  String   @map("encrypted_key") -- AES-256 encrypted
  keyName       String?  @map("key_name") -- User-friendly name
  isActive      Boolean  @default(true) @map("is_active")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  lastUsedAt    DateTime? @map("last_used_at")

  @@unique([userId, provider, keyName])
  @@map("api_keys")
}
```

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```bash
# REQUIRED: Strong encryption secret (32+ characters)
API_KEY_ENCRYPTION_SECRET="your-very-strong-encryption-secret-here"
```

Generate a strong secret:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Database Migration

Run Prisma commands to apply the schema:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Or create and apply migration (production)
npx prisma migrate dev --name add-api-keys
```

### 3. Supported Providers

Currently supports:

- **OpenRouter** - Multiple AI models in one API
- **OpenAI** - GPT models
- **Anthropic** - Claude models
- **Meta** - Llama models
- **Google** - Gemini models

## API Endpoints

### GET `/api/user/api-keys`

Retrieve user's API keys (returns public data only)

### POST `/api/user/api-keys`

Create a new API key

```json
{
  "provider": "openrouter",
  "apiKey": "sk-or-v1-...",
  "keyName": "My OpenRouter Key"
}
```

### PATCH `/api/user/api-keys/[keyId]`

Update API key (name or active status)

```json
{
  "keyName": "Updated Name",
  "isActive": false
}
```

### DELETE `/api/user/api-keys/[keyId]`

Delete an API key permanently

## Usage in Chat System

The chat system automatically handles BYOK with this simplified flow:

```typescript
// Chat API automatically:
// 1. Detects provider from model (e.g., "openai/gpt-4" → OpenAI)
// 2. Checks for user's API key for that provider
// 3. If user key exists: Use direct provider API (OpenAI, Anthropic, etc.)
// 4. If no user key: Always fallback to OpenRouter

// Benefits:
// - User keys = Direct API access (better performance, user's credits)
// - No user keys = OpenRouter fallback (all models still work)
// - Only requires one system API key (OpenRouter)
```

## Security Best Practices Implemented

1. **Never log API keys** - Logging only logs encrypted versions or previews
2. **Input validation** - Strict validation of API key formats per provider
3. **Rate limiting** - Should be implemented at the API route level
4. **Audit trail** - Track when keys are used via `lastUsedAt`
5. **Graceful errors** - Don't expose internal encryption errors to clients
6. **Key rotation** - Users can add new keys and deactivate old ones
7. **Secure transmission** - HTTPS only, password-type inputs

## Error Handling

The implementation includes comprehensive error handling:

- Validation errors with field-specific messages
- Encryption/decryption error recovery
- Database constraint violations
- Authentication and authorization errors

## Future Enhancements

- **Key validation** - Test API keys against provider endpoints
- **Usage tracking** - Monitor API key usage and costs
- **Key expiration** - Automatic key rotation reminders
- **Team sharing** - Allow sharing keys within teams (enterprise feature)
- **Audit logs** - Detailed logging of key operations

## Security Considerations

⚠️ **Important Security Notes:**

1. The `API_KEY_ENCRYPTION_SECRET` should be:
   - At least 32 characters long
   - Generated randomly
   - Never committed to version control
   - Rotated periodically in production

2. Database backups will contain encrypted keys
   - Ensure backup security matches production
   - Consider additional backup encryption

3. Application logs should never contain:
   - Raw API keys
   - Encryption secrets
   - Decrypted key data

4. Consider implementing:
   - IP allowlisting for sensitive operations
   - Multi-factor authentication for key management
   - Regular security audits
