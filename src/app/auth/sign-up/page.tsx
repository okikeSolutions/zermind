import { SignUpForm } from "@/components/auth/forms/sign-up-form";
import { ZermindLogo } from "@/components/zermind-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Page() {
  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-muted/30 relative">
      {/* Logo in top left */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-2">
          <ZermindLogo variant="compact" />
        </div>
      </div>

      {/* Theme Switcher in top right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
