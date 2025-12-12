import { useState, useCallback, useEffect } from "react";
import { useSaveMessage } from "@/hooks/use-chats-query";
import { useChat } from "@ai-sdk/react";
import { type Message } from "@/lib/schemas/chat";

interface UseBranchingChatOptions {
  chatId: string;
  parentNodeId: string;
  initialContext: Message[];
  model?: string;
  branchName?: string;
  onFinish?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export function useBranchingChat({
  chatId,
  parentNodeId,
  initialContext,
  model = "openai/gpt-4o-mini",
  branchName,
  onFinish,
  onError,
}: UseBranchingChatOptions) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveMessageMutation = useSaveMessage();

  const {
    messages: aiMessages,
    setMessages,
    status,
    error: aiError,
    stop,
    sendMessage: aiSendMessage,
  } = useChat({
    id: `${chatId}-branch-${parentNodeId}-${model}${
      branchName ? `-${branchName}` : ""
    }`,
    messages: initialContext.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: [{ type: "text", text: msg.content }],
    })),
    onFinish: async ({ message }) => {
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

      try {
        // Save assistant message to database with parentId
        await saveMessageMutation.mutateAsync({
          chatId,
          message: {
            role: formattedMessage.role,
            content: formattedMessage.content,
            model: formattedMessage.model,
            attachments: [],
            parentId: parentNodeId,
            branchName,
            xPosition: 0,
            yPosition: 0,
            nodeType: "conversation",
            isCollapsed: false,
            isLocked: false,
          },
        });

        onFinish?.(formattedMessage);
      } catch (error) {
        console.error("Failed to save assistant message:", error);
        const errorMessage =
          error instanceof Error ? error : new Error("Failed to save message");
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Branching chat error:", error);
      setError(error);
      onError?.(error);
      setIsLoading(false);
    },
  });

  // Synchronize messages when initialContext changes
  useEffect(() => {
    const formattedMessages = initialContext.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: [{ type: "text" as const, text: msg.content }],
    }));
    setMessages(formattedMessages);
  }, [initialContext, setMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (
        !content.trim() ||
        isLoading ||
        status === "submitted" ||
        status === "streaming"
      )
        return;

      setIsLoading(true);
      setError(null);

      try {
        // Save user message to database with parentId
        await saveMessageMutation.mutateAsync({
          chatId,
          message: {
            role: "user",
            content: content.trim(),
            model: null,
            attachments: [],
            parentId: parentNodeId,
            branchName,
            xPosition: 0,
            yPosition: 0,
            nodeType: "conversation",
            isCollapsed: false,
            isLocked: false,
          },
        });

        // Send message using sendMessage from useChat
        aiSendMessage(
          {
            role: "user",
            parts: [{ type: "text", text: content.trim() }],
          },
          {
            body: {
              model,
            },
          }
        );

        setInput("");
      } catch (error) {
        console.error("Failed to send branching message:", error);
        const errorMessage =
          error instanceof Error ? error : new Error("Failed to send message");
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
      }
    },
    [
      isLoading,
      status,
      saveMessageMutation,
      chatId,
      parentNodeId,
      branchName,
      aiSendMessage,
      model,
      onError,
    ]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  return {
    input,
    setInput,
    messages: aiMessages,
    setMessages,
    isLoading: isLoading || status === "submitted" || status === "streaming",
    error: error || aiError,
    sendMessage,
    handleInputChange,
    handleSubmit,
    stop,
  };
}
