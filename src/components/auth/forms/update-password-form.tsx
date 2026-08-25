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
import { useRouter, useSearchParams } from "@/lib/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(1, m.copy_password_is_required())
    .min(6, m.copy_password_must_be_at_least_6_characters()),
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = searchParams.get("token") ?? undefined;
      const result = await authClient.resetPassword({
        newPassword: data.password,
        token,
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
          <CardTitle className="text-2xl">{m.copy_reset_your_password()}</CardTitle>
          <CardDescription>{m.copy_please_enter_your_new_password_below()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePassword)} {...sx("space-y-6")}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{m.copy_new_password()}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={m.copy_new_password()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p {...sx("text-sm text-red-500")}>{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? m.copy_saving() : m.copy_save_new_password()}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
