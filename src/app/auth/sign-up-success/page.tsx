import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
                <CardDescription>Check your email to confirm</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve successfully signed up. Please check your email to confirm your
                  account before signing in.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
