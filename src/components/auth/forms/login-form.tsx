import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link, { useRouter } from "@/lib/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const loginSchema = z.object({
  email: z
    .string()
    .min(1, m.copy_email_is_required())
    .email(m.copy_please_enter_a_valid_email_address()),
  password: z
    .string()
    .min(1, m.copy_password_is_required())
    .min(6, m.copy_password_must_be_at_least_6_characters()),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/protected",
      });
      if (result.error) throw new Error(result.error.message);
      router.push("/protected");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : m.copy_an_error_occurred());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/protected",
      });

      if (result.error) throw new Error(result.error.message);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : m.copy_an_error_occurred());
      setIsLoading(false);
    }
  };

  return (
    <div {...sx(cn("flex flex-col gap-6", className))} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{m.copy_login()}</CardTitle>
          <CardDescription>
            {m.copy_enter_your_email_below_to_login_to_your_account()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} {...sx("space-y-6")}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{m.copy_email()}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={m.copy_m_example_com()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div {...sx("flex items-center")}>
                      <FormLabel>{m.copy_password()}</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        {...sx("ml-auto inline-block text-sm underline-offset-4 hover:underline")}
                      >
                        {m.copy_forgot_your_password()}
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p {...sx("text-sm text-red-500")}>{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? m.copy_logging_in() : m.copy_login()}
              </Button>
            </form>
          </Form>
          <div {...sx("mt-4")}>
            <div {...sx("relative")}>
              <div {...sx("absolute inset-0 flex items-center")}>
                <span {...sx("w-full border-t")} />
              </div>
              <div {...sx("relative flex justify-center text-xs uppercase")}>
                <span {...sx("bg-background px-2 text-muted-foreground")}>
                  {m.copy_or_continue_with()}
                </span>
              </div>
            </div>
            <div {...sx("grid grid-cols-2 gap-4")}>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
                type="button"
              >
                <svg
                  {...sx("mr-2 h-4 w-4")}
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="github"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                >
                  <path
                    fill="currentColor"
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                  ></path>
                </svg>{" "}
                {m.copy_github()}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                type="button"
              >
                <svg {...sx("mr-2 h-4 w-4")} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />

                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />

                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />

                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>{" "}
                {m.copy_google()}
              </Button>
            </div>
          </div>
          <div {...sx("mt-4 text-center text-sm")}>
            {m.copy_don_t_have_an_account()}{" "}
            <Link href="/auth/sign-up" {...sx("underline underline-offset-4")}>
              {m.copy_sign_up()}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
