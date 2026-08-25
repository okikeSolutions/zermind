import Link from "@/lib/navigation";
import { Button } from "../ui/button";
import { LogoutButton } from "./logout-button";
import { useAuthUser } from "@/hooks/use-auth";
import { sx } from "@/styles/sx";

function SignedInAuthButton() {
  const { user } = useAuthUser();

  return (
    <div {...sx("flex items-center gap-4")}>
      {user?.email ? `Hey, ${user.email}!` : "Signed in"}
      <LogoutButton />
    </div>
  );
}

export function AuthButton({ isAuthenticated }: Readonly<{ isAuthenticated: boolean }>) {
  if (isAuthenticated) return <SignedInAuthButton />;

  return (
    <div {...sx("flex gap-2")}>
      <Button render={<Link href="/auth/login" />} nativeButton={false} size="sm" variant="outline">
        Sign in
      </Button>
      <Button
        render={<Link href="/auth/sign-up" />}
        nativeButton={false}
        size="sm"
        variant="default"
      >
        Sign up
      </Button>
    </div>
  );
}
