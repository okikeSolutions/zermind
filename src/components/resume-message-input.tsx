"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, StopCircle, AlertCircle, User, Bot } from "lucide-react";
import { useBranchingChat } from "@/hooks/use-branching-chat";
import { useConversationContext } from "@/hooks/use-conversation-context";
import { ModelSelector } from "@/components/model-selector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const messageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message is too long (max 4000 characters)")
    .trim(),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface ResumeMessageInputProps {
  chatId: string;
  parentNodeId: string;
  onClose: () => void;
  onMessageSent?: () => void;
}

export function ResumeMessageInput({
  chatId,
  parentNodeId,
  onClose,
  onMessageSent,
}: ResumeMessageInputProps) {
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4o-mini");

  // Form setup
  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  // Fetch conversation context
  const {
    data: context = [],
    isLoading: isLoadingContext,
    error: contextError,
  } = useConversationContext(chatId, parentNodeId);

  const { messages, isLoading, error, sendMessage, stop } = useBranchingChat({
    chatId,
    parentNodeId,
    initialContext: context,
    model: selectedModel,
    onFinish: () => {
      onMessageSent?.();
    },
  });

  const handleMessageSubmit = async (data: MessageFormData) => {
    if (!data.message.trim() || isLoading) return;

    try {
      await sendMessage(data.message.trim());

      // Reset form after submission
      form.reset();
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

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
            <Button size="sm" variant="outline" onClick={onClose} className="min-h-[36px] sm:min-h-auto">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t bg-background">
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Context Preview */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
            <h4 className="text-sm font-medium">Resuming from:</h4>
            <Badge variant="outline" className="text-xs w-fit">
              {context.length} message{context.length !== 1 ? "s" : ""} in
              context
            </Badge>
          </div>

          {context.length > 0 && (
            <div className="bg-muted rounded-md p-2 sm:p-3 max-h-24 sm:max-h-32 overflow-y-auto">
              <div className="text-xs text-muted-foreground space-y-1">
                {context.slice(-2).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    {msg.role === "user" ? (
                      <User className="h-3 w-3 mt-0.5 shrink-0" />
                    ) : (
                      <Bot className="h-3 w-3 mt-0.5 shrink-0" />
                    )}
                    <span className="text-xs leading-relaxed">
                      {msg.content.length > 50
                        ? msg.content.substring(0, 50) + "..."
                        : msg.content}
                    </span>
                  </div>
                ))}
                {context.length > 2 && (
                  <div className="text-center text-xs text-muted-foreground/70 pt-1">
                    ... and {context.length - 2} more message
                    {context.length - 2 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recent Messages from Branch */}
        {messages.length > context.length && (
          <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
            {messages.slice(context.length).map((message) => {
              const msg = message as unknown as { content?: string };
              const messageContent =
                typeof msg.content === "string" ? msg.content : String(msg.content || "");
              return (
                <Card
                  key={message.id}
                  className={`${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-4 sm:ml-8"
                      : "bg-muted mr-4 sm:mr-8"
                  }`}
                >
                  <CardContent className="p-2 sm:p-2">
                    <div className="flex items-start space-x-2">
                      <div className="shrink-0 mt-0.5">
                        {message.role === "user" ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
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

        {/* Input Controls */}
        <div className="space-y-3">
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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleMessageSubmit)}
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Continue the conversation..."
                        disabled={isLoading}
                        className="min-h-[44px] sm:min-h-auto text-base sm:text-sm"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(handleMessageSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
            </form>
          </Form>

          <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
            Your message will branch from the selected node • Press Enter to
            send
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
