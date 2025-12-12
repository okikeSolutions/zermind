"use client";

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
import {
  Key,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
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

const providers = [
  "openrouter",
  "openai",
  "anthropic",
  "meta",
  "google",
] as const;

const addApiKeySchema = z.object({
  provider: z.enum(providers, {
    message: "Please select a provider",
  }),
  keyName: z
    .string()
    .min(1, "Key name is required")
    .min(3, "Key name must be at least 3 characters")
    .max(50, "Key name must be less than 50 characters"),
  apiKey: z
    .string()
    .min(1, "API key is required")
    .min(10, "API key seems too short"),
});

type AddApiKeyFormData = z.infer<typeof addApiKeySchema>;

interface ApiKeyManagementProps {
  className?: string;
}

export function ApiKeyManagement({ className }: ApiKeyManagementProps) {
  // React Query hooks
  const {
    data: apiKeys = [],
    isLoading: loading,
    error: queryError,
  } = useApiKeys();
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
      setSuccess("API key added successfully");
      setIsAddDialogOpen(false);
      form.reset();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to add API key"
      );
    }
  };

  const handleToggleActive = async (keyId: string, isActive: boolean) => {
    try {
      await updateApiKeyMutation.mutateAsync({ keyId, data: { isActive } });
      setSuccess(
        `API key ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update API key"
      );
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteApiKeyMutation.mutateAsync(keyId);
      setSuccess("API key deleted successfully");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to delete API key"
      );
    }
  };

  const providers: { value: Provider; label: string; description: string }[] = [
    {
      value: "openrouter",
      label: "OpenRouter",
      description: "Access to multiple AI models",
    },
    { value: "openai", label: "OpenAI", description: "GPT models" },
    { value: "anthropic", label: "Anthropic", description: "Claude models" },
    { value: "meta", label: "Meta", description: "Llama models" },
    { value: "google", label: "Google", description: "Gemini models" },
  ];

  return (
    <div className={className}>
      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-3 sm:mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-3 sm:mb-4 border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{success}</AlertDescription>
        </Alert>
      )}

      {formError && (
        <Alert variant="destructive" className="mb-3 sm:mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{formError}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-medium">API Keys</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your API keys for different AI providers
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Add New API Key
              </DialogTitle>
              <DialogDescription className="text-sm">
                Add an API key to use your own credits with AI providers. Your
                key will be encrypted and stored securely.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddApiKey)}
                className="space-y-3 sm:space-y-4"
              >
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Provider</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem
                              key={provider.value}
                              value={provider.value}
                            >
                              <div>
                                <div className="font-medium text-sm">
                                  {provider.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {provider.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
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
                      <FormLabel className="text-sm">Key Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., My OpenRouter Key"
                          {...field}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        A descriptive name to identify this API key
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
                      <FormLabel className="text-sm">API Key</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            placeholder="Enter your API key"
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
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Your API key will be encrypted and stored securely
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
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createApiKeyMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {createApiKeyMutation.isPending
                      ? "Adding..."
                      : "Add API Key"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <Key className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              No API Keys
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-4">
              Add your API keys to use your own credits with AI providers
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-medium text-sm sm:text-base truncate">
                        {apiKey.keyName}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <Badge
                          variant={
                            apiKey.provider === "openrouter"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {providers.find((p) => p.value === apiKey.provider)
                            ?.label || apiKey.provider}
                        </Badge>
                        <Badge
                          variant={apiKey.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {apiKey.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-0.5">
                      <p className="break-all">Key: {apiKey.keyPreview}</p>
                      <p>
                        Added: {new Date(apiKey.createdAt).toLocaleDateString()}
                      </p>
                      {apiKey.lastUsedAt && (
                        <p>
                          Last used:{" "}
                          {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </span>
                      <Switch
                        checked={apiKey.isActive}
                        onCheckedChange={(checked) =>
                          handleToggleActive(apiKey.id, checked)
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="h-9 w-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
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
