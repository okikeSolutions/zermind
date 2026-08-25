import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LogIn, Heart } from "lucide-react";
import Link from "@/lib/navigation";

// GitHub Icon Component
import { sx } from "@/styles/sx";
import * as m from "@/paraglide/messages.js";
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

// Demo conversations data
const DEMO_CONVERSATIONS = {
  "ai-comparison": {
    title: m.copy_ai_model_comparison_demo(),
    description: m.copy_see_how_different_ai_models_approach_the_same_question(),
    messageCount: 3,
  },
  "creative-writing": {
    title: m.copy_creative_writing_exploration(),
    description: m.copy_explore_different_narrative_styles_and_creative_approaches(),
    messageCount: 3,
  },
  "problem-solving": {
    title: m.copy_complex_problem_solving(),
    description: m.copy_break_down_complex_problems_using_multiple_ai_perspectives(),
    messageCount: 3,
  },
};

interface DemoSelectionProps {
  onUpgrade: () => void;
}

export function DemoSelection({ onUpgrade }: DemoSelectionProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Demo progression steps
  const demoSteps = [
    m.copy_welcome_to_zermind_3(),
    m.copy_try_our_pre_built_demos_below(),
    m.copy_switch_between_chat_and_mind_mode(),
    m.copy_see_how_ai_models_compare(),
    m.copy_ready_to_unlock_full_features(),
  ];

  useEffect(() => {
    // Auto-advance demo steps
    if (currentStep < demoSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, demoSteps.length]);

  return (
    <div {...sx("flex flex-col bg-background py-16 sm:py-16 lg:py-20 min-h-screen")}>
      <div {...sx("flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6")}>
        {/* Demo Conversations */}
        <div {...sx("space-y-3 sm:space-y-4")}>
          <div {...sx("text-center px-2")}>
            <h1 {...sx("text-lg sm:text-xl lg:text-2xl font-semibold mb-1 sm:mb-2")}>
              {m.copy_interactive_demos()}
            </h1>
            <p {...sx("text-muted-foreground text-xs sm:text-sm lg:text-base max-w-2xl mx-auto")}>
              {m.copy_experience_both_chat_and_mind_modes_with_pre_built_conversations()}
            </p>
          </div>

          <div {...sx("grid gap-3 sm:gap-4 max-w-4xl mx-auto")}>
            {Object.entries(DEMO_CONVERSATIONS).map(([key, demo]) => (
              <Link key={key} href={`/demo/${key}`}>
                <Card className="cursor-pointer transition-all duration-200 border-2 border-primary/10 hover:border-primary/30 active:scale-[0.98] sm:hover:shadow-lg sm:hover:scale-[1.02] touch-manipulation">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div {...sx("flex items-start sm:items-center justify-between gap-3")}>
                      <CardTitle className="text-base sm:text-lg lg:text-xl leading-tight">
                        {demo.title}
                      </CardTitle>
                      <ArrowRight
                        {...sx(
                          "h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0",
                        )}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p
                      {...sx(
                        "text-xs sm:text-sm lg:text-base text-muted-foreground mb-3 leading-relaxed",
                      )}
                    >
                      {demo.description}
                    </p>
                    <div {...sx("flex items-center justify-between gap-2")}>
                      <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1">
                        {m.copy_message_count({ count: demo.messageCount })}
                      </Badge>
                      <Badge variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                        {m.copy_interactive_demo()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <Card className="border-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 max-w-4xl mx-auto">
          <CardHeader className="text-center pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl px-2">
              {m.copy_ready_for_the_full_experience()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3 sm:space-y-4">
            <p
              {...sx(
                "text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto px-2",
              )}
            >
              {m.copy_sign_in_to_unlock_unlimited_conversations_real_time_collaboratio()}
            </p>
            <div {...sx("flex flex-col gap-3 sm:flex-row sm:gap-2 justify-center px-2")}>
              <Button
                onClick={onUpgrade}
                className="bg-primary hover:bg-primary/80 w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 py-3 touch-manipulation"
              >
                <LogIn {...sx("h-4 w-4 mr-2")} /> {m.copy_sign_in_to_continue()}
              </Button>
              <Button
                variant="outline"
                render={
                  <Link
                    href="https://github.com/okikeSolutions/zermind"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 py-3 touch-manipulation"
              >
                {m.copy_view_source_code()}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div
          {...sx(
            "text-center text-xs sm:text-sm text-muted-foreground space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2 pb-4 sm:pb-6",
          )}
        >
          <p>
            {m.copy_open_source_privacy_focused_built_by()}{" "}
            <Link
              href="https://x.com/NickelanddimeO"
              target="_blank"
              rel="noopener noreferrer"
              {...sx(
                "text-primary font-bold hover:text-primary/80 transition-colors hover:underline",
              )}
            >
              {m.copy_nickelanddimeo()}
            </Link>
          </p>
          <div {...sx("flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4")}>
            <Link
              href="/privacy"
              {...sx(
                "text-primary font-bold hover:text-primary/80 transition-colors hover:underline touch-manipulation min-h-[44px] flex items-center",
              )}
            >
              {m.copy_privacy_policy()}
            </Link>
            <span {...sx("hidden sm:inline")}>•</span>
            <Link
              href="/terms"
              {...sx(
                "text-primary font-bold hover:text-primary/80 transition-colors hover:underline touch-manipulation min-h-[44px] flex items-center",
              )}
            >
              {m.copy_terms_of_use()}
            </Link>
            <span {...sx("hidden sm:inline")}>•</span>
            <Link
              href="/imprint"
              {...sx(
                "text-primary font-bold hover:text-primary/80 transition-colors hover:underline touch-manipulation min-h-[44px] flex items-center",
              )}
            >
              {m.copy_imprint()}
            </Link>
          </div>
          <div {...sx("flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4")}>
            <Link
              href="https://x.com/NickelanddimeO"
              target="_blank"
              rel="noopener noreferrer"
              {...sx(
                "text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1.5 touch-manipulation min-h-[44px]",
              )}
            >
              <TwitterIcon {...sx("h-3 w-3 sm:h-4 sm:w-4")} /> {m.copy_twitter()}
            </Link>
            <span {...sx("hidden sm:inline")}>•</span>
            <Link
              href="https://github.com/okikeSolutions/zermind"
              target="_blank"
              rel="noopener noreferrer"
              {...sx(
                "text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1.5 touch-manipulation min-h-[44px]",
              )}
            >
              <GitHubIcon {...sx("h-3 w-3 sm:h-4 sm:w-4")} /> {m.copy_github_repo()}
            </Link>
            <span {...sx("hidden sm:inline")}>•</span>
            <Link
              href="https://github.com/sponsors/okikeSolutions"
              {...sx(
                "text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1.5 touch-manipulation min-h-[44px]",
              )}
            >
              <Heart {...sx("h-3 w-3 sm:h-4 sm:w-4 fill-primary")} /> {m.copy_support_zermind()}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
