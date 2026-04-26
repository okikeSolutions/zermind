"use client";

import Link from "next/link";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Button } from "../ui/button";
import { LogoutButton } from "./logout-button";
import { useAuthUser } from "@/hooks/use-auth";

function SignedInAuthButton() {
  const { user } = useAuthUser();

  return (
    <div className="flex items-center gap-4">
      {user?.email ? `Hey, ${user.email}!` : "Signed in"}
      <LogoutButton />
    </div>
  );
}

export function AuthButton() {
  return (
    <>
      <Authenticated>
        <SignedInAuthButton />
      </Authenticated>
      <Unauthenticated>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <Button size="sm" variant="outline" disabled>
          Loading...
        </Button>
      </AuthLoading>
    </>
  );
}
