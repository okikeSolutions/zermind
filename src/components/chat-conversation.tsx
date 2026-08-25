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
  DropdownMenuGroup,
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
import { cn, formatBytes } from "@/lib/utils";
import { type Message, type Attachment } from "@/lib/schemas/chat";
import { useChat } from "@/hooks/use-chat";
import { ModelSelector } from "@/components/model-selector";
import { useUpdateChatTitle } from "@/hooks/use-chats-query";
import { generateChatTitle, shouldUpdateChatTitle } from "@/lib/utils/chat-utils";
import { MessageAttachment } from "@/components/message-attachment";
import { Dropzone, DropzoneEmptyState } from "@/components/dropzone";
import { useFileAttachments } from "@/hooks/use-file-attachments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const messageSchema = z.object({
  message: z
    .string()
    .min(1, m.copy_message_cannot_be_empty())
    .max(4000, m.copy_message_is_too_long_max_4000_characters())
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
  model: initialModel = "openai/gpt-5-mini",
  isSharedView = false,
  isDemo = false,
  onSendMessage,
}: ChatConversationProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // File attachments hook
  const fileAttachments = useFileAttachments({ model: selectedModel, chatId });

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
  const sortedMessages = [...messages].sort((a, b) => {
    const createdAtDelta = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (createdAtDelta !== 0) return createdAtDelta;
    if (a.role !== b.role) return a.role === "user" ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = useCallback(
    (type: "image" | "document") => {
      const input = document.querySelector<HTMLInputElement>("[data-chat-file-input]");
      if (!input) return;

      input.accept = fileAttachments.allowedMimeTypes
        .filter((mime) =>
          type === "image" ? mime.startsWith("image/") : !mime.startsWith("image/"),
        )
        .join(",");
      input.click();
    },
    [fileAttachments.allowedMimeTypes],
  );

  const dropzoneFiles = fileAttachments.pendingFiles.map((file) => ({
    ...file,
    errors: [] as Array<{ code: string; message: string }>,
  }));

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
          processedAttachments = await fileAttachments.uploadFilesToStorage();
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
      return m.copy_invalid_time();
    }
  };

  return (
    <div
      ref={chatContainerRef}
      {...sx("flex flex-col h-full relative")}
      onDragEnter={
        fileAttachments.supportsAttachments ? fileAttachments.handleDragEnter : undefined
      }
      onDragLeave={
        fileAttachments.supportsAttachments ? fileAttachments.handleDragLeave : undefined
      }
      onDragOver={fileAttachments.supportsAttachments ? fileAttachments.handleDragOver : undefined}
      onDrop={fileAttachments.supportsAttachments ? fileAttachments.handleDrop : undefined}
    >
      {/* Drag Drop Dialog */}
      <Dialog
        open={fileAttachments.isDragOver && fileAttachments.supportsAttachments}
        onOpenChange={() => {}} // Prevent manual closing, only close on drag leave
      >
        <DialogContent
          className="pointer-events-none border-2 border-dashed border-primary bg-primary/10 backdrop-blur-sm"
          showCloseButton={false}
        >
          <div {...sx("text-center space-y-4")}>
            <Upload {...sx("h-12 w-12 text-primary mx-auto")} />
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {m.copy_drop_files_here()}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {fileAttachments.modelCapabilities.supportsImages &&
                fileAttachments.modelCapabilities.supportsDocuments
                  ? m.copy_upload_images_and_pdfs_to_enhance_your_conversation()
                  : fileAttachments.modelCapabilities.supportsImages
                    ? m.copy_upload_images_to_enhance_your_conversation()
                    : m.copy_upload_documents_to_enhance_your_conversation()}
              </DialogDescription>
            </DialogHeader>

            <div {...sx("flex justify-center space-x-4 text-xs text-muted-foreground")}>
              {fileAttachments.modelCapabilities.supportsImages && (
                <span>
                  {m.copy_images_up_to()}{" "}
                  {formatBytes(fileAttachments.modelCapabilities.maxImageSize! * 1024 * 1024)}
                </span>
              )}
              {fileAttachments.modelCapabilities.supportsDocuments && (
                <span>
                  {m.copy_pdfs_up_to()}{" "}
                  {formatBytes(fileAttachments.modelCapabilities.maxDocumentSize! * 1024 * 1024)}
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Messages Area */}
      <div {...sx("flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4")}>
        {/* Error Display */}
        {error && (
          <div {...sx("flex items-center justify-center mb-3 sm:mb-4")}>
            <Card className="border-destructive bg-destructive/10 max-w-sm sm:max-w-md mx-2">
              <CardContent className="p-2 sm:p-3">
                <div {...sx("flex items-center space-x-2 text-destructive")}>
                  <AlertCircle {...sx("h-4 w-4 flex-shrink-0")} />
                  <div {...sx("text-sm")}>
                    <p {...sx("font-medium text-xs sm:text-sm")}>{m.copy_error_occurred()}</p>
                    <p {...sx("text-xs mt-1")}>{error.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {messages.length === 0 ? (
          <div
            {...sx(
              "flex flex-col items-center justify-center h-full text-center space-y-3 sm:space-y-4 px-4",
            )}
          >
            <MessageSquare {...sx("h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground")} />
            <div>
              <h3 {...sx("text-base sm:text-lg font-medium")}>{m.copy_start_the_conversation()}</h3>
              <p {...sx("text-xs sm:text-sm text-muted-foreground")}>
                {m.copy_send_a_message_to_begin_chatting_with_ai()}
              </p>
              <p {...sx("text-xs text-muted-foreground mt-2")}>
                {m.copy_using()} {selectedModel}
              </p>
            </div>
          </div>
        ) : (
          <>
            {sortedMessages.map((message) => (
              <div
                key={message.id}
                {...sx(cn("flex", message.role === "user" ? "justify-end" : "justify-start"))}
              >
                <Card
                  className={cn(
                    "max-w-[85%] sm:max-w-[80%] md:max-w-[70%]",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <CardContent className="p-2 sm:p-3">
                    <div {...sx("flex items-start space-x-1.5 sm:space-x-2")}>
                      <div {...sx("flex-shrink-0 mt-0.5")}>
                        {message.role === "user" ? (
                          <User {...sx("h-3 w-3 sm:h-4 sm:w-4")} />
                        ) : (
                          <Bot {...sx("h-3 w-3 sm:h-4 sm:w-4")} />
                        )}
                      </div>
                      <div {...sx("flex-1 min-w-0")}>
                        <div {...sx("whitespace-pre-wrap break-words text-xs sm:text-sm")}>
                          {message.content}
                        </div>
                        <MessageAttachment attachments={message.attachments || []} />
                        <div {...sx("flex items-center justify-between mt-1.5 sm:mt-2")}>
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
                              aria-label={
                                copiedMessageId === message.id
                                  ? m.copy_response_copied()
                                  : m.copy_copy_response()
                              }
                              className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-background/20"
                              onClick={() => copyToClipboard(message.content, message.id)}
                            >
                              {copiedMessageId === message.id ? (
                                <Check {...sx("h-3 w-3")} />
                              ) : (
                                <Copy {...sx("h-3 w-3")} />
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
              <div {...sx("flex justify-start")}>
                <Card className="bg-muted max-w-[85%] sm:max-w-[80%] md:max-w-[70%]">
                  <CardContent className="p-2 sm:p-3">
                    <div {...sx("flex items-center space-x-1.5 sm:space-x-2")}>
                      <Bot {...sx("h-3 w-3 sm:h-4 sm:w-4")} />
                      <div {...sx("flex space-x-1")}>
                        <div
                          {...sx(
                            "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]",
                          )}
                        ></div>
                        <div
                          {...sx(
                            "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]",
                          )}
                        ></div>
                        <div
                          {...sx(
                            "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-bounce",
                          )}
                        ></div>
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
        <div {...sx("border-t p-2 sm:p-4 bg-background/50 backdrop-blur space-y-2 sm:space-y-3")}>
          {/* Model Selector and BYOK Status */}
          <div {...sx("flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3")}>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading}
              className="w-full sm:max-w-xs"
            />

            {/* Attachment Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={<div />}>
                  {fileAttachments.supportsAttachments ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="outline"
                            disabled={isLoading}
                            className="w-full sm:w-auto h-9 sm:h-10"
                          />
                        }
                      >
                        <Paperclip {...sx("h-4 w-4 mr-2")} />
                        <span {...sx("text-sm")}>{m.copy_attach()}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-sm">
                            {m.copy_attach_files()}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {fileAttachments.modelCapabilities.supportsImages && (
                            <DropdownMenuItem
                              onClick={() => handleFileSelect("image")}
                              className="text-sm"
                            >
                              <ImageIcon {...sx("h-4 w-4 mr-2")} /> {m.copy_upload_images()}{" "}
                              <span {...sx("ml-auto text-xs text-muted-foreground")}>
                                {m.copy_up_to()}{" "}
                                {Math.round(fileAttachments.modelCapabilities.maxImageSize! || 5)}{" "}
                                {m.copy_mb()}
                              </span>
                            </DropdownMenuItem>
                          )}
                          {fileAttachments.modelCapabilities.supportsDocuments && (
                            <DropdownMenuItem
                              onClick={() => handleFileSelect("document")}
                              className="text-sm"
                            >
                              <FileText {...sx("h-4 w-4 mr-2")} /> {m.copy_upload_pdfs()}{" "}
                              <span {...sx("ml-auto text-xs text-muted-foreground")}>
                                {m.copy_up_to()}{" "}
                                {Math.round(
                                  fileAttachments.modelCapabilities.maxDocumentSize! || 5,
                                )}{" "}
                                {m.copy_mb()}
                              </span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="outline"
                      disabled={true}
                      className="w-full sm:w-auto h-9 sm:h-10 opacity-50 cursor-not-allowed"
                    >
                      <Paperclip {...sx("h-4 w-4 mr-2")} />
                      <span {...sx("text-sm")}>{m.copy_attach()}</span>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {fileAttachments.supportsAttachments
                    ? m.copy_upload_files_to_enhance_your_conversation()
                    : m.copy_model_does_not_support_file_attachments({
                        model: selectedModel.split("/").pop() || selectedModel,
                      })}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {fileAttachments.supportsAttachments && (
            <Dropzone
              files={dropzoneFiles}
              setFiles={() => undefined}
              onUpload={async () => undefined}
              loading={fileAttachments.isUploading}
              successes={[]}
              errors={
                fileAttachments.uploadError
                  ? [{ name: "attachments", message: fileAttachments.uploadError.message }]
                  : []
              }
              maxFileSize={
                Math.max(
                  fileAttachments.modelCapabilities.maxImageSize ?? 0,
                  fileAttachments.modelCapabilities.maxDocumentSize ?? 0,
                ) *
                1024 *
                1024
              }
              maxFiles={10}
              isSuccess={false}
              accept={fileAttachments.allowedMimeTypes.reduce(
                (acc, mimeType) => ({ ...acc, [mimeType]: [] }),
                {},
              )}
              disabled={isLoading || fileAttachments.isUploading}
              onFilesAccepted={fileAttachments.addFiles}
              inputProps={{ "data-chat-file-input": true }}
              className="p-3 sm:p-4 [&_input]:hidden"
            >
              <DropzoneEmptyState />
            </Dropzone>
          )}

          {/* Pending Files */}
          {fileAttachments.pendingFiles.length > 0 && (
            <div {...sx("space-y-2")}>
              {fileAttachments.pendingFiles.map((file) => (
                <div
                  key={file.id}
                  {...sx("flex items-center justify-between bg-muted/50 rounded-lg p-2")}
                >
                  <div {...sx("flex items-center space-x-2 flex-1 min-w-0")}>
                    <div {...sx("h-4 w-4 flex-shrink-0")}>
                      {file.type.startsWith("image/") ? (
                        <ImageIcon {...sx("h-4 w-4")} />
                      ) : (
                        <FileText {...sx("h-4 w-4")} />
                      )}
                    </div>
                    <span {...sx("text-xs sm:text-sm font-medium truncate")}>{file.name}</span>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {formatBytes(file.size)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={m.copy_remove_file({ name: file.name })}
                    onClick={() => fileAttachments.removeFile(file.id)}
                    disabled={isLoading || fileAttachments.isUploading}
                    className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                  >
                    <X {...sx("h-3 w-3")} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Input Form */}
          <Form {...messageForm}>
            <form onSubmit={messageForm.handleSubmit(handleSendMessage)} {...sx("flex space-x-2")}>
              <FormField
                control={messageForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder={m.copy_type_your_message()}
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
                  aria-label={m.copy_stop_generating_response()}
                  className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                >
                  <StopCircle {...sx("h-4 w-4")} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!messageForm.watch("message")?.trim()}
                  size="icon"
                  aria-label={m.copy_send_message()}
                  className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Send {...sx("h-4 w-4")} />
                </Button>
              )}
            </form>
          </Form>
          <p {...sx("text-xs text-muted-foreground text-center px-2")}>
            {m.copy_press_enter_to_send_shift_enter_for_new_line()}{" "}
            {fileAttachments.supportsAttachments && fileAttachments.pendingFiles.length === 0 && (
              <span {...sx("block mt-1")}>
                {m.copy_drag_and_drop()}{" "}
                {fileAttachments.modelCapabilities.supportsImages &&
                fileAttachments.modelCapabilities.supportsDocuments
                  ? m.copy_images_or_pdfs()
                  : fileAttachments.modelCapabilities.supportsImages
                    ? "images"
                    : m.copy_pdfs()}{" "}
                {m.copy_anywhere_to_attach()}
              </span>
            )}
            {!fileAttachments.supportsAttachments && (
              <span {...sx("block mt-1 text-muted-foreground/60")}>
                {m.copy_current_model_does_not_support_file_attachments()}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Read-only footer for shared view */}
      {isSharedView && (
        <div {...sx("border-t p-2 sm:p-4 bg-background/50 backdrop-blur")}>
          <p {...sx("text-xs text-muted-foreground text-center")}>
            {m.copy_this_is_a_shared_chat_conversation_in_read_only_mode()}
          </p>
        </div>
      )}
    </div>
  );
}
