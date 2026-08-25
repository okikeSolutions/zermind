import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { ChatInterface } from "@/components/chat-interface";
import { seo } from "@/lib/seo";
import { buildHomeJsonLd } from "@/lib/site-content";
import * as m from "@/paraglide/messages.js";
import { sx } from "@/styles/sx";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: m.home_meta_title(),
      description: m.home_meta_description(),
      path: "/",
      jsonLd: buildHomeJsonLd(),
    }),
  component: Home,
});

function Home() {
  const { isAuthenticated } = Route.useRouteContext();

  return (
    <div
      {...sx(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4",
      )}
    >
      <AppHeader />
      <ChatInterface isAuthenticated={isAuthenticated} />
    </div>
  );
}
