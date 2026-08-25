import { paraglideVitePlugin } from "@inlang/paraglide-js";
import stylex from "@stylexjs/unplugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import {
  localizedPrerenderPaths,
  localizedUrlPatterns,
  paraglideRouteStrategies,
} from "./i18n/config.ts";

export default defineConfig({
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      urlPatterns: localizedUrlPatterns,
      routeStrategies: [...paraglideRouteStrategies],
    }),
    stylex.vite({
      devMode: "full",
      useCSSLayers: false,
    }),
    nitro(),
    tanstackStart({
      pages: localizedPrerenderPaths.map((path) => ({
        path,
        prerender: {
          enabled: true,
          crawlLinks: false,
          headers: {
            cookie: `PARAGLIDE_LOCALE=${path.split("/")[1]}`,
            "accept-language": path.split("/")[1] ?? "en",
          },
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
