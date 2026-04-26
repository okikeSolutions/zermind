import { ZermindLogo } from "@/components/zermind-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with branding */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <ZermindLogo variant="compact" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Shared Chat</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="h-[calc(100vh-73px)]">{children}</main>
    </div>
  );
}
