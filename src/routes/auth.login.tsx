import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/forms/login-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

import * as m from "@/paraglide/messages.js";
export const Route = createFileRoute("/auth/login")({
  head: () =>
    seo({
      title: m.copy_sign_in_zermind(),
      description: m.copy_sign_in_to_your_zermind_account(),
      path: "/auth/login",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <LoginForm />
    </AuthPageShell>
  ),
});
