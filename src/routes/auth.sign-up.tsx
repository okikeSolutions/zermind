import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/components/auth/forms/sign-up-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/sign-up")({
  head: () =>
    seo({
      title: "Create an account | Zermind",
      description: "Create a Zermind account.",
      path: "/auth/sign-up",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <SignUpForm />
    </AuthPageShell>
  ),
});
