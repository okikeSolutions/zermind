import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/forms/login-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/login")({
  head: () =>
    seo({
      title: "Sign in | Zermind",
      description: "Sign in to your Zermind account.",
      path: "/auth/login",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <LoginForm />
    </AuthPageShell>
  ),
});
