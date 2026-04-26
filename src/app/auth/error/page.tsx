import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZermindLogo } from "@/components/zermind-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams;

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
                <CardTitle className="text-2xl">Sorry, something went wrong.</CardTitle>
              </CardHeader>
              <CardContent>
                {params?.error ? (
                  <p className="text-sm text-muted-foreground">Code error: {params.error}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
