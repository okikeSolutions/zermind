import { createFileRoute } from "@tanstack/react-router";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/error")({
  head: () =>
    seo({
      title: "Authentication error | Zermind",
      description: "Zermind could not complete the authentication request.",
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
          <CardTitle>Sorry, something went wrong.</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error ? `Error code: ${error}` : "An unspecified error occurred."}</p>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
