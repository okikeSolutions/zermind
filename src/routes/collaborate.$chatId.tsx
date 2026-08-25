import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DualModeChat } from "@/components/dual-mode-chat";
import { fetchAuthMutation } from "@/lib/auth-server";
import { seo } from "@/lib/seo";
import { sx } from "@/styles/sx";

const joinChat = createServerFn({ method: "POST" })
  .validator(z.object({ chatId: z.string() }))
  .handler(({ data }) =>
    fetchAuthMutation(api.collaboration.joinAndGetChat, {
      chatId: data.chatId as Id<"chats">,
    }),
  );

export const Route = createFileRoute("/collaborate/$chatId")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/auth/login" });
    }
    return {};
  },
  loader: async ({ params }) => {
    const result = await joinChat({ data: { chatId: params.chatId } });
    if (!result) {
      throw redirect({ to: "/protected", search: { error: "access-denied" } });
    }
    return result;
  },
  head: ({ params }) =>
    seo({
      title: "Collaborative chat | Zermind",
      description: "A private collaborative conversation on Zermind.",
      path: `/collaborate/${params.chatId}`,
      noIndex: true,
    }),
  component: CollaborationRoute,
});

function CollaborationRoute() {
  const { chat, userId, userRole } = Route.useLoaderData();
  const { chatId } = Route.useParams();

  return (
    <div {...sx("min-h-screen bg-background")}>
      <div {...sx("border-b")}>
        <div {...sx("container mx-auto px-4 py-3 flex justify-between items-center")}>
          <div {...sx("text-sm text-muted-foreground")}>
            <span {...sx("font-medium")}>Collaborative Chat</span>
            {chat.title ? <span>{` • ${chat.title}`}</span> : null}
          </div>
          <span {...sx("text-xs text-muted-foreground capitalize")}>{userRole}</span>
        </div>
      </div>
      <main {...sx("h-[calc(100vh-73px)]")}>
        <DualModeChat
          chatId={chatId}
          initialMessages={chat.messages.map((message) => ({
            id: message._id,
            content: message.content,
            role: message.role === "user" ? "user" : "assistant",
            model: message.model || undefined,
            parentId: message.parentId || undefined,
            branchName: message.branchName || undefined,
            attachments: message.attachments || [],
            xPosition: message.xPosition,
            yPosition: message.yPosition,
            nodeType: message.nodeType,
            isCollapsed: message.isCollapsed,
            isLocked: message.isLocked,
            lastEditedBy: message.lastEditedBy || undefined,
            editedAt: message.editedAt ? new Date(message.editedAt).toISOString() : undefined,
            createdAt: new Date(message.createdAt).toISOString(),
          }))}
          userId={userId}
          chatTitle={chat.title || undefined}
          enableCollaboration
        />
      </main>
    </div>
  );
}
