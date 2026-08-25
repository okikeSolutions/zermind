import { createFileRoute } from "@tanstack/react-router";
import ImprintPage from "@/pages/imprint";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/imprint")({
  head: () =>
    seo({
      title: "Imprint | Zermind",
      description: "Legal provider and contact information for Zermind.",
      path: "/imprint",
    }),
  component: ImprintPage,
});
