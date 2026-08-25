import { createFileRoute } from "@tanstack/react-router";
import ImprintPage from "@/pages/imprint";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/imprint")({
  head: () =>
    seo({
      title: m.imprint_meta_title(),
      description: m.imprint_meta_description(),
      path: "/imprint",
    }),
  component: ImprintPage,
});
