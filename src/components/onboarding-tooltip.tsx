import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, Brain, MessageSquare, GitBranch, Users, Sparkles } from "lucide-react";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  position: "top" | "bottom" | "left" | "right";
  highlight?: string;
}

interface OnboardingTooltipProps {
  steps: OnboardingStep[];
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const DEFAULT_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: m.copy_welcome_to_zermind_2(),
    description: m.copy_the_first_ai_platform_that_transforms_conversations_into_visual(),
    icon: Sparkles,
    position: "bottom",
    highlight: m.copy_revolutionary_ai_visualization(),
  },
  {
    id: "dual-mode",
    title: m.copy_dual_interaction_modes(),
    description: m.copy_switch_between_traditional_chat_mode_and_revolutionary_mind_mode(),
    icon: MessageSquare,
    position: "bottom",
    highlight: m.copy_chat_mind_modes(),
  },
  {
    id: "mind-mode",
    title: m.copy_mind_mode_magic(),
    description: m.copy_transform_your_conversations_into_interactive_mind_maps_see_how(),
    icon: Brain,
    position: "top",
    highlight: m.copy_visual_thinking_revolution(),
  },
  {
    id: "multi-model",
    title: m.copy_multi_model_conversations(),
    description: m.copy_ask_the_same_question_to_different_ai_models_and_compare_their_r(),
    icon: GitBranch,
    position: "bottom",
    highlight: m.copy_gpt_4_vs_claude_vs_llama(),
  },
  {
    id: "collaboration",
    title: m.copy_real_time_collaboration(),
    description: m.copy_work_with_your_team_in_real_time_on_the_same_conversation_trees(),
    icon: Users,
    position: "top",
    highlight: m.copy_coming_soon(),
  },
];

export function OnboardingTooltip({
  steps = DEFAULT_ONBOARDING_STEPS,
  isVisible,
  onComplete,
  onSkip,
}: OnboardingTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
    }
  }, [isVisible]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsAnimating(false);
    }, 200);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  const handleSkip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onSkip();
    }, 200);
  };

  if (!isVisible || !currentStepData) {
    return null;
  }

  const IconComponent = currentStepData.icon;

  return (
    <div
      {...sx(
        "fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4",
      )}
    >
      <Card
        className={`w-full max-w-md border-2 border-primary/20 shadow-2xl transition-all duration-200 ${
          isAnimating ? "scale-95 opacity-70" : "scale-100 opacity-100"
        }`}
      >
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div {...sx("flex items-start justify-between")}>
            <div {...sx("flex items-center gap-3")}>
              <div {...sx("p-2 bg-primary/10 rounded-lg")}>
                <IconComponent {...sx("h-5 w-5 text-primary")} />
              </div>
              <div>
                <h3 {...sx("font-semibold text-lg")}>{currentStepData.title}</h3>
                {currentStepData.highlight && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {currentStepData.highlight}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="p-1 hover:bg-muted">
              <X {...sx("h-4 w-4")} />
            </Button>
          </div>

          {/* Content */}
          <p {...sx("text-muted-foreground leading-relaxed")}>{currentStepData.description}</p>

          {/* Progress Indicator */}
          <div {...sx("flex items-center gap-2")}>
            {steps.map((_, index) => (
              <div
                key={index}
                {...sx(
                  `h-2 rounded-full transition-all duration-200 ${
                    index === currentStep
                      ? "bg-primary w-8"
                      : index < currentStep
                        ? "bg-primary/60 w-2"
                        : "bg-muted w-2"
                  }`,
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div {...sx("flex items-center justify-between pt-2")}>
            <div {...sx("text-sm text-muted-foreground")}>
              {currentStep + 1} of {steps.length}
            </div>

            <div {...sx("flex items-center gap-2")}>
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  {m.copy_previous()}
                </Button>
              )}

              <Button onClick={handleNext} size="sm" className="bg-primary hover:bg-primary/80">
                {isLastStep ? (
                  <>
                    {m.copy_get_started()} <Sparkles {...sx("h-3 w-3 ml-1")} />
                  </>
                ) : (
                  <>
                    {m.copy_next()} <ArrowRight {...sx("h-3 w-3 ml-1")} />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Skip Option */}
          <div {...sx("text-center pt-2 border-t")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {m.copy_skip_tour()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Custom hook for managing onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenBefore = localStorage.getItem("zermind-onboarding-seen");
    if (!hasSeenBefore) {
      // Show onboarding after a short delay for better UX
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem("zermind-onboarding-seen", "true");
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem("zermind-onboarding-seen", "true");
  };

  const restartOnboarding = () => {
    localStorage.removeItem("zermind-onboarding-seen");
    setShowOnboarding(true);
    setHasSeenOnboarding(false);
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
  };
}
