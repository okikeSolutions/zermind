import { createFileRoute } from "@tanstack/react-router";
import TermsPage from "@/pages/terms";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: "Terms of use | Zermind",
      description: "The terms that apply when using Zermind and its AI conversation tools.",
      path: "/terms",
    }),
  component: TermsPage,
});
