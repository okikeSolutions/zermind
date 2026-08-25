import { useState, useCallback, useMemo } from "react";
import { ChatConversation } from "@/components/chat-conversation";
import { MindMapView } from "@/components/mind-map/mind-map-view";
import { useChatModeStore } from "@/lib/store/chat-mode-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, MessageSquare, ArrowLeft, Lightbulb, LogIn } from "lucide-react";
import { DEMO_CONVERSATIONS } from "./demo-conversation-data";
import { sx } from "@/styles/sx";

interface DemoConversationViewProps {
  scenario: string;
  onUpgrade: () => void;
  onBack: () => void;
}

export function DemoConversationView({ scenario, onUpgrade, onBack }: DemoConversationViewProps) {
  const { mode, setMode } = useChatModeStore();
  const [userMessages, setUserMessages] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isMindMode = mode === "mind";

  const MAX_DEMO_MESSAGES = 5;
  const isLimitReached = userMessages >= MAX_DEMO_MESSAGES;

  // Generate a unique chatId for this demo session
  const demoChatId = useMemo(() => {
    return `demo-${scenario}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, [scenario]);

  const demoData = DEMO_CONVERSATIONS[scenario as keyof typeof DEMO_CONVERSATIONS];

  const handleMessageAttempt = useCallback(() => {
    if (isLimitReached) {
      setShowUpgradeModal(true);
      return false;
    }
    setUserMessages((prev) => prev + 1);
    return true;
  }, [isLimitReached]);

  if (!demoData) {
    return (
      <div {...sx("flex items-center justify-center w-full h-full px-4")}>
        <div {...sx("text-center max-w-md")}>
          <h1 {...sx("text-lg sm:text-xl font-semibold mb-2")}>Demo Not Found</h1>
          <p {...sx("text-sm text-muted-foreground mb-4")}>
            The requested demo scenario could not be found.
          </p>
          <Button onClick={onBack} className="w-full sm:w-auto min-h-[44px] touch-manipulation">
            Back to Demo Selection
          </Button>
        </div>
      </div>
    );
  }

  // Prepare messages for different views
  const mindMapMessages = demoData.messages.map((msg, index) => ({
    ...msg,
    xPosition: msg.xPosition || (index % 3) * 400,
    yPosition: msg.yPosition || Math.floor(index / 3) * 250,
    attachments: [],
  }));

  const conversationMessages = demoData.messages.map((msg, index) => ({
    ...msg,
    createdAt: new Date(Date.now() - (demoData.messages.length - index) * 60000),
    attachments: [],
    xPosition: msg.xPosition || 0,
    yPosition: msg.yPosition || 0,
    nodeType: msg.nodeType || ("conversation" as const),
    isCollapsed: msg.isCollapsed || false,
    isLocked: false,
    editedAt: undefined,
  }));

  if (mode === "mind") {
    return (
      <div {...sx("h-screen w-full py-16 sm:py-16 lg:py-20")}>
        <div {...sx("flex flex-col h-full")}>
          {/* Mind Mode Header */}
          <div
            {...sx(
              "border-b border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            )}
          >
            <div {...sx("flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 gap-2")}>
              <div {...sx("flex items-center gap-2 min-w-0 flex-1")}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  aria-label="Back to demo selection"
                  className="p-1 sm:p-2 min-h-[40px] min-w-[40px] touch-manipulation flex-shrink-0"
                >
                  <ArrowLeft {...sx("h-4 w-4")} />
                </Button>
                <Brain {...sx("h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0")} />
                <div {...sx("min-w-0 flex-1")}>
                  <h1 {...sx("font-semibold text-sm sm:text-base truncate")}>{demoData.title}</h1>
                  <p {...sx("text-xs text-muted-foreground hidden sm:block truncate")}>
                    Mind Mode Demo - {demoData.description}
                  </p>
                </div>
              </div>

              <div {...sx("flex items-center gap-1 sm:gap-2 flex-shrink-0")}>
                {/* Mode Toggle - Simplified for Mobile */}
                <div {...sx("flex items-center bg-muted rounded-full p-0.5 text-xs")}>
                  <button
                    onClick={() => setMode("chat")}
                    aria-label="Switch to chat mode"
                    {...sx(
                      `flex items-center gap-1 px-2 py-1 rounded-full transition-all touch-manipulation ${
                        !isMindMode ? "bg-background shadow-sm" : "text-muted-foreground"
                      }`,
                    )}
                  >
                    <MessageSquare {...sx("h-3 w-3")} />
                    <span {...sx("hidden sm:inline")}>Chat</span>
                  </button>
                  <button
                    onClick={() => setMode("mind")}
                    aria-label="Switch to mind mode"
                    {...sx(
                      `flex items-center gap-1 px-2 py-1 rounded-full transition-all touch-manipulation ${
                        isMindMode ? "bg-background shadow-sm" : "text-muted-foreground"
                      }`,
                    )}
                  >
                    <Brain {...sx("h-3 w-3")} />
                    <span {...sx("hidden sm:inline")}>Mind</span>
                  </button>
                </div>

                {/* Badges - Responsive */}
                <div {...sx("hidden sm:flex items-center gap-1")}>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs"
                  >
                    <Brain {...sx("h-3 w-3 mr-1")} />
                    Mind
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Demo
                  </Badge>
                </div>
              </div>
            </div>

            {/* Mobile-only mode indicator */}
            <div {...sx("sm:hidden px-4 pb-2")}>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs"
              >
                <Brain {...sx("h-3 w-3 mr-1")} />
                Mind Mode Demo
              </Badge>
            </div>
          </div>

          {/* Usage Progress */}
          <div {...sx("px-2 sm:px-4 py-2 border-b bg-muted/30")}>
            <div {...sx("flex items-center justify-between text-xs sm:text-sm")}>
              <span {...sx("text-muted-foreground")}>Demo Messages</span>
              <span {...sx(`font-medium ${isLimitReached ? "text-destructive" : ""}`)}>
                {userMessages} / {MAX_DEMO_MESSAGES}
              </span>
            </div>
            <Progress
              value={(userMessages / MAX_DEMO_MESSAGES) * 100}
              className={`mt-1 h-1.5 sm:h-2 ${isLimitReached ? "bg-destructive/20" : ""}`}
            />
          </div>

          {/* Mind Map View */}
          <div {...sx("flex-1 overflow-hidden relative")}>
            <MindMapView
              messages={mindMapMessages}
              onResumeConversation={() => {
                if (!handleMessageAttempt()) return;
              }}
              onCreateBranch={() => {
                if (!handleMessageAttempt()) return;
              }}
              onCreateMultiModelBranch={() => {
                if (!handleMessageAttempt()) return;
              }}
            />

            {/* Demo Overlay - Mobile Optimized */}
            <div
              {...sx("absolute bottom-2 left-2 right-2 sm:left-4 sm:right-4 pointer-events-none")}
            >
              <Card className="bg-background/95 backdrop-blur border-primary/20">
                <CardContent className="p-2 sm:p-3">
                  <div {...sx("flex items-start gap-2 text-xs sm:text-sm")}>
                    <Lightbulb
                      {...sx("h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0 mt-0.5")}
                    />
                    <div>
                      <span {...sx("font-medium")}>Mind Mode Demo:</span>
                      <span {...sx("text-muted-foreground ml-1")}>
                        See conversations as visual mind maps. Switch to chat mode for traditional
                        view.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Traditional Chat Mode
  return (
    <div {...sx("h-screen w-full py-16 sm:py-16 lg:py-20")}>
      <div {...sx("flex flex-col w-full h-full")}>
        {/* Chat Mode Header */}
        <div
          {...sx(
            "border-b border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          )}
        >
          <div {...sx("flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 gap-2")}>
            <div {...sx("flex items-center gap-2 min-w-0 flex-1")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Back to demo selection"
                className="p-1 sm:p-2 min-h-[40px] min-w-[40px] touch-manipulation flex-shrink-0"
              >
                <ArrowLeft {...sx("h-4 w-4")} />
              </Button>
              <MessageSquare {...sx("h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0")} />
              <div {...sx("min-w-0 flex-1")}>
                <h1 {...sx("font-semibold text-sm sm:text-base truncate")}>{demoData.title}</h1>
                <p {...sx("text-xs text-muted-foreground hidden sm:block truncate")}>
                  Chat Mode Demo - {demoData.description}
                </p>
              </div>
            </div>

            <div {...sx("flex items-center gap-1 sm:gap-2 flex-shrink-0")}>
              {/* Mode Toggle - Simplified for Mobile */}
              <div {...sx("flex items-center bg-muted rounded-full p-0.5 text-xs")}>
                <button
                  onClick={() => setMode("chat")}
                  aria-label="Switch to chat mode"
                  {...sx(
                    `flex items-center gap-1 px-2 py-1 rounded-full transition-all touch-manipulation ${
                      !isMindMode ? "bg-background shadow-sm" : "text-muted-foreground"
                    }`,
                  )}
                >
                  <MessageSquare {...sx("h-3 w-3")} />
                  <span {...sx("hidden sm:inline")}>Chat</span>
                </button>
                <button
                  onClick={() => setMode("mind")}
                  aria-label="Switch to mind mode"
                  {...sx(
                    `flex items-center gap-1 px-2 py-1 rounded-full transition-all touch-manipulation ${
                      isMindMode ? "bg-background shadow-sm" : "text-muted-foreground"
                    }`,
                  )}
                >
                  <Brain {...sx("h-3 w-3")} />
                  <span {...sx("hidden sm:inline")}>Mind</span>
                </button>
              </div>

              {/* Badges - Responsive */}
              <div {...sx("hidden sm:flex items-center gap-1")}>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs"
                >
                  <MessageSquare {...sx("h-3 w-3 mr-1")} />
                  Chat
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Demo
                </Badge>
              </div>
            </div>
          </div>

          {/* Mobile-only mode indicator */}
          <div {...sx("sm:hidden px-4 pb-2")}>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs"
            >
              <MessageSquare {...sx("h-3 w-3 mr-1")} />
              Chat Mode Demo
            </Badge>
          </div>
        </div>

        {/* Usage Progress */}
        <div {...sx("px-2 sm:px-4 py-2 border-b bg-muted/30")}>
          <div {...sx("flex items-center justify-between text-xs sm:text-sm")}>
            <span {...sx("text-muted-foreground")}>Demo Messages</span>
            <span {...sx(`font-medium ${isLimitReached ? "text-destructive" : ""}`)}>
              {userMessages} / {MAX_DEMO_MESSAGES}
            </span>
          </div>
          <Progress
            value={(userMessages / MAX_DEMO_MESSAGES) * 100}
            className={`mt-1 h-1.5 sm:h-2 ${isLimitReached ? "bg-destructive/20" : ""}`}
          />
        </div>

        {/* Traditional Chat Interface */}
        <div {...sx("flex-1 overflow-hidden")}>
          <ChatConversation
            chatId={demoChatId}
            initialMessages={conversationMessages}
            userId="demo-user"
            chatTitle={demoData.title}
            isSharedView={false}
            isDemo={true}
            onSendMessage={handleMessageAttempt}
          />
        </div>

        {/* Upgrade Modal - Mobile Optimized */}
        {showUpgradeModal && (
          <div
            {...sx("fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4")}
          >
            <Card className="w-full max-w-sm sm:max-w-md mx-auto">
              <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                <h3 {...sx("text-lg sm:text-xl font-semibold")}>Demo Limit Reached</h3>
                <p {...sx("text-sm text-muted-foreground leading-relaxed")}>
                  You&apos;ve reached the 5-message demo limit. Sign in to continue with unlimited
                  conversations!
                </p>
                <div {...sx("flex flex-col gap-2 sm:gap-3")}>
                  <Button
                    onClick={onUpgrade}
                    className="w-full bg-primary hover:bg-primary/80 min-h-[44px] text-sm sm:text-base touch-manipulation"
                  >
                    <LogIn {...sx("h-4 w-4 mr-2")} />
                    Sign In to Continue
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full min-h-[44px] text-sm sm:text-base touch-manipulation"
                  >
                    Back to Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
