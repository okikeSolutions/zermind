import prisma from "@/lib/prisma";
import {
  ChatWithMessagesSchema,
  ChatListItemSchema,
  type ChatWithMessages,
  type ChatListItem,
  type Attachment,
} from "@/lib/schemas/chat";
import { JsonValue } from "@prisma/client/runtime/client";

import { randomBytes } from "crypto";

// Generate a cryptographically secure random share ID
function generateShareId(): string {
  // Generate 32 random bytes and convert to base64url (URL-safe)
  return randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, ""); // Remove padding for cleaner URLs
}

// Helper function to safely parse message attachments
function parseAttachments(attachments: JsonValue): Attachment[] {
  try {
    // If already an array, validate and return as Attachment[]
    if (Array.isArray(attachments)) {
      // Type guard to ensure it's an array of valid attachments
      return attachments.filter(
        (item): item is Attachment =>
          item != null &&
          typeof item === "object" &&
          "id" in item &&
          "name" in item
      );
    }

    // If falsy (null, undefined, empty string), return empty array
    if (!attachments) {
      return [];
    }

    // Try to parse JSON string
    if (typeof attachments === "string") {
      const parsed = JSON.parse(attachments);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is Attachment =>
            item != null &&
            typeof item === "object" &&
            "id" in item &&
            "name" in item
        );
      }
      return [];
    }

    // Return empty array for other types (number, boolean, object)
    return [];
  } catch (error) {
    // Log the error and return empty array for malformed JSON
    console.warn("Failed to parse message attachments:", error);
    return [];
  }
}

// Get all chats for a user (for sidebar)
export async function getUserChats(userId: string): Promise<ChatListItem[]> {
  const rawChats = await prisma.chat.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      userId: true,
      mode: true, // Added mode field
      isCollaborative: true, // Added collaboration field
      createdAt: true,
      updatedAt: true,
      shareId: true,
      _count: {
        select: {
          messages: true,
        },
      },
      messages: {
        select: {
          content: true,
          createdAt: true,
          attachments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Transform the raw data to match our schema
  const transformedChats = rawChats.map((chat) => ({
    ...chat,
    messages: chat.messages.map((message) => ({
      ...message,
      attachments: parseAttachments(message.attachments),
    })),
  }));

  // Validate and transform the data using Zod
  return transformedChats.map((chat) => ChatListItemSchema.parse(chat));
}

// Get a single chat with all messages
export async function getChatWithMessages(
  chatId: string,
  userId: string
): Promise<ChatWithMessages | null> {
  const rawChat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!rawChat) return null;

  // Transform the raw data to match our schema
  const transformedChat = {
    ...rawChat,
    messages: rawChat.messages.map((message) => ({
      ...message,
      attachments: parseAttachments(message.attachments),
    })),
  };

  // Validate and transform the data using Zod
  return ChatWithMessagesSchema.parse(transformedChat);
}

// Create a new chat
export async function createChat(userId: string, title?: string) {
  return await prisma.chat.create({
    data: {
      userId,
      title: title || null,
    },
  });
}

// Update chat title
export async function updateChatTitle(
  chatId: string,
  userId: string,
  title: string
) {
  return await prisma.chat.update({
    where: {
      id: chatId,
      userId,
    },
    data: {
      title,
    },
  });
}

// Delete a chat
export async function deleteChat(chatId: string, userId: string) {
  return await prisma.chat.delete({
    where: {
      id: chatId,
      userId,
    },
  });
}

// Add a message to a chat
export async function addMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string,
  model?: string,
  parentId?: string,
  attachments?: Attachment[],
  xPosition?: number,
  yPosition?: number,
  nodeType?: "conversation" | "branching_point" | "insight",
  branchName?: string
) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Update the chat's updatedAt timestamp
      await tx.chat.update({
        where: {
          id: chatId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      // Create the message with attachments and mind map positioning
      return await tx.message.create({
        data: {
          chatId,
          role,
          content,
          model,
          parentId,
          branchName,
          xPosition: xPosition || 0,
          yPosition: yPosition || 0,
          nodeType: nodeType || "conversation",
          attachments:
            attachments && attachments.length > 0
              ? JSON.stringify(attachments)
              : "[]",
        },
      });
    });
  } catch (error) {
    console.error("Failed to add message:", error);
    throw new Error("Failed to add message to chat");
  }
}

