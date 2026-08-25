import { ConvexBetterAuthProvider, type AuthClient } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import CookieBanner from "@/components/cookie-banner";
import { StyleXDevRuntime } from "@/components/stylex-dev-runtime";
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/auth-server";
import { jsonLdScript } from "@/lib/seo";
import { buildSiteJsonLd } from "@/lib/site-content";
import appCss from "@/styles/legacy-utilities.css?url";

const getAuth = createServerFn({ method: "GET" }).handler(async () => getToken());

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Zermind - AI Chat" },
      {
        name: "description",
        content: "Open-source AI chat application with multiple LLM providers",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico?v=2", type: "image/x-icon", sizes: "any" },
      {
        rel: "icon",
        href: "/favicon-32x32.png?v=2",
        type: "image/png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        href: "/favicon-16x16.png?v=2",
        type: "image/png",
        sizes: "16x16",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png?v=2",
        type: "image/png",
        sizes: "180x180",
      },
    ],
    scripts: [jsonLdScript(buildSiteJsonLd())],
  }),
  beforeLoad: async ({ context }) => {
    const token = await getAuth();
    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return {
      isAuthenticated: Boolean(token),
      token,
    };
  },
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  // The adapter supports Better Auth 1.6.22, but its exported client type still
  // uses the older session inference. Keep the assertion at the provider boundary.
  const convexAuthClient = authClient as unknown as AuthClient;

  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={convexAuthClient}
      initialToken={context.token}
    >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Outlet />
        <CookieBanner />
        <Toaster />
      </ThemeProvider>
    </ConvexBetterAuthProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <StyleXDevRuntime />
        <script
          defer
          data-website-id="689d8d61263a4603b7163a4a"
          data-domain="zermind.ai"
          src="https://datafa.st/js/script.js"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
