# BYOK (Bring Your Own Key)

Zermind lets users store their own AI provider API keys and use their own credits. BYOK is implemented entirely with Convex actions and Convex tables.

## Supported providers

```txt
openrouter
openai
anthropic
google
meta
```

Model/provider routing is handled in:

```txt
convex/lib/modelProvider.ts
```

## Runtime flow

When a user sends a message:

```txt
src/hooks/use-chat.ts
  → api.agentActions.send
  → convex/agentActions.ts
  → resolveLanguageModel(...)
  → zermindAgent.streamText(...)
```

`resolveLanguageModel` checks for an active user key for the selected provider:

1. If a user key exists, use the direct provider client.
2. If no user key exists, fall back to OpenRouter using `OPENROUTER_API_KEY`.
3. The selected model is passed to Convex Agent as a per-call AI SDK v6 language model.

## Storage model

API keys are stored in the Convex `apiKeys` table:

```ts
apiKeys: {
  userId: string;
  provider: "openrouter" | "openai" | "anthropic" | "meta" | "google";
  encryptedKey: string;
  keyPreview: string;
  keyName: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  lastUsedAt?: number;
}
```

Public client queries never return `encryptedKey`.

## Encryption

Encryption/decryption happens only in Convex Node actions:

```txt
convex/apiKeyActions.ts
convex/lib/modelProvider.ts
```

Security properties:

- AES-256-GCM encryption
- random IV per encrypted key
- auth tag for integrity verification
- Additional Authenticated Data (AAD): `zermind-api-key`
- PBKDF2 key derivation if the configured secret is shorter than 32 bytes
- only key previews are shown in UI

Required secret:

```bash
API_KEY_ENCRYPTION_SECRET="$(openssl rand -base64 32)"
```

Set it in Convex:

```bash
bunx convex env set API_KEY_ENCRYPTION_SECRET "$(openssl rand -base64 32)"
```

## Convex functions

Public/user-facing functions:

```txt
api.apiKeys.listMine
api.apiKeys.update
api.apiKeys.remove
api.apiKeyActions.create
```

Internal functions:

```txt
internal.apiKeys.createEncrypted
internal.apiKeys.getActiveEncrypted
internal.apiKeys.markUsed
```

## UI integration

The settings UI uses:

```txt
src/hooks/use-api-keys.ts
src/components/api-key-management.tsx
```

The hook calls Convex directly. There are no `/api/user/api-keys` REST routes.

## OpenRouter fallback

OpenRouter is the only required system provider key:

```bash
OPENROUTER_API_KEY="sk-or-v1-..."
```

Set it in Convex:

```bash
bunx convex env set OPENROUTER_API_KEY "sk-or-v1-..."
```

Direct provider environment keys such as `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `GOOGLE_GENERATIVE_AI_API_KEY` are not required for the application fallback path. Users add direct provider keys through BYOK.

## Security notes

- Never log raw API keys.
- Never return `encryptedKey` from public queries.
- Keep `API_KEY_ENCRYPTION_SECRET` out of source control.
- Rotating `API_KEY_ENCRYPTION_SECRET` requires re-encrypting stored keys.
- Account deletion removes the user’s stored API keys.
