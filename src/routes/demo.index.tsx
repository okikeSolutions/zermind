import { createFileRoute } from "@tanstack/react-router";
import DemoPage from "@/pages/demo";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/demo/")({
  head: () =>
    seo({
      title: "Try Zermind | Interactive AI mind-map demo",
      description: "Try Zermind's interactive AI conversation and mind-mapping demo.",
      path: "/demo",
    }),
  component: DemoPage,
});
