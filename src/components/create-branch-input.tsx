"use client";

import React, { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  StopCircle,
  AlertCircle,
  User,
  Bot,
  GitBranch,
} from "lucide-react";
import { useBranchingChat } from "@/hooks/use-branching-chat";
import { useConversationContext } from "@/hooks/use-conversation-context";
import { ModelSelector } from "@/components/model-selector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Message } from "@/lib/schemas/chat";

const branchFormSchema = z.object({
  branchName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: "Branch name must be at least 3 characters if provided",
    })
    .refine((val) => !val || val.length <= 100, {
      message: "Branch name must be less than 100 characters",
    }),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message is too long (max 4000 characters)")
    .trim(),
});

type BranchFormData = z.infer<typeof branchFormSchema>;

interface CreateBranchInputProps {
  chatId: string;
  parentNodeId: string;
  onClose: () => void;
  onBranchCreated?: () => void;
}

interface BranchingFormProps {
  chatId: string;
  parentNodeId: string;
  context: Message[];
  onClose: () => void;
  onBranchCreated?: () => void;
}

function BranchingForm({
  chatId,
  parentNodeId,
  context,
  onClose,
  onBranchCreated,
}: BranchingFormProps) {
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4o-mini");

  // Form setup
  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      branchName: "",
      message: "",
    },
  });

  // Now initialize useBranchingChat with the loaded context
  const { messages, isLoading, error, sendMessage, stop } = useBranchingChat({
    chatId,
    parentNodeId,
    initialContext: context,
    model: selectedModel,
    branchName: form.watch("branchName")?.trim() || undefined,
    onFinish: () => {
      onBranchCreated?.();
    },
  });

  const handleBranchSubmit = async (data: BranchFormData) => {
    if (!data.message.trim() || isLoading) return;

    try {
      await sendMessage(data.message.trim());

      // Reset form after submission
      form.reset();
    } catch (error) {
      console.error("Error submitting branch:", error);
    }
  };

  return (
    <Card className="border-t bg-background">
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-orange-500" />
            <h4 className="text-sm font-medium">Create New Branch</h4>
          </div>
          <Badge variant="outline" className="text-xs w-fit">
            From node: {parentNodeId.slice(0, 8)}...
          </Badge>
        </div>

        {/* Context Preview */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
            <label className="text-xs text-muted-foreground">
              Branching from:
            </label>
            <Badge variant="outline" className="text-xs w-fit">
              {context.length} message{context.length !== 1 ? "s" : ""} in
              context
            </Badge>
          </div>

          {context.length > 0 && (
            <div className="bg-muted rounded-md p-2 sm:p-3 max-h-20 sm:max-h-24 overflow-y-auto">
              <div className="text-xs text-muted-foreground space-y-1">
                {context.slice(-1).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    {msg.role === "user" ? (
                      <User className="h-3 w-3 mt-0.5 shrink-0" />
                    ) : (
                      <Bot className="h-3 w-3 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs leading-relaxed">
                      {msg.content.length > 60
                        ? msg.content.substring(0, 60) + "..."
                        : msg.content}
                    </span>
                  </div>
                ))}
                {context.length > 1 && (
                  <div className="text-center text-xs text-muted-foreground/70 pt-1">
                    ... and {context.length - 1} more message
                    {context.length - 1 !== 1 ? "s" : ""} before this
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Branch Messages */}
        {messages.length > context.length && (
          <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
            <label className="text-xs text-muted-foreground">
              New branch messages:
            </label>
            {messages.slice(context.length).map((message) => {
              const msg = message as unknown as { content?: string };
              const messageContent =
                typeof msg.content === "string"
                  ? msg.content
                  : String(msg.content || "");
              return (
                <Card
                  key={message.id}
                  className={`${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <CardContent className="p-2">
                    <div className="flex items-start space-x-2">
                      <div className="shrink-0 mt-0.5">
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-words">
                        {messageContent}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-start space-x-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{error.message}</span>
          </div>
        )}

        {/* Branch Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleBranchSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Alternative approach, Different perspective..."
                      disabled={isLoading}
                      className="min-h-[44px] sm:min-h-auto text-base sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs leading-relaxed">
                    Give this branch a descriptive name to identify it later
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="w-full sm:w-auto">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isLoading}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="min-h-[36px] sm:min-h-auto w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Input
                        placeholder="Start the new branch with a different question or approach..."
                        disabled={isLoading}
                        className="flex-1 min-h-[44px] sm:min-h-auto text-base sm:text-sm"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(handleBranchSubmit)();
                          }
                        }}
                      />
                      {isLoading ? (
                        <Button
                          type="button"
                          onClick={stop}
                          size="icon"
                          variant="destructive"
                          className="shrink-0 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto"
                        >
                          <StopCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={!form.watch("message")?.trim()}
                          size="icon"
                          className="shrink-0 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
              Create a new conversation path from this point • Press Enter to
              send
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function CreateBranchInput({
  chatId,
  parentNodeId,
  onClose,
  onBranchCreated,
}: CreateBranchInputProps) {
  // Fetch conversation context
  const {
    data: context = [],
    isLoading: isLoadingContext,
    error: contextError,
  } = useConversationContext(chatId, parentNodeId);

  // Early returns for loading and error states
  if (isLoadingContext) {
    return (
      <Card className="border-t bg-background">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <span className="text-sm text-muted-foreground ml-2">
              Loading conversation context...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contextError) {
    return (
      <Card className="border-t bg-background border-destructive">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-destructive">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{contextError.message}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="min-h-[36px] sm:min-h-auto"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render the branching form only when context is loaded
  return (
    <BranchingForm
      chatId={chatId}
      parentNodeId={parentNodeId}
      context={context}
      onClose={onClose}
      onBranchCreated={onBranchCreated}
    />
  );
}
