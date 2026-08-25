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
import Link from "@/lib/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, m.copy_email_is_required())
    .email(m.copy_please_enter_a_valid_email_address()),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (result.error) throw new Error(result.error.message);
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : m.copy_an_error_occurred());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div {...sx(cn("flex flex-col gap-6", className))} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{m.copy_check_your_email()}</CardTitle>
            <CardDescription>{m.copy_password_reset_instructions_sent()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p {...sx("text-sm text-muted-foreground")}>
              {m.copy_if_you_registered_using_your_email_and_password_you_will_receive()}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{m.copy_reset_your_password()}</CardTitle>
            <CardDescription>
              {m.copy_type_in_your_email_and_we_ll_send_you_a_link_to_reset_your_passw()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleForgotPassword)} {...sx("space-y-6")}>
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

                {error && <p {...sx("text-sm text-red-500")}>{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? m.copy_sending() : m.copy_send_reset_email()}
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
      )}
    </div>
  );
}
