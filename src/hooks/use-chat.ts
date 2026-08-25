import { useCallback, useMemo, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { type Message, type Attachment } from "@/lib/schemas/chat";
import { getFriendlyErrorMessage } from "@/lib/rate-limit-error";
import * as m from "@/paraglide/messages.js";

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
  model = "openai/gpt-5-mini",
  temperature = 0.7,
  onError,
}: UseChatOptions = {}) {
  const sendAgentMessage = useAction(api.agentActions.send);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const messages = useMemo(() => initialMessages, [initialMessages]);

  const sendMessage = useCallback(
    async (content: string, _attachments: Attachment[] = []) => {
      if (!chatId) return;
      setIsLoading(true);
      setError(null);
      try {
        await sendAgentMessage({
          chatId: chatId as Id<"chats">,
          prompt: content,
          model,
          temperature,
          attachments: _attachments.map((attachment) => ({
            ...attachment,
            storageId: attachment.storageId as Id<"_storage"> | undefined,
          })),
        });
      } catch (unknownError) {
        const nextError = new Error(
          getFriendlyErrorMessage(unknownError, m.copy_failed_to_send_message()),
        );
        setError(nextError);
        onError?.(nextError);
        throw nextError;
      } finally {
        setIsLoading(false);
      }
    },
    [chatId, model, onError, sendAgentMessage, temperature],
  );

  return {
    messages,
    isLoading,
    error,
    stop: () => undefined,
    setMessages: () => undefined,
    sendMessage,
  };
}
