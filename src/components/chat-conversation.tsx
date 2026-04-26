"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Copy,
  Check,
  MessageSquare,
  StopCircle,
  AlertCircle,
  Upload,
  X,
  Paperclip,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type Message, type Attachment } from "@/lib/schemas/chat";
import { useChat } from "@/hooks/use-chat";
import { ModelSelector } from "@/components/model-selector";
import { useUpdateChatTitle } from "@/hooks/use-chats-query";
import { generateChatTitle, shouldUpdateChatTitle } from "@/lib/utils/chat-utils";
import { MessageAttachment } from "@/components/message-attachment";
import { useFileAttachments } from "@/hooks/use-file-attachments";
import { formatBytes } from "@/components/dropzone";
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

interface ChatConversationProps {
  chatId: string;
  initialMessages: Message[];
  userId: string;
  chatTitle?: string;
  model?: string;
  isSharedView?: boolean;
  isDemo?: boolean;
  onSendMessage?: () => boolean | void;
}

export function ChatConversation({
  chatId,
  initialMessages,
  userId, // eslint-disable-line @typescript-eslint/no-unused-vars
  chatTitle,
  model: initialModel = "openai/gpt-4o-mini",
  isSharedView = false,
  isDemo = false,
  onSendMessage,
}: ChatConversationProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File attachments hook
  const fileAttachments = useFileAttachments({ model: selectedModel });

  const updateChatTitleMutation = useUpdateChatTitle();

  // Message form setup
  const messageForm = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const { messages, isLoading, error, stop, sendMessage } = useChat({
    chatId,
    initialMessages,
    model: selectedModel,
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Sort messages chronologically (oldest first) to ensure correct display order
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // File selection handlers
  const handleFileSelect = useCallback(
    (type: "image" | "document") => {
      if (!fileInputRef.current) return;

      if (type === "image") {
        fileInputRef.current.accept = fileAttachments.allowedMimeTypes
          .filter((mime) => mime.startsWith("image/"))
          .join(",");
      } else {
        fileInputRef.current.accept = fileAttachments.allowedMimeTypes
          .filter((mime) => !mime.startsWith("image/"))
          .join(",");
      }

      fileInputRef.current.click();
    },
    [fileAttachments.allowedMimeTypes],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        fileAttachments.addFiles(files);
      }
      // Reset input
      e.target.value = "";
    },
    [fileAttachments],
  );

  const handleSendMessage = async (data: MessageFormData) => {
    if (!data.message.trim() || isLoading) return;

    // Call onSendMessage hook if provided (for demo limits, etc.)
    // Only prevent sending if it explicitly returns false
    if (onSendMessage && onSendMessage() === false) return;

    try {
      const userMessage = data.message.trim();

      // Check if this is the first user message and title should be updated
      const isFirstMessage =
        messages.length === 0 || messages.every((msg) => msg.role === "assistant");

      const shouldUpdateTitle = isFirstMessage && shouldUpdateChatTitle(chatTitle || null);

      let processedAttachments: Attachment[] = [];
      if (!isDemo && fileAttachments.pendingFiles.length > 0) {
        try {
          processedAttachments = await fileAttachments.processFilesDirectly();
        } catch (error) {
          console.error("Failed to process files:", error);
          throw new Error("Failed to process attachments. Please try again.");
        }
      }

      messageForm.reset();
      try {
        await sendMessage(userMessage, processedAttachments);
      } catch (error) {
        console.error("Failed to send message to AI:", error);
        throw new Error("Failed to get AI response. Please try again.");
      }

      // Update chat title if this is the first user message (skip in demo mode)
      if (!isDemo && shouldUpdateTitle) {
        try {
          const newTitle = generateChatTitle(userMessage);
          await updateChatTitleMutation.mutateAsync({
            chatId,
            data: { title: newTitle },
          });
        } catch (error) {
          console.error("Failed to update chat title:", error);
          // Don't block the conversation if title update fails
        }
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      // The error will be displayed in the UI through the error state
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatTime = (createdAt: Date) => {
    try {
      // Use a more deterministic approach to avoid hydration mismatches
      const hours = createdAt.getHours().toString().padStart(2, "0");
      const minutes = createdAt.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Failed to format time:", error);
      return "Invalid time";
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col h-full relative"
      onDragEnter={
        fileAttachments.supportsAttachments ? fileAttachments.handleDragEnter : undefined
      }
      onDragLeave={
        fileAttachments.supportsAttachments ? fileAttachments.handleDragLeave : undefined
      }
      onDragOver={fileAttachments.supportsAttachments ? fileAttachments.handleDragOver : undefined}
      onDrop={fileAttachments.supportsAttachments ? fileAttachments.handleDrop : undefined}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Drag Drop Dialog */}
      <Dialog
        open={fileAttachments.isDragOver && fileAttachments.supportsAttachments}
        onOpenChange={() => {}} // Prevent manual closing, only close on drag leave
      >
        <DialogContent
          className="pointer-events-none border-2 border-dashed border-primary bg-primary/10 backdrop-blur-sm"
          showCloseButton={false}
        >
          <div className="text-center space-y-4">
            <Upload className="h-12 w-12 text-primary mx-auto" />
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Drop files here</DialogTitle>
              <DialogDescription className="text-sm">
                {fileAttachments.modelCapabilities.supportsImages &&
                fileAttachments.modelCapabilities.supportsDocuments
                  ? "Upload images and PDFs to enhance your conversation"
                  : fileAttachments.modelCapabilities.supportsImages
                    ? "Upload images to enhance your conversation"
                    : "Upload documents to enhance your conversation"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              {fileAttachments.modelCapabilities.supportsImages && (
                <span>
                  Images: up to{" "}
                  {formatBytes(fileAttachments.modelCapabilities.maxImageSize! * 1024 * 1024)}
                </span>
              )}
              {fileAttachments.modelCapabilities.supportsDocuments && (
                <span>
                  PDFs: up to{" "}
                  {formatBytes(fileAttachments.modelCapabilities.maxDocumentSize! * 1024 * 1024)}
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {/* Error Display */}
        {error && (
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Card className="border-destructive bg-destructive/10 max-w-sm sm:max-w-md mx-2">
              <CardContent className="p-2 sm:p-3">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-xs sm:text-sm">Error occurred</p>
                    <p className="text-xs mt-1">{error.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 sm:space-y-4 px-4">
            <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <div>
              <h3 className="text-base sm:text-lg font-medium">Start the conversation</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Send a message to begin chatting with AI
              </p>
              <p className="text-xs text-muted-foreground mt-2">Using: {selectedModel}</p>
            </div>
          </div>
        ) : (
          <>
            {sortedMessages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <Card
                  className={cn(
                    "max-w-[85%] sm:max-w-[80%] md:max-w-[70%]",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-start space-x-1.5 sm:space-x-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {message.role === "user" ? (
                          <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="whitespace-pre-wrap break-words text-xs sm:text-sm">
                          {message.content}
                        </div>
                        <MessageAttachment attachments={message.attachments || []} />
                        <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              message.role === "user"
                                ? "border-primary-foreground/20 text-primary-foreground/70"
                                : "border-muted-foreground/20 text-muted-foreground",
                            )}
                          >
                            {formatTime(message.createdAt)}
                          </Badge>
                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-background/20"
                              onClick={() => copyToClipboard(message.content, message.id)}
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-muted max-w-[85%] sm:max-w-[80%] md:max-w-[70%]">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Hidden in shared view */}
      {!isSharedView && (
        <div className="border-t p-2 sm:p-4 bg-background/50 backdrop-blur space-y-2 sm:space-y-3">
          {/* Model Selector and BYOK Status */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading}
              className="w-full sm:max-w-xs"
            />

            {/* Attachment Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    {fileAttachments.supportsAttachments ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={isLoading}
                            className="w-full sm:w-auto h-9 sm:h-10"
                          >
                            <Paperclip className="h-4 w-4 mr-2" />
                            <span className="text-sm">Attach</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuLabel className="text-sm">Attach Files</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {fileAttachments.modelCapabilities.supportsImages && (
                            <DropdownMenuItem
                              onClick={() => handleFileSelect("image")}
                              className="text-sm"
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Upload Images
                              <span className="ml-auto text-xs text-muted-foreground">
                                up to{" "}
                                {Math.round(fileAttachments.modelCapabilities.maxImageSize! || 5)}
                                MB
                              </span>
                            </DropdownMenuItem>
                          )}
                          {fileAttachments.modelCapabilities.supportsDocuments && (
                            <DropdownMenuItem
                              onClick={() => handleFileSelect("document")}
                              className="text-sm"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Upload PDFs
                              <span className="ml-auto text-xs text-muted-foreground">
                                up to{" "}
                                {Math.round(
                                  fileAttachments.modelCapabilities.maxDocumentSize! || 5,
                                )}
                                MB
                              </span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="outline"
                        disabled={true}
                        className="w-full sm:w-auto h-9 sm:h-10 opacity-50 cursor-not-allowed"
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        <span className="text-sm">Attach</span>
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {fileAttachments.supportsAttachments
                    ? "Upload files to enhance your conversation"
                    : `${
                        selectedModel.split("/").pop() || selectedModel
                      } does not support file attachments`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Pending Files */}
          {fileAttachments.pendingFiles.length > 0 && (
            <div className="space-y-2">
              {fileAttachments.pendingFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-muted/50 rounded-lg p-2"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="h-4 w-4 flex-shrink-0">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium truncate">{file.name}</span>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {formatBytes(file.size)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileAttachments.removeFile(file.id)}
                    disabled={isLoading || fileAttachments.isUploading}
                    className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Input Form */}
          <Form {...messageForm}>
            <form onSubmit={messageForm.handleSubmit(handleSendMessage)} className="flex space-x-2">
              <FormField
                control={messageForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="h-9 sm:h-10 text-sm"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            messageForm.handleSubmit(handleSendMessage)();
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
                  className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!messageForm.watch("message")?.trim()}
                  size="icon"
                  className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </form>
          </Form>
          <p className="text-xs text-muted-foreground text-center px-2">
            Press Enter to send, Shift + Enter for new line
            {fileAttachments.supportsAttachments && fileAttachments.pendingFiles.length === 0 && (
              <span className="block mt-1">
                💡 Drag and drop{" "}
                {fileAttachments.modelCapabilities.supportsImages &&
                fileAttachments.modelCapabilities.supportsDocuments
                  ? "images or PDFs"
                  : fileAttachments.modelCapabilities.supportsImages
                    ? "images"
                    : "PDFs"}{" "}
                anywhere to attach
              </span>
            )}
            {!fileAttachments.supportsAttachments && (
              <span className="block mt-1 text-muted-foreground/60">
                ℹ️ Current model does not support file attachments
              </span>
            )}
          </p>
        </div>
      )}

      {/* Read-only footer for shared view */}
      {isSharedView && (
        <div className="border-t p-2 sm:p-4 bg-background/50 backdrop-blur">
          <p className="text-xs text-muted-foreground text-center">
            This is a shared chat conversation in read-only mode
          </p>
        </div>
      )}
    </div>
  );
}
