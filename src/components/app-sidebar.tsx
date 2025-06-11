"use client";

import { useState, useEffect } from "react";
import {
  Home,
  MessageSquarePlus,
  MessageSquare,
  LogOut,
  Settings,
  Trash2,
  MoreHorizontal,
  BarChart3,
  Brain,
  GitBranch,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "./theme-switcher";
import { useUserChats, useCreateChat, useDeleteChat } from "@/hooks/use-chats-query";

const navigationItems = [
  {
    title: "Home",
    url: "/protected",
    icon: Home,
  },
  {
    title: "Usage",
    url: "/protected/usage",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/protected/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [isMindMode, setIsMindMode] = useState(false);

  // React Query hooks
  const { data: chatSessions = [], isLoading } = useUserChats(userId || undefined);
  const createChatMutation = useCreateChat();
  const deleteChatMutation = useDeleteChat();

  // Get user ID
  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };

    getUser();
  }, []);

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const createNewChat = async () => {
    if (!userId) return;

    try {
      const newChat = await createChatMutation.mutateAsync({ 
        title: "New Chat" 
      });

      // Navigate to the new chat
      router.push(`/protected/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const deleteChatHandler = async (chatId: string) => {
    if (!userId) return;

    try {
      await deleteChatMutation.mutateAsync(chatId);
      
      // Check if we're currently viewing the deleted chat
      if (pathname === `/protected/chat/${chatId}`) {
        // Navigate to home page when the current chat is deleted
        router.push("/protected");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getChatDisplayInfo = (chat: typeof chatSessions[0]) => {
    const title = chat.title || "New Chat";
    const lastMessage = chat.messages[0]?.content || "No messages yet";
    const truncatedMessage =
      lastMessage.length > 20
        ? lastMessage.substring(0, 20) + "..."
        : lastMessage;

    return { title, lastMessage: truncatedMessage };
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="p-4">
          <Button
            onClick={createNewChat}
            className="w-full justify-start gap-2"
            size="sm"
            disabled={!userId || createChatMutation.isPending}
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Chat Sessions */}
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <SidebarMenuItem key={`skeleton-${index}`}>
                      <div className="flex items-center space-x-2 p-2">
                        <div className="w-4 h-4 bg-muted animate-pulse rounded"></div>
                        <div className="flex-1 space-y-1">
                          <div className="w-3/4 h-3 bg-muted animate-pulse rounded"></div>
                          <div className="w-1/2 h-2 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))
                ) : chatSessions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No chats yet. Create your first chat!
                  </div>
                ) : (
                  chatSessions.map((chat) => {
                    const { title } = getChatDisplayInfo(chat);
                    return (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton asChild>
                          <a
                            href={`/protected/chat/${chat.id}`}
                            className="flex-1 m-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <div className="flex-1 overflow-hidden">
                              <div className="truncate font-medium">{title}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(chat.updatedAt)}
                              </div>
                            </div>
                          </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction>
                              <MoreHorizontal className="h-4 w-4" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem
                              onClick={() => deleteChatHandler(chat.id)}
                              className="text-destructive focus:text-destructive"
                              disabled={deleteChatMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      {/* Mode Switcher */}
      <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-2">
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {isMindMode ? (
                      <>
                        <Brain className="h-4 w-4 text-purple-500" />
                        Mind Mode
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        Chat Mode
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {isMindMode 
                      ? "Visualize conversations as interactive mind maps with branching dialogues" 
                      : "Traditional linear chat interface for straightforward conversations"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>Chat</span>
                    </div>
                    <Switch
                      checked={isMindMode}
                      onCheckedChange={setIsMindMode}
                      className="data-[state=checked]:bg-purple-500"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Brain className="h-3 w-3" />
                      <span>Mind</span>
                    </div>
                  </div>
                  {isMindMode && (
                    <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300">
                        <GitBranch className="h-3 w-3" />
                        <span>Branch conversations with multiple AI models</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeSwitcher />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="w-full">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