// Add a new function specifically for branching messages
export async function addBranchingMessage(
  chatId: string,
  parentId: string,
  role: "user" | "assistant",
  content: string,
  model?: string,
  branchName?: string,
  attachments?: Attachment[]
) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Update the chat's updatedAt timestamp
      await tx.chat.update({
        where: {
          id: chatId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      // Create the branching message with attachments
      return await tx.message.create({
        data: {
          chatId,
          parentId,
          role,
          content,
          model,
          branchName,
          attachments:
            attachments && attachments.length > 0
              ? JSON.stringify(attachments)
              : "[]",
        },
      });
    });
  } catch (error) {
    console.error("Failed to add branching message:", error);
    throw new Error("Failed to add branching message to chat");
  }
}

// Get conversation context up to a specific node (for resuming)
export async function getConversationContext(
  nodeId: string,
  userId: string
): Promise<
  {
    id: string;
    role: string;
    content: string;
    model: string | null;
    createdAt: Date;
  }[]
> {
  // First get the specific message and verify ownership
  const targetMessage = await prisma.message.findFirst({
    where: {
      id: nodeId,
      chat: {
        userId: userId,
      },
    },
    include: {
      chat: true,
    },
  });

  if (!targetMessage) {
    throw new Error("Message not found");
  }

  // Build conversation context by traversing up the parent chain
  const context: {
    id: string;
    role: string;
    content: string;
    model: string | null;
    createdAt: Date;
  }[] = [];

  let currentMessage: typeof targetMessage | null = targetMessage;

  while (currentMessage) {
    context.unshift({
      id: currentMessage.id,
      role: currentMessage.role,
      content: currentMessage.content,
      model: currentMessage.model,
      createdAt: currentMessage.createdAt,
    });

    if (currentMessage.parentId) {
      currentMessage = await prisma.message.findFirst({
        where: {
          id: currentMessage.parentId,
          chat: {
            userId: userId,
          },
        },
        include: {
          chat: true,
        },
      });
    } else {
      currentMessage = null;
    }
  }

  return context;
}

// Get a shared chat by shareId (public access, no user authentication required)
export async function getSharedChat(
  shareId: string
): Promise<ChatWithMessages | null> {
  const rawChat = await prisma.chat.findFirst({
    where: {
      shareId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!rawChat) return null;

  // Validate and transform the data using Zod
  return ChatWithMessagesSchema.parse(rawChat);
}

// Generate or get existing share link for a chat
export async function generateShareLink(
  chatId: string,
  userId: string
): Promise<string | null> {
  // First check if the chat exists and belongs to the user
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userId,
    },
  });

  if (!chat) return null;

  // If chat already has a shareId, return it
  if (chat.shareId) {
    return chat.shareId;
  }

  // Generate a new shareId
  const shareId = generateShareId();

  // Update the chat with the new shareId
  await prisma.chat.update({
    where: {
      id: chatId,
      userId,
    },
    data: {
      shareId,
    },
  });

  return shareId;
}

// Remove share link from a chat
export async function removeShareLink(
  chatId: string,
  userId: string
): Promise<boolean> {
  try {
    await prisma.chat.update({
      where: {
        id: chatId,
        userId,
      },
      data: {
        shareId: null,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to remove share link:", error);
    return false;
  }
}

// Check if user is the owner of a chat
export async function isChatOwner(
  chatId: string,
  userId: string
): Promise<boolean> {
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      select: {
        id: true,
      },
    });
    return !!chat;
  } catch (error) {
    console.error("Failed to check chat ownership:", error);
    return false;
  }
}

// Get basic chat info including collaborative status
export async function getChatInfo(chatId: string): Promise<{
  id: string;
  userId: string;
  isCollaborative: boolean;
  title: string | null;
} | null> {
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        id: true,
        userId: true,
        isCollaborative: true,
        title: true,
      },
    });
    return chat;
  } catch (error) {
    console.error("Failed to get chat info:", error);
    return null;
  }
}
