import prisma from "@/lib/prisma";

/**
 * Delete all user data from the database
 * This includes: chats, messages, API keys, usage logs, etc.
 * The actual Supabase auth user will be deleted separately
 */
export async function deleteUserData(userId: string): Promise<{
  success: boolean;
  deletedItems: {
    chats: number;
    messages: number;
    apiKeys: number;
    usageLogs: number;
  };
}> {
  try {
    // Start a transaction to ensure all data is deleted atomically
    const result = await prisma.$transaction(async (tx) => {
      // Delete all user's usage logs first
      const deletedUsageLogs = await tx.usageLog.deleteMany({
        where: { userId },
      });

      // Delete all user's API keys
      const deletedApiKeys = await tx.apiKey.deleteMany({
        where: { userId },
      });

      // Delete conversation insights (related to messages)
      await tx.conversationInsight.deleteMany({
        where: {
          chat: {
            userId,
          },
        },
      });

      // Delete session participants
      await tx.sessionParticipant.deleteMany({
        where: { userId },
      });

      // Delete collaboration sessions for user's chats
      await tx.collaborationSession.deleteMany({
        where: {
          chat: {
            userId,
          },
        },
      });

      // Delete all messages (will cascade from chat deletion, but let's be explicit)
      const deletedMessages = await tx.message.deleteMany({
        where: {
          chat: {
            userId,
          },
        },
      });

      // Delete all user's chats (this should cascade delete messages due to foreign key constraints)
      const deletedChats = await tx.chat.deleteMany({
        where: { userId },
      });

      return {
        chats: deletedChats.count,
        messages: deletedMessages.count,
        apiKeys: deletedApiKeys.count,
        usageLogs: deletedUsageLogs.count,
      };
    });

    return {
      success: true,
      deletedItems: result,
    };
  } catch (error) {
    console.error("Error deleting user data:", error);
    return {
      success: false,
      deletedItems: {
        chats: 0,
        messages: 0,
        apiKeys: 0,
        usageLogs: 0,
      },
    };
  }
}

/**
 * Get user data statistics for showing what will be deleted
 */
export async function getUserDataStats(userId: string): Promise<{
  chats: number;
  messages: number;
  apiKeys: number;
  usageLogs: number;
  accountAge: number; // in days
}> {
  try {
    const [chatsCount, messagesCount, apiKeysCount, usageLogsCount] =
      await Promise.all([
        prisma.chat.count({ where: { userId } }),
        prisma.message.count({
          where: {
            chat: { userId },
          },
        }),
        prisma.apiKey.count({ where: { userId } }),
        prisma.usageLog.count({ where: { userId } }),
      ]);

    // Calculate account age (would need user creation date from Supabase)
    // For now, we'll use the oldest chat as a proxy
    const oldestChat = await prisma.chat.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    const accountAge = oldestChat
      ? Math.floor(
          (Date.now() - oldestChat.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    return {
      chats: chatsCount,
      messages: messagesCount,
      apiKeys: apiKeysCount,
      usageLogs: usageLogsCount,
      accountAge,
    };
  } catch (error) {
    console.error("Error getting user data stats:", error);
    return {
      chats: 0,
      messages: 0,
      apiKeys: 0,
      usageLogs: 0,
      accountAge: 0,
    };
  }
}

/**
 * Export user data as JSON
 * This provides users with a copy of their data before deletion
 */
export async function exportUserData(userId: string) {
  try {
    // Get all user data
    const [chats, apiKeys, usageLogs] = await Promise.all([
      // Get chats with messages
      prisma.chat.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Get API keys (without encrypted values for security)
      prisma.apiKey.findMany({
        where: { userId },
        select: {
          id: true,
          provider: true,
          keyName: true,
          isActive: true,
          createdAt: true,
          lastUsedAt: true,
          // Exclude encryptedKey for security
        },
      }),
      // Get usage logs
      prisma.usageLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      userId,
      summary: {
        totalChats: chats.length,
        totalMessages: chats.reduce(
          (sum, chat) => sum + chat.messages.length,
          0
        ),
        totalApiKeys: apiKeys.length,
        totalUsageLogs: usageLogs.length,
      },
      chats: chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        mode: chat.mode,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messages: chat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          model: msg.model,
          createdAt: msg.createdAt,
          parentId: msg.parentId,
          branchName: msg.branchName,
        })),
      })),
      apiKeys,
      usageLogs,
    };

    return exportData;
  } catch (error) {
    console.error("Error exporting user data:", error);
    throw new Error("Failed to export user data");
  }
}
