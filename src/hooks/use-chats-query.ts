import { useCallback, useMemo, useState } from "react";
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type {
  ChatListItem,
  ChatWithMessages,
  CreateChat,
  UpdateChat,
  Message,
} from "@/lib/schemas/chat";

export const chatKeys = {
  all: ["chats"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: (userId: string) => [...chatKeys.lists(), userId] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (id: string, userId: string) => [...chatKeys.details(), id, userId] as const,
} as const;

type MutationFn<Args, Result> = (args: Args) => Promise<Result>;

function useMutationCompat<Args, Result>(mutationFn: MutationFn<Args, Result>) {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (args: Args) => {
      setIsPending(true);
      try {
        return await mutationFn(args);
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn],
  );

  const mutate = useCallback(
    (args: Args) => {
      void mutateAsync(args);
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending };
}

function toDate(timestamp: number) {
  return new Date(timestamp);
}

function toUiMessage(message: {
  _id: string;
  role: string;
  content: string;
  createdAt: number;
  model?: string;
  attachments: Message["attachments"];
  parentId?: string;
  branchName?: string;
  xPosition: number;
  yPosition: number;
  nodeType: "conversation" | "branching_point" | "insight";
  isCollapsed: boolean;
  isLocked: boolean;
  lastEditedBy?: string;
  editedAt?: number;
}): Message {
  return {
    id: message._id,
    role: message.role === "user" ? "user" : "assistant",
    content: message.content,
    createdAt: toDate(message.createdAt),
    model: message.model,
    attachments: message.attachments,
    parentId: message.parentId,
    branchName: message.branchName,
    xPosition: message.xPosition,
    yPosition: message.yPosition,
    nodeType: message.nodeType,
    isCollapsed: message.isCollapsed,
    isLocked: message.isLocked,
    lastEditedBy: message.lastEditedBy,
    editedAt: message.editedAt ? toDate(message.editedAt) : undefined,
  };
}

function toUiChat(chat: {
  _id: Id<"chats">;
  title?: string;
  userId: string;
  mode: "chat" | "mind";
  isCollaborative: boolean;
  templateId?: Id<"conversationTemplates">;
  createdAt: number;
  updatedAt: number;
  shareId?: string;
}) {
  return {
    id: chat._id,
    title: chat.title ?? null,
    userId: chat.userId,
    mode: chat.mode,
    isCollaborative: chat.isCollaborative,
    templateId: chat.templateId,
    createdAt: toDate(chat.createdAt),
    updatedAt: toDate(chat.updatedAt),
    shareId: chat.shareId ?? null,
  };
}

function toUiChatListItem(
  chat: Parameters<typeof toUiChat>[0] & {
    messages: Array<{
      content: string;
      createdAt: number;
      attachments: Message["attachments"];
    }>;
  },
): ChatListItem {
  return {
    ...toUiChat(chat),
    _count: { messages: chat.messages.length },
    messages: chat.messages.map((message) => ({
      content: message.content,
      createdAt: toDate(message.createdAt),
      attachments: message.attachments,
    })),
  };
}

export function useUserChats(userId: string | undefined) {
  const chats = useConvexQuery(api.chats.listMine, userId ? {} : "skip");

  return {
    data: useMemo(() => chats?.map((chat) => toUiChatListItem(chat)) ?? [], [chats]),
    isLoading: userId !== undefined && chats === undefined,
    error: null,
    refetch: () => undefined,
  };
}

export function useChatWithMessages(chatId: string | undefined, userId: string | undefined) {
  const chat = useConvexQuery(
    api.chats.getWithMessages,
    chatId && userId ? { chatId: chatId as Id<"chats"> } : "skip",
  );

  return {
    data: useMemo<ChatWithMessages | undefined>(() => {
      if (!chat) return undefined;
      return {
        ...toUiChat(chat),
        messages: chat.messages.map((message) => toUiMessage(message)),
      };
    }, [chat]),
    isLoading: !!chatId && !!userId && chat === undefined,
    error: null,
    refetch: () => undefined,
  };
}

export function useCreateChat() {
  const createChat = useConvexMutation(api.chats.create);

  return useMutationCompat(async (data: CreateChat) => {
    const chat = await createChat({ title: data.title });
    return toUiChat(chat);
  });
}

export function useUpdateChatTitle() {
  const updateTitle = useConvexMutation(api.chats.updateTitle);

  return useMutationCompat(async ({ chatId, data }: { chatId: string; data: UpdateChat }) => {
    const chat = await updateTitle({
      chatId: chatId as Id<"chats">,
      title: data.title,
    });
    return toUiChat(chat);
  });
}

export function useDeleteChat() {
  const removeChat = useConvexMutation(api.chats.remove);

  return useMutationCompat(async (chatId: string) => {
    return await removeChat({ chatId: chatId as Id<"chats"> });
  });
}

export function useGenerateShareLink() {
  const generateShareLink = useConvexMutation(api.chats.generateShareLink);

  return useMutationCompat(async (chatId: string) => {
    return await generateShareLink({ chatId: chatId as Id<"chats"> });
  });
}

export function useRemoveShareLink() {
  const removeShareLink = useConvexMutation(api.chats.removeShareLink);

  return useMutationCompat(async (chatId: string) => {
    return await removeShareLink({ chatId: chatId as Id<"chats"> });
  });
}
