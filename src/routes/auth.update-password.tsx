import { createFileRoute } from "@tanstack/react-router";
import { UpdatePasswordForm } from "@/components/auth/forms/update-password-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/update-password")({
  head: () =>
    seo({
      title: "Choose a new password | Zermind",
      description: "Choose a new password for your Zermind account.",
      path: "/auth/update-password",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <UpdatePasswordForm />
    </AuthPageShell>
  ),
});
