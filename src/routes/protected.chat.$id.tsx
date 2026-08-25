import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DualModeChat } from "@/components/dual-mode-chat";
import { fetchAuthQuery } from "@/lib/auth-server";
import { sx } from "@/styles/sx";

const getChat = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(({ data }) =>
    fetchAuthQuery(api.chats.getWithMessages, {
      chatId: data.id as Id<"chats">,
    }),
  );

export const Route = createFileRoute("/protected/chat/$id")({
  loader: async ({ params }) => {
    const chat = await getChat({ data: { id: params.id } });
    if (!chat) {
      throw redirect({ to: "/protected" });
    }
    return chat;
  },
  component: ChatRoute,
});

function ChatRoute() {
  const chatData = Route.useLoaderData();
  const { id } = Route.useParams();

  return (
    <div {...sx("flex flex-col h-full")}>
      <DualModeChat
        chatId={id}
        initialMessages={chatData.messages.map((message) => ({
          id: message._id,
          role: message.role === "user" ? "user" : "assistant",
          content: message.content,
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
        userId={chatData.userId}
        chatTitle={chatData.title || undefined}
      />
    </div>
  );
}
