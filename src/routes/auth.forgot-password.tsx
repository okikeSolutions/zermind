import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/auth/forms/forgot-password-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () =>
    seo({
      title: "Reset your password | Zermind",
      description: "Request a password reset for your Zermind account.",
      path: "/auth/forgot-password",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <ForgotPasswordForm />
    </AuthPageShell>
  ),
});
