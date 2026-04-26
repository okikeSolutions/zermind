"use client";

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
import { authClient } from "@/lib/auth-client";
import { ThemeSwitcher } from "./theme-switcher";
import { FeedbackDialog } from "./feedback-dialog";
import { useUserChats, useCreateChat, useDeleteChat } from "@/hooks/use-chats-query";
import { useChatModeStore } from "@/lib/store/chat-mode-store";
import { useAuthUser } from "@/hooks/use-auth";
import Link from "next/link";

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
  const { user } = useAuthUser();
  const { mode, setMode } = useChatModeStore();
  const isMindMode = mode === "mind";

  // React Query hooks
  const { data: chatSessions = [], isLoading } = useUserChats(user?.id || undefined);
  const createChatMutation = useCreateChat();
  const deleteChatMutation = useDeleteChat();

  const logout = async () => {
    try {
      await authClient.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const createNewChat = async () => {
    if (!user?.id) return;

    try {
      const newChat = await createChatMutation.mutateAsync({
        title: "New Chat",
      });

      // Navigate to the new chat
      router.push(`/protected/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const deleteChatHandler = async (chatId: string) => {
    if (!user?.id) return;

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
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getChatDisplayInfo = (chat: (typeof chatSessions)[0]) => {
    const rawTitle = chat.title || "New Chat";
    const title = rawTitle.length > 15 ? rawTitle.substring(0, 15) + "..." : rawTitle;
    const lastMessage = chat.messages[0]?.content || "No messages yet";
    const truncatedMessage =
      lastMessage.length > 20 ? lastMessage.substring(0, 20) + "..." : lastMessage;

    return { title, lastMessage: truncatedMessage };
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="p-3 sm:p-4">
          <div className=" border rounded-lg p-1.5 sm:p-2">
            <Button asChild variant="ghost" size="sm" className="hover:bg-transparent">
              <Link href="/protected" className="flex items-center space-x-2">
                <span className="font-bold text-lg bg-primary bg-clip-text text-transparent">
                  Zermind
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <Button
            onClick={createNewChat}
            className="w-full justify-start gap-2 h-9 sm:h-10"
            size="sm"
            disabled={!user?.id || createChatMutation.isPending}
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="text-sm">New Chat</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs sm:text-sm">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-9 sm:h-10">
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Chat Sessions */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs sm:text-sm">Recent Chats</SidebarGroupLabel>
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
                  <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground">
                    No chats yet. Create your first chat!
                  </div>
                ) : (
                  chatSessions.map((chat) => {
                    const { title } = getChatDisplayInfo(chat);
                    return (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          asChild
                          className="h-auto min-h-[2.5rem] sm:min-h-[3rem] py-2"
                        >
                          <Link href={`/protected/chat/${chat.id}`} className="flex-1 m-2">
                            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 overflow-hidden min-w-0">
                              <div className="truncate font-medium text-sm">{title}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(chat.updatedAt)}
                              </div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem
                              onClick={() => deleteChatHandler(chat.id)}
                              className="text-destructive focus:text-destructive text-sm"
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
          <div className="px-2 sm:px-2">
            {/* Mobile: Compact switch only */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between p-3 border border-dashed rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {isMindMode ? (
                    <>
                      <Brain className="h-4 w-4 text-purple-500" />
                      Mind
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      Chat
                    </>
                  )}
                </div>
                <Switch
                  checked={isMindMode}
                  onCheckedChange={(checked) => setMode(checked ? "mind" : "chat")}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>

            {/* Desktop: Full card */}
            <Card className="border-dashed hidden sm:block">
              <CardHeader className="pb-3 px-4 pt-4">
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
                <CardDescription className="text-xs leading-relaxed">
                  {isMindMode
                    ? "Interactive mind maps with branching dialogues"
                    : "Traditional linear chat interface"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>Chat</span>
                  </div>
                  <Switch
                    checked={isMindMode}
                    onCheckedChange={(checked) => setMode(checked ? "mind" : "chat")}
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Brain className="h-3 w-3" />
                    <span>Mind</span>
                  </div>
                </div>
                {isMindMode && (
                  <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300">
                      <GitBranch className="h-3 w-3" />
                      <span>Branch with multiple AI models</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter className="border-t p-2 sm:p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="mb-2">
              <FeedbackDialog>
                <Button variant="outline" className="w-full h-9 sm:h-10 px-2 sm:px-3" size="sm">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm ml-1.5 sm:ml-2 truncate">Feedback</span>
                </Button>
              </FeedbackDialog>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="mb-2">
              <ThemeSwitcher />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="w-full h-9 sm:h-10">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
