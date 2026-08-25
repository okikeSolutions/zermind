import { useMemo } from "react";
import { useChatWithMessages } from "@/hooks/use-chats-query";
import { type Message } from "@/lib/schemas/chat";

export const conversationContextKeys = {
  all: ["conversationContext"] as const,
  context: (chatId: string | undefined, parentNodeId: string | undefined) => {
    const baseKey = ["conversationContext"] as const;
    if (chatId !== undefined && parentNodeId !== undefined)
      return [...baseKey, chatId, parentNodeId] as const;
    if (chatId !== undefined) return [...baseKey, "partial", chatId] as const;
    if (parentNodeId !== undefined) return [...baseKey, "partial", parentNodeId] as const;
    return [...baseKey, "empty"] as const;
  },
} as const;

function buildContext(messages: Message[], parentNodeId: string) {
  const byId = new Map(messages.map((message) => [message.id, message]));
  const context: Message[] = [];
  let current: Message | undefined = byId.get(parentNodeId);
  const seen = new Set<string>();

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    context.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return context.length > 0 ? context : messages.filter((message) => message.id === parentNodeId);
}

export function useConversationContext(
  chatId: string | undefined,
  parentNodeId: string | undefined,
) {
  const { data, isLoading, refetch } = useChatWithMessages(chatId, chatId ? "current" : undefined);

  const typedError = null as Error | null;

  return {
    data: useMemo(() => {
      if (!data || !parentNodeId) return undefined;
      return buildContext(data.messages, parentNodeId);
    }, [data, parentNodeId]),
    isLoading: !!chatId && !!parentNodeId && isLoading,
    error: typedError,
    refetch,
  };
}
