import { useChat as useAIChat } from "@ai-sdk/react";
import { type Message, type Attachment } from "@/lib/schemas/chat";

interface UseChatOptions {
  chatId?: string;
  initialMessages?: Message[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  onFinish?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export function useChat({
  chatId,
  initialMessages = [],
  model = "openai/gpt-4o-mini",
  maxTokens = 1000,
  temperature = 0.7,
  onFinish,
  onError,
}: UseChatOptions = {}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    stop,
    reload,
    setMessages,
    append,
  } = useAIChat({
    api: "/api/chat",
    id: chatId,
    initialMessages: initialMessages.map((msg) => ({
      ...msg,
      createdAt:
        msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt),
      attachments: msg.attachments || [],
    })),
    body: {
      model,
      maxTokens,
      temperature,
    },
    onFinish: (message) => {
      const formattedMessage: Message = {
        id: message.id,
        role: message.role as "user" | "assistant",
        content: message.content,
        createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
        model,
        attachments: [],
        xPosition: 0,
        yPosition: 0,
        nodeType: "conversation",
        isCollapsed: false,
        isLocked: false,
      };
      onFinish?.(formattedMessage);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      onError?.(error);
    },
  });

  // Convert messages to our Message type
  const formattedMessages: Message[] = messages.map((msg) => {
    const messageWithAttachments = msg as typeof msg & {
      attachments?: Message["attachments"];
    };
    return {
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      createdAt:
        msg.createdAt instanceof Date
          ? msg.createdAt
          : new Date(msg.createdAt || Date.now()),
      model: msg.role === "assistant" ? model : undefined,
      attachments: messageWithAttachments.attachments || [],
      xPosition: 0,
      yPosition: 0,
      nodeType: "conversation",
      isCollapsed: false,
      isLocked: false,
    };
  });

  return {
    messages: formattedMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: status === "submitted" || status === "streaming",
    error,
    stop,
    reload,
    setMessages: (messages: Message[]) => {
      setMessages(
        messages.map((msg) => ({
          ...msg,
          createdAt:
            msg.createdAt instanceof Date
              ? msg.createdAt
              : new Date(msg.createdAt),
        }))
      );
    },
    append: (message: { role: "user" | "assistant"; content: string }) => {
      return append({
        ...message,
        createdAt: new Date(),
      });
    },
    sendMessage: async (content: string, attachments: Attachment[] = []) => {
      try {
        console.log("Sending message with attachments:", {
          content,
          attachmentsCount: attachments.length,
          attachments: attachments.map((att) => ({
            name: att.name,
            type: att.type,
            mimeType: att.mimeType,
            size: att.size,
            urlType: att.url.startsWith("data:") ? "data URL" : "external URL",
            urlLength: att.url.length,
          })),
        });

        // For the AI SDK, we need to send the message with attachments using experimental_attachments
        // We extend the message with attachments for optimistic UI updates
        return append(
          {
            role: "user",
            content: content,
            createdAt: new Date(),
            attachments: attachments,
          } as Parameters<typeof append>[0] & { attachments: Attachment[] },
          {
            experimental_attachments: attachments.map((att) => ({
              name: att.name,
              contentType: att.mimeType,
              url: att.url,
            })),
          }
        );
      } catch (error) {
        console.error("Failed to process message with attachments:", error);
        onError?.(
          error instanceof Error ? error : new Error("Failed to send message")
        );
        throw error;
      }
    },
  };
}
