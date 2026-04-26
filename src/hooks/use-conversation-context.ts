import { useQuery } from "@tanstack/react-query";
import { type Message } from "@/lib/schemas/chat";

// Query Keys
export const conversationContextKeys = {
  all: ["conversationContext"] as const,
  context: (chatId: string | undefined, parentNodeId: string | undefined) => {
    const baseKey = ["conversationContext"] as const;
    if (chatId !== undefined && parentNodeId !== undefined) {
      return [...baseKey, chatId, parentNodeId] as const;
    }
    if (chatId !== undefined) {
      return [...baseKey, "partial", chatId] as const;
    }
    if (parentNodeId !== undefined) {
      return [...baseKey, "partial", parentNodeId] as const;
    }
    return [...baseKey, "empty"] as const;
  },
} as const;

// API Function
async function fetchConversationContext(chatId: string, parentNodeId: string): Promise<Message[]> {
  const response = await fetch(
    `/api/chats/${encodeURIComponent(chatId)}/context/${encodeURIComponent(parentNodeId)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversation context");
  }

  const data = await response.json();

  // Transform the data to match Message schema
  return data.context.map(
    (msg: {
      id: string;
      role: string;
      content: string;
      model: string | null;
      createdAt: string;
    }) => ({
      ...msg,
      role: msg.role === "user" || msg.role === "assistant" ? msg.role : "assistant",
      createdAt: new Date(msg.createdAt),
      attachments: [],
    }),
  );
}

// Hook
export function useConversationContext(
  chatId: string | undefined,
  parentNodeId: string | undefined,
) {
  return useQuery({
    queryKey: conversationContextKeys.context(chatId, parentNodeId),
    queryFn: () => fetchConversationContext(chatId!, parentNodeId!),
    enabled: !!chatId && !!parentNodeId,
    staleTime: 5 * 60 * 1000, // 5 minutes - context doesn't change often
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}
