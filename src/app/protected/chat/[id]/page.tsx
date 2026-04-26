import { redirect } from "next/navigation";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";
import { DualModeChat } from "@/components/dual-mode-chat";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const signedIn = await isAuthenticated();

  if (!signedIn) {
    redirect("/auth/login");
  }

  const chatData = await fetchAuthQuery(api.chats.getWithMessages, {
    chatId: id as Id<"chats">,
  });

  if (!chatData) {
    redirect("/protected");
  }

  return (
    <div className="flex flex-col h-full">
      <DualModeChat
        chatId={id}
        initialMessages={chatData.messages.map((msg) => ({
          id: msg._id,
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
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
        userId={chatData.userId}
        chatTitle={chatData.title || undefined}
      />
    </div>
  );
}
