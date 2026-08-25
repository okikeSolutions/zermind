import { useRouter } from "@/lib/navigation";
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
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
export default function ProtectedPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthUser();
  const createChatMutation = useCreateChat();

  const createNewChat = async () => {
    if (!user?.id) return;

    try {
      const newChat = await createChatMutation.mutateAsync({
        title: m.copy_new_chat(),
      });

      // Navigate to the new chat
      router.push(`/protected/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error(getFriendlyErrorMessage(error, m.copy_failed_to_create_chat()));
    }
  };

  if (isLoading) {
    return (
      <div {...sx("flex h-full items-center justify-center p-4")}>
        <div {...sx("text-center")}>
          <div
            {...sx("animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4")}
          ></div>
          <p {...sx("text-muted-foreground")}>{m.copy_loading()}</p>
        </div>
      </div>
    );
  }

  return (
    <div {...sx("p-4 sm:p-6 lg:p-8 min-h-full")}>
      <div {...sx("max-w-4xl mx-auto text-center space-y-6 sm:space-y-8")}>
        <div {...sx("space-y-2 sm:space-y-4")}>
          <h1 {...sx("text-2xl sm:text-3xl lg:text-4xl font-bold")}>
            {m.copy_welcome_to_zermind()}
          </h1>
          <p {...sx("text-muted-foreground text-base sm:text-lg")}>
            {m.copy_hello()} <span {...sx("font-semibold")}>{user?.email}</span>
          </p>
          <p {...sx("text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2")}>
            {m.copy_the_first_ai_chat_with()}{" "}
            <span {...sx("font-semibold text-purple-600")}>{m.copy_mind_mode()}</span> - where
            conversations become visual mind maps.
          </p>
        </div>

        {/* Mode Comparison */}
        <div {...sx("grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6")}>
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3 sm:pb-6">
              <div {...sx("flex items-center gap-2 flex-wrap")}>
                <MessageSquare {...sx("h-4 w-4 sm:h-5 sm:w-5 text-blue-500")} />
                <CardTitle className="text-blue-700 dark:text-blue-300 text-base sm:text-lg">
                  {m.copy_chat_mode()}
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  {m.copy_default()}
                </Badge>
              </div>
              <CardDescription className="text-start text-sm">
                {m.copy_traditional_linear_conversations()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul {...sx("text-sm space-y-2 text-muted-foreground")}>
                <li {...sx("flex items-center gap-2")}>
                  <MessageSquare {...sx("h-3 w-3 flex-shrink-0")} />{" "}
                  {m.copy_linear_chat_interface()}
                </li>
                <li {...sx("flex items-center gap-2")}>
                  <Bot {...sx("h-3 w-3 flex-shrink-0")} /> {m.copy_multiple_ai_models()}
                </li>
                <li {...sx("flex items-center gap-2")}>
                  <Zap {...sx("h-3 w-3 flex-shrink-0")} /> {m.copy_real_time_streaming()}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader className="pb-3 sm:pb-6">
              <div {...sx("flex items-center gap-2 flex-wrap")}>
                <Brain {...sx("h-4 w-4 sm:h-5 sm:w-5 text-purple-500")} />
                <CardTitle className="text-purple-700 dark:text-purple-300 text-base sm:text-lg">
                  {m.copy_mind_mode()}
                </CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  {m.copy_new()}
                </Badge>
              </div>
              <CardDescription className="text-start text-sm">
                {m.copy_revolutionary_conversation_visualization()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul {...sx("text-sm space-y-2 text-muted-foreground")}>
                <li {...sx("flex items-center gap-2")}>
                  <GitBranch {...sx("h-3 w-3 flex-shrink-0")} /> {m.copy_branching_conversations()}
                </li>
                <li {...sx("flex items-center gap-2")}>
                  <Zap {...sx("h-3 w-3 flex-shrink-0")} /> {m.copy_resume_from_any_node()}
                </li>
                <li {...sx("flex items-center gap-2")}>
                  <Users {...sx("h-3 w-3 flex-shrink-0")} /> {m.copy_multi_model_debates()}
                </li>
                <li {...sx("flex items-center gap-2")}>
                  <Share {...sx("h-3 w-3 flex-shrink-0")} /> {m.copy_shareable_mind_maps()}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Section */}
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
              <MessageSquarePlus {...sx("h-4 w-4 sm:h-5 sm:w-5")} /> {m.copy_ready_to_get_started()}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {m.copy_create_your_first_chat_and_experience_both_chat_and_mind_mode_in()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <Button
              onClick={createNewChat}
              size="lg"
              className="w-full sm:w-auto mx-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base"
              disabled={!user?.id || createChatMutation.isPending}
            >
              <MessageSquarePlus {...sx("h-4 w-4")} />
              {createChatMutation.isPending ? m.copy_creating() : m.copy_start_new_chat()}
              <ArrowRight {...sx("h-4 w-4")} />
            </Button>
            <p {...sx("text-xs text-muted-foreground")}>
              {m.copy_your_chat_will_be_saved_automatically_and_accessible_from_the_si()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
