import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { seo } from "@/lib/seo";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
export const Route = createFileRoute("/protected")({
  head: () =>
    seo({
      title: m.copy_zermind_workspace(),
      description: m.copy_your_private_zermind_workspace(),
      path: "/protected",
      noIndex: true,
    }),
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <SidebarProvider>
      <div
        {...sx("flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/30")}
      >
        <AppSidebar />
        <main {...sx("flex-1 flex flex-col min-w-0")}>
          <div {...sx("flex-1 flex flex-col min-h-0")}>
            <div {...sx("p-2 sm:p-4 border-b flex-shrink-0")}>
              <SidebarTrigger />
            </div>
            <div {...sx("flex-1 overflow-auto")}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
