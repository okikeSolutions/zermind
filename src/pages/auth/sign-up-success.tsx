import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ZermindLogo } from "@/components/zermind-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { sx } from "@/styles/sx";

export default function Page() {
  return (
    <div {...sx("min-h-svh bg-gradient-to-br from-background via-background to-muted/30 relative")}>
      {/* Logo in top left */}
      <div {...sx("absolute top-4 left-4 z-10")}>
        <div {...sx("bg-background/80 backdrop-blur-sm border rounded-lg p-2")}>
          <ZermindLogo variant="compact" />
        </div>
      </div>

      {/* Theme Switcher in top right */}
      <div {...sx("absolute top-4 right-4 z-10")}>
        <ThemeSwitcher />
      </div>

      {/* Main Content */}
      <div {...sx("flex min-h-svh w-full items-center justify-center p-6 md:p-10")}>
        <div {...sx("w-full max-w-sm")}>
          <div {...sx("flex flex-col gap-6")}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
                <CardDescription>Check your email to confirm</CardDescription>
              </CardHeader>
              <CardContent>
                <p {...sx("text-sm text-muted-foreground")}>
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
