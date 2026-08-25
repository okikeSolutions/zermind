import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Sparkles,
  Zap,
  GitBranch,
  Network,
  Users,
  Share2,
  Map as MapIcon,
  Eye,
  RefreshCw,
  PlayCircle,
} from "lucide-react";
import Link, { useRouter } from "@/lib/navigation";
import { FAQItem } from "@/components/faq-item";
import { OnboardingTooltip, useOnboarding } from "@/components/onboarding-tooltip";
import { homeFaqs } from "@/lib/site-content";
import { sx } from "@/styles/sx";

interface ChatInterfaceProps {
  isAuthenticated: boolean;
}

// GitHub Icon Component
const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
  </svg>
);

export function ChatInterface({ isAuthenticated }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!message.trim()) return;

    try {
      // TODO: Create a new chat and navigate to it
      // For now, redirect to the protected route (will become chat interface)
      router.push("/protected");
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const modelProviders = [
    {
      name: "GPT-4",
      provider: "OpenAI",
      color: "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900",
    },
    {
      name: "Claude 3",
      provider: "Anthropic",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    {
      name: "Llama 3.1",
      provider: "Meta",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
  ];

  const handleTryDemo = () => {
    router.push("/demo");
  };

  return (
    <div
      {...sx(
        "w-full max-w-4xl space-y-6 sm:space-y-8 pt-20 sm:pt-24 lg:pt-32 pb-8 sm:pb-16 lg:pb-32 px-4 sm:px-6",
      )}
    >
      {/* Header */}
      <div {...sx("text-center space-y-3 sm:space-y-4")}>
        <div {...sx("flex items-center justify-center space-x-2")}>
          <h1
            {...sx(
              "text-2xl sm:text-3xl lg:text-4xl font-bold bg-primary bg-clip-text text-transparent",
            )}
          >
            Zermind
          </h1>
        </div>
        <p {...sx("text-muted-foreground text-base sm:text-lg")}>
          Your open-source AI chat companion
        </p>
        {!isAuthenticated && (
          <div {...sx("space-y-3")}>
            <Button
              onClick={handleTryDemo}
              variant="outline"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none h-10 sm:h-12 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 min-h-[44px] touch-manipulation"
            >
              <PlayCircle {...sx("h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0")} />
              <span {...sx("text-center leading-tight")}>
                Try Interactive Demo
                <br {...sx("sm:hidden")} />
                <span {...sx("sm:ml-1")}>(No Sign-up Required)</span>
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Card */}
      <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm">
        <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
          <h2
            {...sx("flex items-center justify-center space-x-2 text-lg sm:text-xl font-semibold")}
          >
            <span>Start Chatting</span>
          </h2>
          <CardDescription className="text-sm sm:text-base">
            {isAuthenticated
              ? "Choose from multiple AI models and start your conversation"
              : "Sign in to access multiple AI models and start chatting"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Available Models */}
          <div {...sx("space-y-2 sm:space-y-3")}>
            <h3 {...sx("text-sm font-medium text-muted-foreground flex items-center gap-2")}>
              <Zap {...sx("h-4 w-4")} />
              <span>Available Models</span>
            </h3>
            <div {...sx("flex flex-wrap gap-1.5 sm:gap-2")}>
              {modelProviders.map((model, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`${model.color} ${
                    isAuthenticated
                      ? "hover:scale-105 cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  } transition-transform text-xs sm:text-sm`}
                >
                  {model.name}
                  <span {...sx("ml-1 text-xs opacity-70")}>by {model.provider}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div {...sx("space-y-3 sm:space-y-4")}>
            <div {...sx("relative")}>
              <Input
                placeholder={
                  isAuthenticated
                    ? "What would you like to chat about today?"
                    : "Sign in to start chatting..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!isAuthenticated}
                className="pr-12 h-10 sm:h-12 text-sm sm:text-base border-2 border-primary/20 focus:border-primary/40 transition-colors disabled:opacity-60"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (message.trim() || !isAuthenticated)) {
                    handleStartChat();
                  }
                }}
              />

              <div {...sx("absolute right-3 top-1/2 -translate-y-1/2")}>
                <MessageCircle {...sx("h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground")} />
              </div>
            </div>

            <Button
              onClick={handleStartChat}
              disabled={!!isAuthenticated && !message.trim()}
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium bg-primary hover:bg-primary/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
            >
              <Sparkles {...sx("mr-2 h-4 w-4 sm:h-5 sm:w-5")} />
              {!isAuthenticated ? "Sign In to Start Chatting" : "Start Conversation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Features */}
      <div {...sx("space-y-6 sm:space-y-8 py-8 sm:py-16")}>
        <div {...sx("text-center space-y-1 sm:space-y-2")}>
          <h2 {...sx("text-2xl sm:text-3xl font-bold")}>Branching AI conversations</h2>
          <p {...sx("text-muted-foreground text-base sm:text-lg")}>
            Explore conversations as visual trees and continue from any earlier message
          </p>
        </div>

        {/* Core Innovation Features */}
        <div
          {...sx("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2 gap-4 sm:gap-6")}
        >
          <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm sm:col-span-2">
            <CardContent className="p-4 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div {...sx("relative")}>
                <MapIcon {...sx("h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto")} />
              </div>
              <h3 {...sx("font-bold text-base sm:text-lg")}>Mind Mode</h3>
              <p {...sx("text-sm text-muted-foreground")}>
                Transform conversations into interactive mind maps. Visualize how ideas connect and
                evolve in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm sm:col-span-2">
            <CardContent className="p-4 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div {...sx("relative")}>
                <GitBranch {...sx("h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto")} />
              </div>
              <h3 {...sx("font-bold text-base sm:text-lg")}>Multi-Model Branching</h3>
              <p {...sx("text-sm text-muted-foreground")}>
                Ask the same question to different AI models and see their responses branch
                visually. Compare approaches side-by-side.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm sm:col-span-2">
            <CardContent className="p-4 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div {...sx("relative")}>
                <RefreshCw {...sx("h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto")} />
              </div>
              <h3 {...sx("font-bold text-base sm:text-lg")}>Resumable Conversations</h3>
              <p {...sx("text-sm text-muted-foreground")}>
                Click any node in your conversation tree to continue from that exact point. Never
                lose context again.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm sm:col-span-3">
            <CardHeader className="text-center pb-2 sm:pb-3">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                Beta
              </Badge>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 text-center space-y-2 sm:space-y-3 pt-0">
              <div {...sx("relative")}>
                <Users {...sx("h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto")} />
              </div>
              <h3 {...sx("font-bold text-base sm:text-lg")}>Real-time Collaboration</h3>
              <p {...sx("text-sm text-muted-foreground")}>
                Collaborate with your team in real-time. Build mind maps together and explore ideas
                collectively.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm sm:col-span-3">
            <CardHeader className="text-center pb-2 sm:pb-3">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                Beta
              </Badge>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 text-center space-y-2 sm:space-y-3 pt-0">
              <div {...sx("relative")}>
                <Share2 {...sx("h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto")} />
              </div>
              <h3 {...sx("font-bold text-base sm:text-lg")}>Shareable Mind Maps</h3>
              <p {...sx("text-sm text-muted-foreground")}>
                Share your conversation trees as interactive mind maps. Perfect for presentations
                and knowledge sharing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Zermind */}
        <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center px-4 sm:px-6">
            <h2
              {...sx(
                "text-xl sm:text-2xl flex items-center justify-center space-x-2 font-semibold",
              )}
            >
              <span>Why Choose Zermind?</span>
            </h2>
            <CardDescription className="text-sm sm:text-base">
              Work with multiple models without losing the structure of your conversation
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-6">
            <div {...sx("space-y-3 sm:space-y-4")}>
              <div {...sx("flex items-start space-x-3")}>
                <div {...sx("bg-primary/20 rounded-full p-2 mt-0.5 flex-shrink-0")}>
                  <GitBranch {...sx("h-4 w-4 text-primary")} />
                </div>
                <div>
                  <h3 {...sx("font-medium text-sm sm:text-base")}>Branch from any message</h3>
                  <p {...sx("text-sm text-muted-foreground")}>
                    Continue an earlier idea without discarding the rest of the conversation tree.
                  </p>
                </div>
              </div>
              <div {...sx("flex items-start space-x-3")}>
                <div {...sx("bg-primary/20 rounded-full p-2 mt-0.5 flex-shrink-0")}>
                  <Network {...sx("h-4 w-4 text-primary")} />
                </div>
                <div>
                  <h3 {...sx("font-medium text-sm sm:text-base")}>Compare model responses</h3>
                  <p {...sx("text-sm text-muted-foreground")}>
                    Compare responses from GPT-4, Claude, Llama, and more in the same conversation
                    tree.
                  </p>
                </div>
              </div>
            </div>
            <div {...sx("space-y-3 sm:space-y-4")}>
              <div {...sx("flex items-start space-x-3")}>
                <div {...sx("bg-primary/20 rounded-full p-2 mt-0.5 flex-shrink-0")}>
                  <Eye {...sx("h-4 w-4 text-primary")} />
                </div>
                <div>
                  <h3 {...sx("font-medium text-sm sm:text-base")}>Visual conversation history</h3>
                  <p {...sx("text-sm text-muted-foreground")}>
                    See how ideas connect, evolve, and branch. Perfect for research, brainstorming,
                    and complex problem-solving.
                  </p>
                </div>
              </div>
              <div {...sx("flex items-start space-x-3")}>
                <div {...sx("bg-primary/20 rounded-full p-2 mt-0.5 flex-shrink-0")}>
                  <Heart {...sx("h-4 w-4 text-primary")} />
                </div>
                <div>
                  <h3 {...sx("font-medium text-sm sm:text-base")}>Open source and BYOK</h3>
                  <p {...sx("text-sm text-muted-foreground")}>
                    Fully open source with your privacy in mind. Use your own API keys and maintain
                    control of your data.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div
          id="frequently-asked-questions"
          {...sx("space-y-4 sm:space-y-6 py-8 sm:py-16 scroll-mt-24")}
        >
          <div {...sx("text-center space-y-1 sm:space-y-2")}>
            <h2 {...sx("text-2xl sm:text-3xl font-bold")}>Frequently Asked Questions</h2>
            <p {...sx("text-muted-foreground text-sm sm:text-base")}>
              Everything you need to know about Zermind
            </p>
          </div>

          <div {...sx("space-y-3 sm:space-y-4 w-full mx-auto")}>
            {homeFaqs.map(({ question, answer }) => (
              <FAQItem key={question} question={question} answer={answer} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div {...sx("text-center text-xs sm:text-sm text-muted-foreground space-y-2 sm:space-y-3")}>
        <p>
          Open source • Privacy-focused • Built by{" "}
          <Link
            href="https://x.com/NickelanddimeO"
            target="_blank"
            rel="noopener noreferrer"
            {...sx(
              "text-primary font-bold hover:text-primary/80 transition-colors hover:underline",
            )}
          >
            NickelanddimeO
          </Link>
        </p>
        <div {...sx("flex flex-wrap items-center justify-center gap-x-2 gap-y-1")}>
          <Link
            href="/privacy"
            {...sx(
              "text-primary font-bold hover:text-primary/80 transition-colors hover:underline",
            )}
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            {...sx(
              "text-primary font-bold hover:text-primary/80 transition-colors hover:underline",
            )}
          >
            Terms of Use
          </Link>
          <span>•</span>
          <Link
            href="/imprint"
            {...sx(
              "text-primary font-bold hover:text-primary/80 transition-colors hover:underline",
            )}
          >
            Imprint
          </Link>
        </div>
        <div {...sx("flex flex-wrap items-center justify-center gap-x-2 gap-y-1")}>
          <Link
            href="https://x.com/NickelanddimeO"
            target="_blank"
            rel="noopener noreferrer"
            {...sx(
              "text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1",
            )}
          >
            <TwitterIcon {...sx("h-3 w-3 sm:h-4 sm:w-4")} />
            Twitter
          </Link>
          <span>•</span>
          <Link
            href="https://github.com/okikeSolutions/zermind"
            target="_blank"
            rel="noopener noreferrer"
            {...sx(
              "text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1",
            )}
          >
            <GitHubIcon {...sx("h-3 w-3 sm:h-4 sm:w-4")} />
            GitHub Repo
          </Link>
          <span>•</span>
          <Link
            href="https://github.com/sponsors/okikeSolutions"
            target="_blank"
            rel="noopener noreferrer"
            {...sx(
              "text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1",
            )}
          >
            <Heart {...sx("h-3 w-3 sm:h-4 sm:w-4 fill-primary")} />
            Support Zermind
          </Link>
        </div>
      </div>

      {/* Onboarding Tooltip */}
      <OnboardingTooltip
        isVisible={showOnboarding && !isAuthenticated}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
        steps={[]} // Use default steps
      />
    </div>
  );
}
