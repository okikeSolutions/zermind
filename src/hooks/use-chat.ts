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
    status,
    error,
    stop,
    setMessages: setAIMessages,
    sendMessage: aiSendMessage,
  } = useAIChat({
    id: chatId,
    messages: initialMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: [{ type: "text" as const, text: msg.content }],
    })),
    onFinish: ({ message }) => {
      const messageContent = message.parts
        .filter((part) => part.type === "text")
        .map((part) => (part as { text: string }).text)
        .join("");

      const formattedMessage: Message = {
        id: message.id,
        role: message.role as "user" | "assistant",
        content: messageContent,
        createdAt: new Date(),
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
    const messageContent = msg.parts
      .filter((part) => part.type === "text")
      .map((part) => (part as { text: string }).text)
      .join("");

    return {
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: messageContent,
      createdAt: new Date(),
      model: msg.role === "assistant" ? model : undefined,
      attachments: [],
      xPosition: 0,
      yPosition: 0,
      nodeType: "conversation",
      isCollapsed: false,
      isLocked: false,
    };
  });

  return {
    messages: formattedMessages,
    isLoading: status === "submitted" || status === "streaming",
    error,
    stop,
    setMessages: (messages: Message[]) => {
      setAIMessages(
        messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          parts: [{ type: "text" as const, text: msg.content }],
        }))
      );
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

        // Send message using sendMessage from useChat
        aiSendMessage(
          {
            role: "user",
            parts: [{ type: "text", text: content }],
          },
          {
            body: {
              model,
              maxTokens,
              temperature,
            },
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
