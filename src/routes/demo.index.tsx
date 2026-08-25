import { createFileRoute } from "@tanstack/react-router";
import DemoPage from "@/pages/demo";
import { seo } from "@/lib/seo";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/demo/")({
  head: () =>
    seo({
      title: m.demo_meta_title(),
      description: m.demo_meta_description(),
      path: "/demo",
    }),
  component: DemoPage,
});
