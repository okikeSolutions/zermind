import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { ChatConversation } from "@/components/chat-conversation";
import { Badge } from "@/components/ui/badge";
import { Share, MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

interface SharePageProps {
  params: Promise<{
    shareId: string;
  }>;
}

type SharedMessage = {
  _id: string;
  role: string;
  content: string;
  model?: string;
  parentId?: string;
  branchName?: string;
  attachments?: Array<{
    id: string;
    name: string;
    mimeType: string;
    size: number;
    url: string;
    type: "image" | "document";
  }>;
  xPosition: number;
  yPosition: number;
  nodeType: "conversation" | "branching_point" | "insight";
  isCollapsed: boolean;
  isLocked: boolean;
  lastEditedBy?: string;
  editedAt?: number;
  createdAt: number;
};

function convexClient() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
}

async function getSharedChat(shareId: string) {
  return await convexClient().query(api.chats.getShared, { shareId });
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { shareId } = await params;
  const chatData = await getSharedChat(shareId);

  if (!chatData) {
    return {
      title: "Shared Chat Not Found | Zermind",
      description: "This shared chat link is invalid or has been removed.",
    };
  }

  return {
    title: `${chatData.title || "Shared Chat"} | Zermind`,
    description: `A shared conversation with ${chatData.messages.length} messages on Zermind.`,
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { shareId } = await params;
  const chatData = await getSharedChat(shareId);

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border-destructive bg-destructive/10 max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h1 className="text-lg font-semibold text-destructive">Shared Chat Not Found</h1>
              <p className="text-sm text-muted-foreground mt-2">
                This shared chat link is invalid or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-background/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Share className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">{chatData.title || "Shared Chat"}</h1>
              <p className="text-sm text-muted-foreground">Shared conversation • Read-only</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {chatData.messages.length} messages
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatConversation
          chatId={chatData._id}
          initialMessages={chatData.messages.map((msg: SharedMessage) => ({
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
            editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
            createdAt: new Date(msg.createdAt),
          }))}
          userId=""
          chatTitle={chatData.title || undefined}
          isSharedView={true}
        />
      </div>
    </div>
  );
}
