import prisma from "@/lib/prisma";
import { CollaborationSession, SessionParticipant } from "@prisma/client";

// Create or join a collaboration session
export async function createOrJoinCollaborationSession(
  chatId: string,
  userId: string,
  role: "owner" | "collaborator" | "viewer" = "collaborator"
): Promise<CollaborationSession & { participants: SessionParticipant[] }> {
  return await prisma.$transaction(async (tx) => {
    // Check if there's already an active session for this chat
    let session = await tx.collaborationSession.findFirst({
      where: {
        chatId,
        lastActivity: {
          // Consider session active if activity within last 5 minutes
          gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
      include: {
        participants: true,
      },
    });

    if (session) {
      // Join existing session if not already a participant
      const existingParticipant = session.participants.find(
        (p) => p.userId === userId
      );

      if (!existingParticipant) {
        await tx.sessionParticipant.create({
          data: {
            sessionId: session.id,
            userId,
            role,
          },
        });
      } else {
        // Update participant activity
        await tx.sessionParticipant.update({
          where: { id: existingParticipant.id },
          data: { lastActivity: new Date() },
        });
      }

      // Update last activity
      session = await tx.collaborationSession.update({
        where: { id: session.id },
        data: { lastActivity: new Date() },
        include: { participants: true },
      });
    } else {
      // Create new session - first participant is always owner
      const participantRole = "owner";

      session = await tx.collaborationSession.create({
        data: {
          chatId,
          participants: {
            create: {
              userId,
              role: participantRole,
            },
          },
        },
        include: { participants: true },
      });

      // Mark the chat as collaborative
      await tx.chat.update({
        where: { id: chatId },
        data: { isCollaborative: true },
      });
    }

    return session;
  });
}

// Leave a collaboration session
export async function leaveCollaborationSession(
  sessionId: string,
  userId: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Remove participant
    await tx.sessionParticipant.deleteMany({
      where: {
        sessionId,
        userId,
      },
    });

    // Check if session has any participants left
    const remainingParticipants = await tx.sessionParticipant.count({
      where: { sessionId },
    });

    // If no participants left, clean up the session
    if (remainingParticipants === 0) {
      await tx.collaborationSession.delete({
        where: { id: sessionId },
      });
    }
  });
}

// Update session activity (heartbeat)
export async function updateSessionActivity(sessionId: string): Promise<void> {
  await prisma.collaborationSession.update({
    where: { id: sessionId },
    data: { lastActivity: new Date() },
  });
}

// Get active collaboration sessions for a user
export async function getUserActiveCollaborationSessions(
  userId: string
): Promise<(CollaborationSession & { participants: SessionParticipant[] })[]> {
  return prisma.collaborationSession.findMany({
    where: {
      participants: {
        some: { userId },
      },
      lastActivity: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // Active within 5 minutes
      },
    },
    include: {
      participants: true,
      chat: {
        select: {
          id: true,
          title: true,
          mode: true,
        },
      },
    },
    orderBy: {
      lastActivity: "desc",
    },
  });
}

// Clean up old/inactive collaboration sessions
export async function cleanupInactiveCollaborationSessions(): Promise<void> {
  const inactiveThreshold = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes

  // Delete sessions with no activity for 30+ minutes
  await prisma.collaborationSession.deleteMany({
    where: {
      lastActivity: {
        lt: inactiveThreshold,
      },
    },
  });
}

// Get collaboration session for a chat
export async function getChatCollaborationSession(
  chatId: string
): Promise<
  (CollaborationSession & { participants: SessionParticipant[] }) | null
> {
  return prisma.collaborationSession.findFirst({
    where: {
      chatId,
      lastActivity: {
        gte: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
    include: {
      participants: true,
    },
  });
}

// End collaboration session completely (owner only)
export async function endCollaborationSession(
  sessionId: string,
  chatId: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Delete the collaboration session (this will cascade delete participants)
    await tx.collaborationSession.delete({
      where: {
        id: sessionId,
        chatId: chatId,
      },
    });

    // Mark chat as non-collaborative
    await tx.chat.update({
      where: { id: chatId },
      data: { isCollaborative: false },
    });
  });
}

