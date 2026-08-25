import stylex from "@stylexjs/unplugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const prerenderedPublicPages = [
  "/",
  "/demo",
  "/demo/ai-comparison",
  "/demo/creative-writing",
  "/demo/problem-solving",
  "/privacy",
  "/terms",
  "/imprint",
];

export default defineConfig({
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    stylex.vite({
      devMode: "full",
      useCSSLayers: false,
    }),
    nitro(),
    tanstackStart({
      pages: prerenderedPublicPages.map((path) => ({
        path,
        prerender: {
          enabled: true,
          crawlLinks: false,
        },
      })),
      prerender: {
        enabled: true,
        failOnError: true,
        autoStaticPathsDiscovery: false,
      },
      sitemap: {
        enabled: false,
      },
      spa: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
  ssr: {
    noExternal: ["@convex-dev/better-auth"],
  },
});
