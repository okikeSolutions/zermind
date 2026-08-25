import { createFileRoute } from "@tanstack/react-router";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seo } from "@/lib/seo";

import * as m from "@/paraglide/messages.js";
export const Route = createFileRoute("/auth/error")({
  head: () =>
    seo({
      title: m.copy_authentication_error_zermind(),
      description: m.copy_zermind_could_not_complete_the_authentication_request(),
      path: "/auth/error",
      noIndex: true,
    }),
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  component: AuthError,
});

function AuthError() {
  const { error } = Route.useSearch();
  return (
    <AuthPageShell>
      <Card>
        <CardHeader>
          <CardTitle>{m.copy_sorry_something_went_wrong()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {error ? m.copy_error_code({ code: error }) : m.copy_an_unspecified_error_occurred()}
          </p>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
