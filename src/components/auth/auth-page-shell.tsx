import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ZermindLogo } from "@/components/zermind-logo";
import { sx } from "@/styles/sx";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div {...sx("min-h-svh bg-gradient-to-br from-background via-background to-muted/30 relative")}>
      <div {...sx("absolute top-4 left-4 z-10")}>
        <div {...sx("bg-background/80 backdrop-blur-sm border rounded-lg p-2")}>
          <ZermindLogo variant="compact" />
        </div>
      </div>
      <div {...sx("absolute top-4 right-4 z-10 flex items-center gap-2")}>
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
      <div {...sx("flex min-h-svh w-full items-center justify-center p-6 md:p-10")}>
        <div {...sx("w-full max-w-sm")}>{children}</div>
      </div>
    </div>
  );
}
