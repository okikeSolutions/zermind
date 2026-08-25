import { createFileRoute } from "@tanstack/react-router";
import PrivacyPage from "@/pages/privacy";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: m.privacy_meta_title(),
      description: m.privacy_meta_description(),
      path: "/privacy",
    }),
  component: PrivacyPage,
});
