import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand: "npx convex deploy --cmd-url-env-var-name VITE_CONVEX_URL --cmd 'bun run build'",
  installCommand: "bun install",
  rewrites: [
    {
      source: "/js/script.js",
      destination: "https://datafa.st/js/script.js",
    },
    {
      source: "/api/events",
      destination: "https://datafa.st/api/events",
    },
  ],
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};
