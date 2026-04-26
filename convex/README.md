# Zermind Convex Backend

This directory contains the Convex backend for Zermind.

## Components

Registered in `convex/convex.config.ts`:

```txt
@convex-dev/agent        persistent AI threads/messages/streaming
@convex-dev/better-auth  auth integration
@convex-dev/presence     collaboration presence/cursors
@convex-dev/rate-limiter app-level limits for AI, uploads, sharing, invites, feedback
```

`@convex-dev/persistent-text-streaming` is intentionally not used. Core chat streaming is handled by Convex Agent via `streamText(..., { saveStreamDeltas: true })`.

## Main modules

```txt
convex/auth.ts              Better Auth setup and current-user query
convex/http.ts              Better Auth HTTP route registration
convex/schema.ts            app schema
convex/agent.ts             Zermind Agent instance
convex/agentActions.ts      Agent send action
convex/agentChat.ts         Agent-backed chat helpers/queries
convex/chats.ts             chat CRUD/share queries, Agent-thread-backed reads
convex/files.ts             Convex file storage upload URL, metadata, URL, delete functions
convex/zermindNodes.ts      mind-map node metadata and position updates
convex/collaboration.ts     collaboration sessions, participants, invites
convex/presence.ts          presence component wrapper
convex/apiKeys.ts           public/internal API key metadata functions
convex/apiKeyActions.ts     Node actions for BYOK encryption/decryption
convex/usage.ts             usage logging/statistics
convex/feedback.ts          feedback submission
convex/account.ts           account stats/export/delete
convex/rateLimits.ts        centralized Convex component rate limits
convex/lib/auth.ts          Convex auth helpers
convex/lib/modelProvider.ts model/provider resolution and BYOK lookup
```

## Data model summary

```txt
chats
  app-level chat metadata
  agentThreadId links to Convex Agent thread

zermindNodes
  app-owned mind-map metadata
  agentMessageId links to Convex Agent message

fileAttachments
  Convex file storage references and attachment metadata
  storageId links to the Convex _storage system table

apiKeys
  encrypted BYOK provider keys

usageLogs
  model usage events

collaborationSessions / sessionParticipants / collaborationInvitations
  collaboration state

feedback
  user feedback

conversationTemplates
  reusable conversation/mind-map templates
```

Convex Agent owns the actual AI thread/message store. The app does not maintain a separate canonical `messages` table. Uploaded files live in Convex file storage and are referenced from `fileAttachments` and Agent message parts.

## Auth rule

Convex functions should derive the user from server-side auth:

```ts
const userId = await requireUserId(ctx);
```

Do not accept `userId` from the client for authorization.

## AI send flow

```txt
client
  → api.agentActions.send
  → require authenticated user
  → load chat and verify access
  → resolve provider/BYOK/fallback model
  → convert uploaded attachment storage IDs into AI SDK image/file parts
  → zermindAgent.streamText(..., { saveStreamDeltas: true })
  → create zermindNodes metadata for saved Agent messages
  → log usage
```

## Rate limiting

Application-level rate limits are defined in `convex/rateLimits.ts` using `@convex-dev/rate-limiter`.

Currently limited operations:

```txt
api.agentActions.send       AI request burst/hourly limits
api.files.generateUploadUrl upload URL burst/hourly limits
api.files.saveUploadedFile  uploaded file metadata write limit
api.feedback.create         feedback spam protection
api.collaboration.start     collaboration session creation limit
api.collaboration.join      collaboration join limit
api.collaboration.invite    invite spam protection
api.chats.create            chat creation limit
api.chats.generateShareLink share-link generation limit
api.apiKeyActions.create    BYOK creation limit
api.account.exportMine      account export daily limit
```

Actions use internal mutations for rate-limit consumption because the rate limiter is mutation/transaction based. Normal reactive read queries and high-frequency presence updates are intentionally not rate-limited here.

## File attachment flow

Zermind uses Convex file storage for chat attachments. Supabase Storage is not used.

```txt
client
  → api.files.generateUploadUrl
  → POST file bytes to the generated Convex upload URL
  → api.files.saveUploadedFile
  → receive attachment metadata with storageId and serving URL
  → api.agentActions.send with attachment storage IDs
```

Important rules:

- `api.files.generateUploadUrl` requires an authenticated Convex user.
- `api.files.saveUploadedFile` stores app metadata in `fileAttachments` after the upload succeeds.
- Files are served with `ctx.storage.getUrl(storageId)`.
- Chat deletion and account deletion remove related storage objects and `fileAttachments` rows.
- Individual files can be deleted with `api.files.remove`.
- Storage IDs should be validated with `v.id("_storage")` in Convex functions.

## Environment variables

Set runtime secrets in Convex:

```bash
bunx convex env set OPENROUTER_API_KEY "sk-or-v1-..."
bunx convex env set API_KEY_ENCRYPTION_SECRET "$(openssl rand -base64 32)"
bunx convex env set SITE_URL "http://localhost:3000"
```

OAuth, if enabled:

```bash
bunx convex env set GOOGLE_CLIENT_ID "..."
bunx convex env set GOOGLE_CLIENT_SECRET "..."
bunx convex env set GITHUB_CLIENT_ID "..."
bunx convex env set GITHUB_CLIENT_SECRET "..."
```

## Development commands

```bash
bunx convex dev
bunx convex codegen
bunx tsc --noEmit
bun run lint
bun run fmt:check
```

Generated files under `convex/_generated` are not formatted by Oxfmt.
