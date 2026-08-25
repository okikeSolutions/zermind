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
const signUpSchema = z
  .object({
    email: z.email().min(1, m.copy_email_is_required()),
    password: z
      .string()
      .min(1, m.copy_password_is_required())
      .min(6, m.copy_password_must_be_at_least_6_characters()),
    repeatPassword: z.string().min(1, m.copy_please_confirm_your_password()),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: m.copy_passwords_do_not_match(),
    path: ["repeatPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.email,
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

  return (
    <div {...sx(cn("flex flex-col gap-6", className))} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{m.copy_sign_up()}</CardTitle>
          <CardDescription>{m.copy_create_a_new_account()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} {...sx("space-y-6")}>
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
                    <FormLabel>{m.copy_password()}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{m.copy_repeat_password()}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p {...sx("text-sm text-red-500")}>{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? m.copy_creating_an_account() : m.copy_sign_up()}
              </Button>
            </form>
          </Form>
          <div {...sx("mt-4 text-center text-sm")}>
            {m.copy_already_have_an_account()}{" "}
            <Link href="/auth/login" {...sx("underline underline-offset-4")}>
              {m.copy_login()}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
