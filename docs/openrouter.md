# OpenRouter Integration

Zermind uses OpenRouter as the system fallback provider for AI model access. Users can optionally provide direct provider keys through BYOK; when no user key is available, requests use OpenRouter.

## Why OpenRouter

OpenRouter provides one API for many model families, which makes it a good fallback for:

- OpenAI-compatible model IDs
- Anthropic model IDs
- Google/Gemini model IDs
- Meta/Llama model IDs
- other models exposed by OpenRouter

## Required setup

Create an OpenRouter key at:

```txt
https://openrouter.ai/keys
```

Set it locally:

```bash
OPENROUTER_API_KEY="sk-or-v1-..."
```

Set it in Convex:

```bash
bunx convex env set OPENROUTER_API_KEY "sk-or-v1-..."
```

## Runtime path

The current chat path is Convex Agent based:

```txt
client
  → api.agentActions.send
  → convex/agentActions.ts
  → convex/lib/modelProvider.ts
  → @openrouter/ai-sdk-provider
  → Convex Agent streamText
```

There is no `/api/chat` Next.js route in the current setup.

## Provider resolution

Provider detection is implemented in:

```txt
convex/lib/modelProvider.ts
```

Rules:

```txt
openai/* or gpt-*       → openai
anthropic/* or claude-* → anthropic
google/* or gemini-*   → google
meta/* or llama-*      → meta
otherwise              → openrouter
```

If a user has an active key for the detected provider, Zermind uses the direct provider client. Otherwise it uses OpenRouter.

## Model IDs

The UI model selector can include OpenRouter-compatible IDs, for example:

```txt
openai/gpt-4o-mini
anthropic/claude-3.5-sonnet
google/gemini-2.0-flash
meta-llama/llama-3.1-70b-instruct
```

When the app falls back to OpenRouter, model names are normalized for OpenRouter where needed.

## AI SDK v6

Zermind uses AI SDK v6 packages:

```txt
ai
@ai-sdk/openai
@ai-sdk/anthropic
@ai-sdk/google
@openrouter/ai-sdk-provider
```

The Agent call receives a resolved AI SDK language model per request:

```ts
zermindAgent.streamText(
  ctx,
  { userId, threadId },
  {
    prompt,
    model: languageModel,
    temperature,
  },
  { saveStreamDeltas: true },
);
```

## Cost management

- Monitor usage in the OpenRouter dashboard.
- Set spending limits in OpenRouter.
- Encourage users to add BYOK keys if they want to use their own direct provider credits.
- Zermind logs request counts/model usage in Convex `usageLogs`.

## Troubleshooting

### `OpenRouter API key not configured`

Set `OPENROUTER_API_KEY` in both local env and Convex env:

```bash
bunx convex env set OPENROUTER_API_KEY "sk-or-v1-..."
```

### A direct provider key is ignored

Check that:

- the key is active in Settings
- the selected model maps to the same provider
- the key format passes validation
- Convex has `API_KEY_ENCRYPTION_SECRET` set so keys can be decrypted

### A model does not work through OpenRouter

Check the exact model slug on:

```txt
https://openrouter.ai/models
```

and update the model selector accordingly.
