import { useState, useCallback } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
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
  model = "openai/gpt-5-mini",
  branchName,
  onError,
}: UseBranchingChatOptions) {
  const sendAgentMessage = useAction(api.agentActions.send);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  const sendMessage = useCallback(
    async (content: string) => {
      const prompt = content.trim();
      if (!prompt || isLoading) return;

      setIsLoading(true);
      setError(null);

      const optimistic: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: prompt,
        createdAt: new Date(),
        attachments: [],
        parentId: parentNodeId,
        branchName,
        xPosition: 0,
        yPosition: 0,
        nodeType: "conversation",
        isCollapsed: false,
        isLocked: false,
      };
      setOptimisticMessages((current) => [...current, optimistic]);

      try {
        await sendAgentMessage({
          chatId: chatId as Id<"chats">,
          prompt,
          model,
          parentAgentMessageId: parentNodeId,
          branchName,
        });
        setInput("");
      } catch (unknownError) {
        const nextError =
          unknownError instanceof Error ? unknownError : new Error("Failed to send message");
        console.error("Failed to send branching message:", nextError);
        setError(nextError);
        onError?.(nextError);
      } finally {
        setIsLoading(false);
      }
    },
    [branchName, chatId, isLoading, model, onError, parentNodeId, sendAgentMessage],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void sendMessage(input);
    },
    [input, sendMessage],
  );

  return {
    input,
    setInput,
    messages: [...initialContext, ...optimisticMessages],
    setMessages: () => undefined,
    isLoading,
    error,
    sendMessage,
    handleInputChange,
    handleSubmit,
    stop: () => undefined,
  };
}
