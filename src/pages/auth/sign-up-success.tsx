import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ZermindLogo } from "@/components/zermind-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
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
      <div {...sx("absolute top-4 right-4 z-10 flex items-center gap-2")}>
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>

      {/* Main Content */}
      <div {...sx("flex min-h-svh w-full items-center justify-center p-6 md:p-10")}>
        <div {...sx("w-full max-w-sm")}>
          <div {...sx("flex flex-col gap-6")}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{m.copy_thank_you_for_signing_up()}</CardTitle>
                <CardDescription>{m.copy_check_your_email_to_confirm()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p {...sx("text-sm text-muted-foreground")}>
                  {m.copy_you_ve_successfully_signed_up_please_check_your_email_to_confirm()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
