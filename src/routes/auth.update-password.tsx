import { createFileRoute } from "@tanstack/react-router";
import { UpdatePasswordForm } from "@/components/auth/forms/update-password-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

import * as m from "@/paraglide/messages.js";
export const Route = createFileRoute("/auth/update-password")({
  head: () =>
    seo({
      title: m.copy_choose_a_new_password_zermind(),
      description: m.copy_choose_a_new_password_for_your_zermind_account(),
      path: "/auth/update-password",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <UpdatePasswordForm />
    </AuthPageShell>
  ),
});
