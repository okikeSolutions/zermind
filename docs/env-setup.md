# Environment Setup

Zermind uses Convex for backend data/functions/auth and Convex Agent for AI threads/messages. There is no Prisma, Postgres, or Supabase configuration in the current setup.

## Local environment file

Create `.env.local` from the example:

```bash
cp env.example .env.local
```

## Required variables

### Convex

```bash
NEXT_PUBLIC_CONVEX_URL="https://your-deployment.convex.cloud"
NEXT_PUBLIC_CONVEX_SITE_URL="https://your-deployment.convex.site"
SITE_URL="http://localhost:3000"
```

- `NEXT_PUBLIC_CONVEX_URL` is used by the browser Convex client.
- `NEXT_PUBLIC_CONVEX_SITE_URL` is used for Convex HTTP routes, including Better Auth routes.
- `SITE_URL` is used by Better Auth for redirects/callbacks.

### AI fallback provider

```bash
OPENROUTER_API_KEY="sk-or-v1-..."
```

OpenRouter is the system fallback when a user has not configured a BYOK key for the selected provider.

### BYOK encryption

```bash
API_KEY_ENCRYPTION_SECRET="your-strong-secret"
```

Generate one with:

```bash
openssl rand -base64 32
```

This secret is used by Convex Node actions to encrypt/decrypt user API keys with AES-256-GCM.

## Optional OAuth provider variables

If using OAuth login, configure the relevant provider credentials:

```bash
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

Email/password auth works through Convex Better Auth without OAuth provider variables.

## Convex deployment environment

Secrets used by Convex actions must be set in Convex, not only in `.env.local`.

```bash
bunx convex env set OPENROUTER_API_KEY "sk-or-v1-..."
bunx convex env set API_KEY_ENCRYPTION_SECRET "$(openssl rand -base64 32)"
bunx convex env set SITE_URL "http://localhost:3000"
```

For OAuth:

```bash
bunx convex env set GOOGLE_CLIENT_ID "..."
bunx convex env set GOOGLE_CLIENT_SECRET "..."
bunx convex env set GITHUB_CLIENT_ID "..."
bunx convex env set GITHUB_CLIENT_SECRET "..."
```

## Example `.env.local`

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL="https://your-deployment.convex.cloud"
NEXT_PUBLIC_CONVEX_SITE_URL="https://your-deployment.convex.site"
SITE_URL="http://localhost:3000"

# AI fallback
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key"

# BYOK encryption
API_KEY_ENCRYPTION_SECRET="your-generated-32-byte-secret"

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Public site URL / SEO
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

## Removed legacy variables

These are no longer used by the current app:

```bash
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

The app no longer uses Prisma, Supabase Auth, Supabase Realtime, or Supabase Storage.

## Validation

After configuring env vars, run:

```bash
bunx convex codegen
bunx tsc --noEmit
bun run fmt:check
bun run lint
```
