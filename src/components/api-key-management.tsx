import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Plus, Trash2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { type Provider } from "@/lib/schemas/api-keys";
import {
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
} from "@/hooks/use-api-keys";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const providers = ["openrouter", "openai", "anthropic", "meta", "google"] as const;

const addApiKeySchema = z.object({
  provider: z.enum(providers, {
    message: m.copy_please_select_a_provider(),
  }),
  keyName: z
    .string()
    .min(1, m.copy_key_name_is_required())
    .min(3, m.copy_key_name_must_be_at_least_3_characters())
    .max(50, m.copy_key_name_must_be_less_than_50_characters()),
  apiKey: z.string().min(1, m.copy_api_key_is_required()).min(10, m.copy_api_key_seems_too_short()),
});

type AddApiKeyFormData = z.infer<typeof addApiKeySchema>;

interface ApiKeyManagementProps {
  className?: string;
}

export function ApiKeyManagement({ className }: ApiKeyManagementProps) {
  // React Query hooks
  const { data: apiKeys = [], isLoading: loading, error: queryError } = useApiKeys();
  const createApiKeyMutation = useCreateApiKey();
  const updateApiKeyMutation = useUpdateApiKey();
  const deleteApiKeyMutation = useDeleteApiKey();

  // UI state
  const [success, setSuccess] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Derived state
  const error = queryError?.message || null;

  // Form setup
  const form = useForm<AddApiKeyFormData>({
    resolver: zodResolver(addApiKeySchema),
    defaultValues: {
      provider: "openrouter",
      apiKey: "",
      keyName: "",
    },
  });

  const handleAddApiKey = async (data: AddApiKeyFormData) => {
    setFormError(null);

    try {
      await createApiKeyMutation.mutateAsync(data);
      setSuccess(m.copy_api_key_added_successfully());
      setIsAddDialogOpen(false);
      form.reset();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : m.copy_failed_to_add_api_key());
    }
  };

  const handleToggleActive = async (keyId: string, isActive: boolean) => {
    try {
      await updateApiKeyMutation.mutateAsync({ keyId, data: { isActive } });
      setSuccess(
        isActive
          ? m.copy_api_key_activated_successfully()
          : m.copy_api_key_deactivated_successfully(),
      );
    } catch (err) {
      setFormError(err instanceof Error ? err.message : m.copy_failed_to_update_api_key());
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!confirm(m.copy_are_you_sure_you_want_to_delete_this_api_key_this_action_cannot())) {
      return;
    }

    try {
      await deleteApiKeyMutation.mutateAsync(keyId);
      setSuccess(m.copy_api_key_deleted_successfully());
    } catch (err) {
      setFormError(err instanceof Error ? err.message : m.copy_failed_to_delete_api_key());
    }
  };

  const providers: { value: Provider; label: string; description: string }[] = [
    {
      value: "openrouter",
      label: m.copy_openrouter(),
      description: m.copy_access_to_multiple_ai_models(),
    },
    { value: "openai", label: m.copy_openai(), description: m.copy_gpt_models() },
    { value: "anthropic", label: m.copy_anthropic(), description: m.copy_claude_models() },
    { value: "meta", label: m.copy_meta(), description: m.copy_llama_models() },
    { value: "google", label: m.copy_google(), description: m.copy_gemini_models() },
  ];

  return (
    <div {...sx(className)}>
      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-3 sm:mb-4">
          <AlertCircle {...sx("h-4 w-4")} />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-3 sm:mb-4 border-green-200 bg-green-50 text-green-800">
          <CheckCircle {...sx("h-4 w-4")} />
          <AlertDescription className="text-sm">{success}</AlertDescription>
        </Alert>
      )}

      {formError && (
        <Alert variant="destructive" className="mb-3 sm:mb-4">
          <AlertCircle {...sx("h-4 w-4")} />
          <AlertDescription className="text-sm">{formError}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div
        {...sx(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4",
        )}
      >
        <div {...sx("space-y-1")}>
          <h3 {...sx("text-base sm:text-lg font-medium")}>{m.copy_api_keys()}</h3>
          <p {...sx("text-xs sm:text-sm text-muted-foreground")}>
            {m.copy_manage_your_api_keys_for_different_ai_providers()}
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="w-full sm:w-auto" />}>
            <Plus {...sx("h-4 w-4 mr-2")} /> {m.copy_add_api_key()}
          </DialogTrigger>
          <DialogContent className="mx-4 max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{m.copy_add_new_api_key()}</DialogTitle>
              <DialogDescription className="text-sm">
                {m.copy_add_an_api_key_to_use_your_own_credits_with_ai_providers_your_ke()}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddApiKey)} {...sx("space-y-3 sm:space-y-4")}>
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">{m.copy_provider()}</FormLabel>
                      <Select
                        items={providers}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {providers.map((provider) => (
                              <SelectItem key={provider.value} value={provider.value}>
                                <div>
                                  <div {...sx("font-medium text-sm")}>{provider.label}</div>
                                  <div {...sx("text-xs text-muted-foreground")}>
                                    {provider.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">{m.copy_key_name()}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={m.copy_e_g_my_openrouter_key()}
                          {...field}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {m.copy_a_descriptive_name_to_identify_this_api_key()}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">{m.copy_api_key()}</FormLabel>
                      <FormControl>
                        <div {...sx("relative")}>
                          <Input
                            type={showApiKey ? "text" : "password"}
                            placeholder={m.copy_enter_your_api_key()}
                            {...field}
                            className="text-sm pr-10"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? (
                              <EyeOff {...sx("h-4 w-4")} />
                            ) : (
                              <Eye {...sx("h-4 w-4")} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        {m.copy_your_api_key_will_be_encrypted_and_stored_securely()}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      form.reset();
                    }}
                    disabled={createApiKeyMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {m.copy_cancel()}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createApiKeyMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {createApiKeyMutation.isPending ? m.copy_adding() : m.copy_add_api_key()}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      {loading ? (
        <div {...sx("space-y-3")}>
          {[1, 2, 3].map((i) => (
            <div key={i} {...sx("h-16 bg-muted rounded-md animate-pulse")} />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <Key {...sx("h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4")} />
            <h3 {...sx("font-medium mb-1 sm:mb-2 text-sm sm:text-base")}>{m.copy_no_api_keys()}</h3>
            <p {...sx("text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-4")}>
              {m.copy_add_your_api_keys_to_use_your_own_credits_with_ai_providers()}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
              <Plus {...sx("h-4 w-4 mr-2")} /> {m.copy_add_your_first_api_key()}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div {...sx("space-y-2 sm:space-y-3")}>
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="p-3 sm:p-4">
                <div
                  {...sx(
                    "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4",
                  )}
                >
                  <div {...sx("flex-1 min-w-0")}>
                    <div {...sx("flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2")}>
                      <h4 {...sx("font-medium text-sm sm:text-base truncate")}>{apiKey.keyName}</h4>
                      <div {...sx("flex flex-wrap gap-1.5 sm:gap-2")}>
                        <Badge
                          variant={apiKey.provider === "openrouter" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {providers.find((p) => p.value === apiKey.provider)?.label ||
                            apiKey.provider}
                        </Badge>
                        <Badge
                          variant={apiKey.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {apiKey.isActive ? m.copy_active() : m.copy_inactive()}
                        </Badge>
                      </div>
                    </div>
                    <div {...sx("text-xs sm:text-sm text-muted-foreground space-y-0.5")}>
                      <p {...sx("break-all")}>
                        {m.copy_key()} {apiKey.keyPreview}
                      </p>
                      <p>
                        {m.copy_added()} {new Date(apiKey.createdAt).toLocaleDateString()}
                      </p>
                      {apiKey.lastUsedAt && (
                        <p>
                          {m.copy_last_used()} {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div {...sx("flex items-center justify-between sm:justify-end gap-3 sm:gap-2")}>
                    <div {...sx("flex items-center gap-2")}>
                      <span {...sx("text-xs sm:text-sm text-muted-foreground")}>
                        {apiKey.isActive ? m.copy_active() : m.copy_inactive()}
                      </span>
                      <Switch
                        checked={apiKey.isActive}
                        onCheckedChange={(checked) => handleToggleActive(apiKey.id, checked)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="h-9 w-9 p-0"
                    >
                      <Trash2 {...sx("h-4 w-4")} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
