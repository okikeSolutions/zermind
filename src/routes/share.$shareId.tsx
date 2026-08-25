import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ConvexHttpClient } from "convex/browser";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import { ChatConversation } from "@/components/chat-conversation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, MessageSquare, Share } from "lucide-react";
import { absoluteUrl, seo } from "@/lib/seo";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const getSharedChat = createServerFn({ method: "GET" })
  .validator(z.object({ shareId: z.string() }))
  .handler(({ data }) => {
    const client = new ConvexHttpClient(
      (process.env.VITE_CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL)!,
    );
    return client.query(api.chats.getShared, data);
  });

export const Route = createFileRoute("/share/$shareId")({
  loader: async ({ params }) => {
    const sharedChat = await getSharedChat({ data: params });
    if (!sharedChat) throw notFound();
    return sharedChat;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return seo({
        title: m.copy_shared_chat_not_found_zermind(),
        description: m.copy_this_shared_chat_is_unavailable(),
        path: `/share/${params.shareId}`,
        noIndex: true,
      });
    }

    const title = `${loaderData.title || m.copy_shared_chat()} | Zermind`;
    const description = m.copy_shared_conversation_description({
      count: loaderData.messages.length,
    });
    const path = `/share/${params.shareId}`;

    return seo({
      title,
      description,
      path,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: loaderData.title || m.copy_shared_zermind_conversation(),
        description,
        url: absoluteUrl(path),
        isPartOf: {
          "@type": "WebSite",
          name: "Zermind",
          url: absoluteUrl("/"),
        },
      },
    });
  },
  notFoundComponent: SharedChatNotFound,
  component: SharedChatRoute,
});

function SharedChatNotFound() {
  return (
    <div {...sx("min-h-screen flex items-center justify-center p-4")}>
      <Card className="border-destructive bg-destructive/10 max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <AlertCircle {...sx("h-12 w-12 text-destructive mx-auto")} />
          <h1 {...sx("text-lg font-semibold text-destructive")}>
            {m.copy_shared_chat_not_found()}
          </h1>
          <p {...sx("text-sm text-muted-foreground")}>
            {m.copy_this_shared_chat_link_is_invalid_or_has_been_removed()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SharedChatRoute() {
  const chatData = Route.useLoaderData();
  return (
    <div {...sx("flex flex-col h-full")}>
      <div {...sx("border-b p-4 bg-background/50 backdrop-blur")}>
        <div {...sx("flex items-center justify-between")}>
          <div {...sx("flex items-center gap-3")}>
            <Share {...sx("h-5 w-5 text-primary")} />
            <div>
              <h1 {...sx("text-lg font-semibold")}>{chatData.title || m.copy_shared_chat()}</h1>
              <p {...sx("text-sm text-muted-foreground")}>
                {m.copy_shared_conversation_read_only()}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <MessageSquare {...sx("h-3 w-3")} />
            {chatData.messages.length} messages
          </Badge>
        </div>
      </div>
      <div {...sx("flex-1 overflow-hidden")}>
        <ChatConversation
          chatId={chatData._id}
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
            editedAt: message.editedAt ? new Date(message.editedAt) : undefined,
            createdAt: new Date(message.createdAt),
          }))}
          userId=""
          chatTitle={chatData.title || undefined}
          isSharedView
        />
      </div>
    </div>
  );
}
