import { createFileRoute } from "@tanstack/react-router";
import SignUpSuccessPage from "@/pages/auth/sign-up-success";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/sign-up-success")({
  head: () =>
    seo({
      title: "Check your email | Zermind",
      description: "Confirm your email address to finish creating your Zermind account.",
      path: "/auth/sign-up-success",
      noIndex: true,
    }),
  component: SignUpSuccessPage,
});
