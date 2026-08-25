<a href="https://zermind.ai/">
  <img alt="Zermind – Open Source AI Conversation Platform" src="https://zermind.ai/opengraph-image.png">
  <h1 align="center">Zermind – Open Source AI Conversation Platform</h1>
</a>

<p align="center">
  <a href="https://zermind.ai/privacy"><strong>Privacy Policy</strong></a> ·
  <a href="https://zermind.ai/terms"><strong>Terms of Use</strong></a> ·
  <a href="https://zermind.ai/imprint"><strong>Imprint</strong></a>
</p>
<br />

**Zermind** is an open-source AI conversation platform for visual thinking with LLMs. It combines traditional chat with **conversational mind maps**, so AI conversations can branch, resume from any node, compare multiple models, and be explored as knowledge trees.

Zermind is now built on a Convex-native backend:

- **Convex Better Auth** for auth
- **Convex Agent** for persistent AI threads, messages, and streaming
- **Convex database** for app metadata, BYOK keys, collaboration, usage, and feedback
- **Convex Presence** for realtime collaboration presence/cursors

---

## Features

### Dual interaction modes

- **Chat Mode**: Traditional linear AI chat
- **Mind Mode**: Conversation-as-mind-map visualization
- **Seamless switching** between chat and visual graph views

### Conversational mind maps

- **Node-based conversations**: Each node represents an Agent-backed message
- **Branching**: Resume from any node and create alternate paths
- **Multi-model branching**: Ask multiple models from the same context
- **Persistent layout**: Node positions and graph metadata are stored in Convex `zermindNodes`
- **Shared views**: Generate read-only share links

### Multi-provider AI / BYOK

- Supports OpenRouter, OpenAI, Anthropic, Meta/Llama, and Google/Gemini model IDs
- Users can add their own provider keys in settings
- If no user key exists, Zermind falls back to `OPENROUTER_API_KEY`
- API keys are encrypted at rest in Convex actions with AES-256-GCM

### Realtime collaboration

- Collaboration sessions and participants stored in Convex
- Presence/cursors powered by `@convex-dev/presence`
- App data updates are realtime through Convex subscriptions

---

## Tech Stack

| Layer           | Technology                      | Purpose                                              |
| --------------- | ------------------------------- | ---------------------------------------------------- |
| Frontend        | TanStack Start SPA + React 19   | Typed routes, app shell, and server functions        |
| Backend         | Convex                          | Database, functions, actions, realtime subscriptions |
| Auth            | Convex Better Auth              | Email/password and OAuth auth                        |
| AI runtime      | AI SDK v6 + Convex Agent        | Persistent AI threads/messages and streaming         |
| Model providers | OpenRouter + direct providers   | Fallback and BYOK provider access                    |
| Mind map UI     | `@xyflow/react`                 | Interactive conversation graph                       |
| Collaboration   | Convex Presence + Convex tables | Online presence, cursors, sessions, invites          |
| Styling         | StyleX                          | Typed, build-time atomic styles                      |
| State           | Zustand + Convex subscriptions  | Local UI state + realtime backend state              |
| Tooling         | Bun, Oxlint, Oxfmt, TypeScript  | Package/runtime, linting, formatting, type checking  |

---

## Architecture

Clean-slate data model:

```txt
Convex Better Auth
  ↓
chats table
  - app-level chat metadata
  - agentThreadId
  ↓
Convex Agent component
  - persistent threads
  - persistent messages
  - stream deltas
  ↓
zermindNodes table
  - mind-map layout and branch metadata
  - agentMessageId links back to Agent messages
```

The old Prisma/Supabase backend has been removed. There are no Prisma migrations, Supabase clients, or REST chat routes in the current setup.

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/yourusername/zermind.git
cd zermind
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Copy the example file:

```bash
cp env.example .env.local
```

Required local variables:

```bash
# Convex
VITE_CONVEX_URL="https://your-deployment.convex.cloud"
VITE_CONVEX_SITE_URL="https://your-deployment.convex.site"
VITE_SITE_URL="http://localhost:3000"

# AI fallback provider
OPENROUTER_API_KEY="sk-or-v1-..."

# BYOK encryption secret, 32+ chars recommended
API_KEY_ENCRYPTION_SECRET="$(openssl rand -base64 32)"

# Optional OAuth providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

See [docs/env-setup.md](docs/env-setup.md) for details.

### 4. Set Convex environment variables

Convex actions need server-side secrets in the Convex deployment:

```bash
bunx convex env set OPENROUTER_API_KEY "sk-or-v1-..."
bunx convex env set API_KEY_ENCRYPTION_SECRET "$(openssl rand -base64 32)"
bunx convex env set SITE_URL "http://localhost:3000"
```

Add OAuth secrets if using Google/GitHub:

```bash
bunx convex env set GOOGLE_CLIENT_ID "..."
bunx convex env set GOOGLE_CLIENT_SECRET "..."
bunx convex env set GITHUB_CLIENT_ID "..."
bunx convex env set GITHUB_CLIENT_SECRET "..."
```

### 5. Generate Convex bindings

```bash
bunx convex codegen
```

### 6. Run locally

Run Convex dev in one terminal if needed:

```bash
bunx convex dev
```

Run TanStack Start in another terminal:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Common commands

```bash
bun dev              # Start TanStack Start with Vite
bun run build        # Build the SPA shell and Nitro server
bun run start        # Start production server
bunx convex dev      # Start Convex dev loop
bunx convex codegen  # Generate Convex types
bun run typecheck    # Type check
bun run lint         # Oxlint
bun run fmt          # Oxfmt
bun run fmt:check    # Check formatting
```

---

## Documentation

- [Environment Setup](docs/env-setup.md)
- [BYOK Implementation](docs/byok.md)
- [OpenRouter Integration](docs/openrouter.md)
- [Storage and Attachments](docs/storage.md)

---

## Supported Providers

- **OpenRouter** — fallback provider and access to many models
- **OpenAI** — direct BYOK support
- **Anthropic** — direct BYOK support
- **Google** — direct BYOK support
- **Meta/Llama** — generally routed through OpenRouter

---

## License

MIT — use it freely, contribute back if you like.

**Zermind** was built to revolutionize how we think with AI.
