import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DualModeChat } from "@/components/dual-mode-chat";
import { getChatWithMessages } from "@/lib/db/chats";
import {
  getChatCollaborationSession,
  createOrJoinWithAccessControl,
} from "@/lib/db/collaboration";
import prisma from "@/lib/prisma";
import { ZermindLogo } from "@/components/zermind-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { type Attachment } from "@/lib/schemas/chat";

interface CollaborationPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function CollaborationPage({
  params,
}: CollaborationPageProps) {
  const supabase = await createClient();
  const { chatId } = await params;

  // Check authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  let chat: {
    id: string;
    user_id: string;
    title: string | null;
    is_collaborative: boolean;
  } | null = null;
  let userRole: "owner" | "collaborator" | "viewer" = "viewer";
  let chatData: Awaited<ReturnType<typeof getChatWithMessages>> | null = null;

  try {
    // Check if chat exists and get basic info
    const { data: chatDataResult, error: chatError } = await supabase
      .from("chats")
      .select("id, user_id, title, is_collaborative")
      .eq("id", chatId)
      .single();

    if (chatError || !chatDataResult) {
      redirect("/protected?error=chat-not-found");
    }

    chat = chatDataResult;

    const isOwner = chat.user_id === userData.user.id;
    const isCollaborative = chat.is_collaborative || false;

    // Use secure access control function - this validates all permissions server-side
    // Only allows:
    // 1. Owners to always access
    // 2. Non-owners to join ONLY if chat is collaborative AND there's an active session
    // 3. Non-owners CANNOT create new sessions (only owners can)
    const accessResult = await createOrJoinWithAccessControl(
      chatId,
      userData.user.id,
      isOwner,
      isCollaborative
    );

    if (!accessResult.success) {
      redirect("/protected?error=access-denied");
    }

    // Get the collaboration session to determine user's role
    const collaborationSession = await getChatCollaborationSession(chatId);
    if (collaborationSession) {
      const participant = collaborationSession.participants.find(
        (p: { userId: string }) => p.userId === userData.user.id
      );
      if (participant) {
        userRole = participant.role as "owner" | "collaborator" | "viewer";
      } else if (isOwner) {
        userRole = "owner";
      }
    } else if (isOwner) {
      userRole = "owner";
    }

    // Fetch chat data with messages - for collaboration, we allow access
    // to collaborative chats even if user doesn't own them
    if (chat.user_id === userData.user.id) {
      // Owner can access via normal method
      chatData = await getChatWithMessages(chatId, userData.user.id);
    } else {
      // Collaborators access via direct database query
      const collaboratorChatData = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
      chatData = collaboratorChatData as typeof chatData;
    }

    if (!chatData) {
      redirect("/protected?error=chat-not-found");
    }
  } catch (error) {
    console.error("Collaboration page error:", error);
    redirect("/protected?error=collaboration-error");
  }

  if (!chat || !chatData) {
    redirect("/protected?error=chat-not-found");
  }

  // Helper function to safely parse attachments from JSON
  const parseAttachments = (attachments: unknown): Attachment[] => {
    try {
      if (!attachments) return [];
      if (Array.isArray(attachments)) return attachments as Attachment[];
      if (typeof attachments === "string") {
        const parsed = JSON.parse(attachments);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header for collaboration mode */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ZermindLogo variant="compact" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Collaborative Chat</span>
              {chat.title && (
                <>
                  <span className="mx-2">•</span>
                  <span>{chat.title}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground capitalize">
              {userRole}
            </span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Main chat content */}
      <main className="h-[calc(100vh-73px)]">
        <DualModeChat
          chatId={chatId}
          initialMessages={chatData.messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as "user" | "assistant",
            model: msg.model || undefined,
            parentId: msg.parentId || undefined,
            branchName: msg.branchName || undefined,
            attachments: parseAttachments(msg.attachments),
            createdAt: msg.createdAt.toISOString(),
          }))}
          userId={userData.user.id}
          chatTitle={chatData.title || undefined}
          enableCollaboration={true}
        />
      </main>
    </div>
  );
}
