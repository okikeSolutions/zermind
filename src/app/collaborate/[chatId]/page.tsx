import { redirect } from "next/navigation";
import { fetchAuthMutation, isAuthenticated } from "@/lib/auth-server";
import { DualModeChat } from "@/components/dual-mode-chat";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface CollaborationPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function CollaborationPage({ params }: CollaborationPageProps) {
  const signedIn = await isAuthenticated();
  if (!signedIn) {
    redirect("/auth/login");
  }

  const { chatId } = await params;
  const result = await fetchAuthMutation(api.collaboration.joinAndGetChat, {
    chatId: chatId as Id<"chats">,
  });

  if (!result) {
    redirect("/protected?error=access-denied");
  }

  const { chat, userId, userRole } = result;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
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
          <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
        </div>
      </div>

      <main className="h-[calc(100vh-73px)]">
        <DualModeChat
          chatId={chatId}
          initialMessages={chat.messages.map((msg) => ({
            id: msg._id,
            content: msg.content,
            role: msg.role === "user" ? "user" : "assistant",
            model: msg.model || undefined,
            parentId: msg.parentId || undefined,
            branchName: msg.branchName || undefined,
            attachments: msg.attachments || [],
            xPosition: msg.xPosition,
            yPosition: msg.yPosition,
            nodeType: msg.nodeType,
            isCollapsed: msg.isCollapsed,
            isLocked: msg.isLocked,
            lastEditedBy: msg.lastEditedBy || undefined,
            editedAt: msg.editedAt ? new Date(msg.editedAt).toISOString() : undefined,
            createdAt: new Date(msg.createdAt).toISOString(),
          }))}
          userId={userId}
          chatTitle={chat.title || undefined}
          enableCollaboration={true}
        />
      </main>
    </div>
  );
}
