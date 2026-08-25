import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/auth/forms/forgot-password-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

import * as m from "@/paraglide/messages.js";
export const Route = createFileRoute("/auth/forgot-password")({
  head: () =>
    seo({
      title: m.copy_reset_your_password_zermind(),
      description: m.copy_request_a_password_reset_for_your_zermind_account(),
      path: "/auth/forgot-password",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <ForgotPasswordForm />
    </AuthPageShell>
  ),
});
