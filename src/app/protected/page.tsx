"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  MessageSquare,
  GitBranch,
  Zap,
  Users,
  Share,
  Bot,
  MessageSquarePlus,
  ArrowRight,
} from "lucide-react";
import { useCreateChat } from "@/hooks/use-chats-query";
import { useAuthUser } from "@/hooks/use-auth";
import { getFriendlyErrorMessage } from "@/lib/rate-limit-error";
import { toast } from "sonner";

export default function ProtectedPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthUser();
  const createChatMutation = useCreateChat();

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
      toast.error(getFriendlyErrorMessage(error, "Failed to create chat"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome to Zermind</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Hello <span className="font-semibold">{user?.email}</span>
          </p>
          <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">
            The first AI chat with <span className="font-semibold text-purple-600">Mind Mode</span>{" "}
            - where conversations become visual mind maps.
          </p>
        </div>

        {/* Mode Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <CardTitle className="text-blue-700 dark:text-blue-300 text-base sm:text-lg">
                  Chat Mode
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  Default
                </Badge>
              </div>
              <CardDescription className="text-start text-sm">
                Traditional linear conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 flex-shrink-0" />
                  Linear chat interface
                </li>
                <li className="flex items-center gap-2">
                  <Bot className="h-3 w-3 flex-shrink-0" />
                  Multiple AI models
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3 flex-shrink-0" />
                  Real-time streaming
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                <CardTitle className="text-purple-700 dark:text-purple-300 text-base sm:text-lg">
                  Mind Mode
                </CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  New!
                </Badge>
              </div>
              <CardDescription className="text-start text-sm">
                Revolutionary conversation visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <GitBranch className="h-3 w-3 flex-shrink-0" />
                  Branching conversations
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3 flex-shrink-0" />
                  Resume from any node
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  Multi-model debates
                </li>
                <li className="flex items-center gap-2">
                  <Share className="h-3 w-3 flex-shrink-0" />
                  Shareable mind maps
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Section */}
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
              <MessageSquarePlus className="h-4 w-4 sm:h-5 sm:w-5" />
              Ready to get started?
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Create your first chat and experience both Chat and Mind Mode interfaces. Switch
              between modes using the toggle in the sidebar anytime!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <Button
              onClick={createNewChat}
              size="lg"
              className="w-full sm:w-auto mx-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base"
              disabled={!user?.id || createChatMutation.isPending}
            >
              <MessageSquarePlus className="h-4 w-4" />
              {createChatMutation.isPending ? "Creating..." : "Start New Chat"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Your chat will be saved automatically and accessible from the sidebar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
