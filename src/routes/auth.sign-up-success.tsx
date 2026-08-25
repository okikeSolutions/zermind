import { createFileRoute } from "@tanstack/react-router";
import SignUpSuccessPage from "@/pages/auth/sign-up-success";
import { seo } from "@/lib/seo";

import * as m from "@/paraglide/messages.js";
export const Route = createFileRoute("/auth/sign-up-success")({
  head: () =>
    seo({
      title: m.copy_check_your_email_zermind(),
      description: m.copy_confirm_your_email_address_to_finish_creating_your_zermind_accou(),
      path: "/auth/sign-up-success",
      noIndex: true,
    }),
  component: SignUpSuccessPage,
});
