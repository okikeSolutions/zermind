import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ZermindLogo } from "@/components/zermind-logo";
import { sx } from "@/styles/sx";

export const Route = createFileRoute("/share")({ component: ShareLayout });

function ShareLayout() {
  return (
    <div {...sx("min-h-screen bg-background")}>
      <div {...sx("border-b")}>
        <div {...sx("container mx-auto px-4 py-3 flex justify-between items-center")}>
          <ZermindLogo variant="compact" />
          <div {...sx("flex items-center gap-2")}>
            <span {...sx("text-sm text-muted-foreground")}>Shared Chat</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <main {...sx("h-[calc(100vh-73px)]")}>
        <Outlet />
      </main>
    </div>
  );
}
