import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/components/auth/forms/sign-up-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { seo } from "@/lib/seo";

import * as m from "@/paraglide/messages.js";
export const Route = createFileRoute("/auth/sign-up")({
  head: () =>
    seo({
      title: m.copy_create_an_account_zermind(),
      description: m.copy_create_a_zermind_account(),
      path: "/auth/sign-up",
      noIndex: true,
    }),
  component: () => (
    <AuthPageShell>
      <SignUpForm />
    </AuthPageShell>
  ),
});
