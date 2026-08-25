import { createFileRoute } from "@tanstack/react-router";
import TermsPage from "@/pages/terms";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: m.terms_meta_title(),
      description: m.terms_meta_description(),
      path: "/terms",
    }),
  component: TermsPage,
});
