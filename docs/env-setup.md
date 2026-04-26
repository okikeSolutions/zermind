# Environment Variables Setup

## Required Variables

### Database (Required)

```bash
# Supabase Database URLs
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### API Key Encryption (Required for BYOK)

```bash
# Strong encryption secret for user API keys (32+ characters)
# Generate with: openssl rand -base64 32
API_KEY_ENCRYPTION_SECRET="your-very-strong-encryption-secret-here"
```

## Provider API Keys (Fallback)

When users don't have their own API keys, the app always falls back to OpenRouter:

### OpenRouter (Required)

```bash
# OpenRouter provides access to ALL AI models as fallback
# This is the only system API key required
OPENROUTER_API_KEY="sk-or-v1-..."
```

**Note**: Direct provider API keys (OpenAI, Anthropic, Google) are NOT needed as environment variables. They are only used when users add their own keys in settings.

### Other implemented Providers

OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key_here

## How BYOK Works

1. **User API Keys First**: When a user has added their own API key for a provider, it uses the direct provider API (better performance, user's credits)
2. **OpenRouter Fallback**: If no user key exists, the app always uses OpenRouter (works with all models)
3. **Simple Configuration**: Only requires one system API key (OpenRouter)

## Example .env

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/zermind"
DIRECT_URL="postgresql://postgres:password@localhost:5432/zermind"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# BYOK Encryption (REQUIRED)
API_KEY_ENCRYPTION_SECRET="$(openssl rand -base64 32)"

# Fallback API Key (Required)
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key"

# NODE ENV
NODE_ENV=development

# SEO
NEXT_PUBLIC_SITE_URL=your-production-url
```

## Security Notes

⚠️ **Important**:

- Never commit `.env` to version control
- Use strong, randomly generated secrets for `API_KEY_ENCRYPTION_SECRET`
- Rotate API keys regularly
- User API keys are encrypted and can only be decrypted by your application
