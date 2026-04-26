import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand:
    "npx convex deploy --cmd 'bun run build' --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL",
  installCommand: "bun install",
};