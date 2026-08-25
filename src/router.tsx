import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider, notifyManager } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime.js";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  if (typeof document !== "undefined") {
    notifyManager.setScheduler(window.requestAnimationFrame);
  }

  const convexUrl = import.meta.env.VITE_CONVEX_URL ?? import.meta.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("VITE_CONVEX_URL is not set");
  }

  const convexQueryClient = new ConvexQueryClient(convexUrl, {
    expectAuth: true,
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);

  const router = createRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
    context: {
      queryClient,
      convexQueryClient,
    },
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