// Join collaboration session with proper validation
export async function joinCollaborationSession(
  chatId: string,
  userId: string,
  isOwner: boolean
): Promise<{
  success: boolean;
  session?: CollaborationSession & { participants: SessionParticipant[] };
  error?: string;
}> {
  try {
    const session = await prisma.$transaction(async (tx) => {
      // Check if there's an active collaboration session
      let session = await tx.collaborationSession.findFirst({
        where: {
          chatId,
          lastActivity: {
            gte: new Date(Date.now() - 5 * 60 * 1000), // Active within 5 minutes
          },
        },
        include: {
          participants: true,
        },
      });

      if (!session) {
        // If no active session and user is not the owner, they can't join
        if (!isOwner) {
          throw new Error("No active collaboration session");
        }

        // If user is owner, create a new session
        session = await tx.collaborationSession.create({
          data: {
            chatId,
            participants: {
              create: {
                userId,
                role: "owner",
              },
            },
          },
          include: { participants: true },
        });
      } else {
        // Use upsert to safely handle concurrent participant creation
        await tx.sessionParticipant.upsert({
          where: {
            sessionId_userId: {
              sessionId: session.id,
              userId,
            },
          },
          update: {
            lastActivity: new Date(),
            // Update role if user is owner (in case they weren't before)
            role: isOwner ? "owner" : undefined,
          },
          create: {
            sessionId: session.id,
            userId,
            role: isOwner ? "owner" : "collaborator",
          },
        });

        // Update session last activity
        session = await tx.collaborationSession.update({
          where: { id: session.id },
          data: { lastActivity: new Date() },
          include: { participants: true },
        });
      }

      return session;
    });

    return {
      success: true,
      session,
    };
  } catch (error) {
    console.error("Join collaboration session error:", error);

    // Handle specific error cases
    if (
      error instanceof Error &&
      error.message === "No active collaboration session"
    ) {
      return {
        success: false,
        error: "No active collaboration session",
      };
    }

    return {
      success: false,
      error: "Failed to join collaboration session",
    };
  }
}

// Get collaboration session info for a user
export async function getCollaborationSessionInfo(
  chatId: string,
  userId: string
): Promise<{
  session: {
    id: string;
    chatId: string;
    activeSince: Date;
    lastActivity: Date;
    participantCount: number;
    isParticipant: boolean;
  } | null;
}> {
  const session = await prisma.collaborationSession.findFirst({
    where: {
      chatId,
      lastActivity: {
        gte: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
    include: {
      participants: true,
    },
  });

  if (!session) {
    return { session: null };
  }

  return {
    session: {
      id: session.id,
      chatId: session.chatId,
      activeSince: session.activeSince,
      lastActivity: session.lastActivity,
      participantCount: session.participants.length,
      isParticipant: session.participants.some((p) => p.userId === userId),
    },
  };
}

// Create or join collaboration session with access control
export async function createOrJoinWithAccessControl(
  chatId: string,
  userId: string,
  isOwner: boolean,
  isCollaborative: boolean
): Promise<{
  success: boolean;
  sessionData?: {
    sessionId: string;
    chatId: string;
    activeSince: Date;
    participantCount: number;
  };
  error?: string;
}> {
  try {
    // Check if there's already an active session for this chat
    let session = await prisma.collaborationSession.findFirst({
      where: {
        chatId,
        lastActivity: {
          gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
      include: {
        participants: true,
      },
    });

    // Determine user's role and access rights
    let userRole: "owner" | "collaborator" = "collaborator";
    let canJoin = false;

    // Chat owner can always start/join collaboration
    if (isOwner) {
      userRole = "owner";
      canJoin = true;
    }
    // If chat is collaborative and has active session, others can join
    else if (isCollaborative && session) {
      userRole = "collaborator";
      canJoin = true;
    }
    // If chat is collaborative but no active session, only owner can start
    else if (isCollaborative && !session) {
      return {
        success: false,
        error:
          "No active collaboration session. Only chat owner can start collaboration.",
      };
    }
    // If chat is not collaborative, only owner can access
    else {
      return {
        success: false,
        error: "Access denied",
      };
    }

    if (!canJoin) {
      return {
        success: false,
        error: "Access denied",
      };
    }

    if (session) {
      // Join existing session if not already a participant
      const existingParticipant = session.participants.find(
        (p) => p.userId === userId
      );

      if (!existingParticipant) {
        await prisma.sessionParticipant.create({
          data: {
            sessionId: session.id,
            userId,
            role: userRole,
          },
        });
      } else {
        // Update participant activity
        await prisma.sessionParticipant.update({
          where: { id: existingParticipant.id },
          data: { lastActivity: new Date() },
        });
      }

      // Update last activity
      session = await prisma.collaborationSession.update({
        where: { id: session.id },
        data: { lastActivity: new Date() },
        include: { participants: true },
      });
    } else {
      // Create new session - only owners can create new sessions
      if (userRole !== "owner") {
        return {
          success: false,
          error: "Only chat owner can start collaboration",
        };
      }

      session = await prisma.collaborationSession.create({
        data: {
          chatId,
          participants: {
            create: {
              userId,
              role: userRole,
            },
          },
        },
        include: { participants: true },
      });

      // Mark the chat as collaborative
      await prisma.chat.update({
        where: { id: chatId },
        data: { isCollaborative: true },
      });
    }

    return {
      success: true,
      sessionData: {
        sessionId: session.id,
        chatId: session.chatId,
        activeSince: session.activeSince,
        participantCount: session.participants?.length || 1,
      },
    };
  } catch (error) {
    console.error("Create or join collaboration session error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
