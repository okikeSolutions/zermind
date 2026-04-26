import { QueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/hooks/use-chats-query";
import {
  type ChatListItem,
  type ChatWithMessages,
  ChatListItemSchema,
  ChatWithMessagesSchema,
} from "@/lib/schemas/chat";

// Server-side prefetch utilities for Next.js App Router

export async function prefetchUserChats(queryClient: QueryClient, userId: string): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: chatKeys.list(userId),
    queryFn: async (): Promise<ChatListItem[]> => {
      // In a real app, you'd use your server-side data fetching
      // For now, we'll use fetch but you could use Prisma directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/chats/user/${userId}`, {
        headers: {
          Cookie: "", // You'd pass the request cookies here
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user chats");
      }

      const data = await response.json();

      if (Array.isArray(data.chats)) {
        return data.chats.map((chat: unknown) => ChatListItemSchema.parse(chat));
      }
      return [];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export async function prefetchChatWithMessages(
  queryClient: QueryClient,
  chatId: string,
  userId: string,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: chatKeys.detail(chatId, userId),
    queryFn: async (): Promise<ChatWithMessages> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/chats/${chatId}?userId=${userId}`,
        {
          headers: {
            Cookie: "", // You'd pass the request cookies here
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }

      const data = await response.json();
      return ChatWithMessagesSchema.parse(data);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Alternative: Direct database prefetching (recommended for server components)
import { getUserChats, getChatWithMessages } from "@/lib/db/chats";

export async function prefetchUserChatsFromDB(
  queryClient: QueryClient,
  userId: string,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: chatKeys.list(userId),
    queryFn: () => getUserChats(userId),
    staleTime: 30 * 1000,
  });
}

export async function prefetchChatWithMessagesFromDB(
  queryClient: QueryClient,
  chatId: string,
  userId: string,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: chatKeys.detail(chatId, userId),
    queryFn: () => getChatWithMessages(chatId, userId),
    staleTime: 60 * 1000,
  });
}
