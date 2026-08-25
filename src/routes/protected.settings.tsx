import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { api } from "../../convex/_generated/api";
import SettingsPage from "@/pages/protected/settings";
import { fetchAuthQuery } from "@/lib/auth-server";

const getCurrentUser = createServerFn({ method: "GET" }).handler(() =>
  fetchAuthQuery(api.auth.getCurrentUser),
);

export const Route = createFileRoute("/protected/settings")({
  loader: () => getCurrentUser(),
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SettingsPage user={Route.useLoaderData()} />;
}
