"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowRight,
  Brain,
  MessageSquare,
  GitBranch,
  Users,
  Sparkles,
} from "lucide-react";

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
    title: "Welcome to Zermind! 🎉",
    description:
      "The first AI platform that transforms conversations into visual mind maps. Let's take a quick tour!",
    icon: Sparkles,
    position: "bottom",
    highlight: "Revolutionary AI visualization",
  },
  {
    id: "dual-mode",
    title: "Dual Interaction Modes",
    description:
      "Switch between traditional Chat Mode and revolutionary Mind Mode anytime. Each offers unique advantages for different thinking styles.",
    icon: MessageSquare,
    position: "bottom",
    highlight: "Chat + Mind modes",
  },
  {
    id: "mind-mode",
    title: "Mind Mode Magic ✨",
    description:
      "Transform your conversations into interactive mind maps. See how ideas connect, branch, and evolve visually.",
    icon: Brain,
    position: "top",
    highlight: "Visual thinking revolution",
  },
  {
    id: "multi-model",
    title: "Multi-Model Conversations",
    description:
      "Ask the same question to different AI models and compare their responses side-by-side in your mind map.",
    icon: GitBranch,
    position: "bottom",
    highlight: "GPT-4 vs Claude vs Llama",
  },
  {
    id: "collaboration",
    title: "Real-time Collaboration",
    description:
      "Work with your team in real-time on the same conversation trees. Perfect for brainstorming and complex problem-solving.",
    icon: Users,
    position: "top",
    highlight: "Coming soon!",
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className={`w-full max-w-md border-2 border-primary/20 shadow-2xl transition-all duration-200 ${
          isAnimating ? "scale-95 opacity-70" : "scale-100 opacity-100"
        }`}
      >
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {currentStepData.title}
                </h3>
                {currentStepData.highlight && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {currentStepData.highlight}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="p-1 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-muted-foreground leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? "bg-primary w-8"
                    : index < currentStep
                    ? "bg-primary/60 w-2"
                    : "bg-muted w-2"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  Previous
                </Button>
              )}

              <Button
                onClick={handleNext}
                size="sm"
                className="bg-primary hover:bg-primary/80"
              >
                {isLastStep ? (
                  <>
                    Get Started
                    <Sparkles className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Skip Option */}
          <div className="text-center pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Skip tour
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
