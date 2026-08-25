import { ZermindLogo } from "./zermind-logo";
import { AuthButton } from "./auth/auth-button";
import { ThemeSwitcher } from "./theme-switcher";
import { Route as RootRoute } from "@/routes/__root";
import { sx } from "@/styles/sx";

export function AppHeader() {
  const { isAuthenticated } = RootRoute.useRouteContext();

  return (
    <>
      {/* Logo in top left */}
      <div {...sx("absolute top-2 sm:top-4 left-2 sm:left-4 z-10")}>
        <div {...sx("bg-background/80 backdrop-blur-sm border rounded-lg p-1.5 sm:p-2")}>
          <ZermindLogo variant="compact" />
        </div>
      </div>

      {/* Auth and Theme controls in top right */}
      <div
        {...sx("absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex items-center gap-2 sm:gap-3")}
      >
        <div {...sx("bg-background/80 backdrop-blur-sm border rounded-lg p-1.5 sm:p-2")}>
          <AuthButton isAuthenticated={isAuthenticated} />
        </div>
        <ThemeSwitcher />
      </div>
    </>
  );
}
