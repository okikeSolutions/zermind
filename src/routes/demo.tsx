import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { sx } from "@/styles/sx";

export const Route = createFileRoute("/demo")({
  component: DemoLayout,
});

function DemoLayout() {
  return (
    <div {...sx("flex min-h-screen flex-col")}>
      <AppHeader />
      <main {...sx("flex-1")}>
        <Outlet />
      </main>
    </div>
  );
}
