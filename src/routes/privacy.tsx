import { createFileRoute } from "@tanstack/react-router";
import PrivacyPage from "@/pages/privacy";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy policy | Zermind",
      description: "How Zermind collects, uses, stores, and protects personal data.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});
