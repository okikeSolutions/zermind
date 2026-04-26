import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isAuthenticated();

  if (!signedIn) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-2 sm:p-4 border-b flex-shrink-0">
              <SidebarTrigger />
            </div>
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
