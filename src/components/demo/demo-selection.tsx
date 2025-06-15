"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LogIn, Heart } from "lucide-react";
import Link from "next/link";

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

// Demo conversations data
const DEMO_CONVERSATIONS = {
  "ai-comparison": {
    title: "AI Model Comparison Demo",
    description: "See how different AI models approach the same question",
    messageCount: 3,
  },
  "creative-writing": {
    title: "Creative Writing Exploration",
    description: "Explore different narrative styles and creative approaches",
    messageCount: 3,
  },
  "problem-solving": {
    title: "Complex Problem Solving",
    description: "Break down complex problems using multiple AI perspectives",
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
    "Welcome to Zermind! 👋",
    "Try our pre-built demos below",
    "Switch between Chat and Mind Mode",
    "See how AI models compare",
    "Ready to unlock full features?",
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
    <div className="flex flex-col bg-background py-6 sm:py-12 lg:py-20 min-h-screen">
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
        {/* Demo Conversations */}
        <div className="space-y-3 sm:space-y-4">
          <div className="text-center px-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1 sm:mb-2">
              Interactive Demos
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base max-w-2xl mx-auto">
              Experience both Chat and Mind modes with pre-built conversations
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 max-w-4xl mx-auto">
            {Object.entries(DEMO_CONVERSATIONS).map(([key, demo]) => (
              <Link key={key} href={`/demo/${key}`}>
                <Card className="cursor-pointer transition-all duration-200 border-2 border-primary/10 hover:border-primary/30 active:scale-[0.98] sm:hover:shadow-lg sm:hover:scale-[1.02] touch-manipulation">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <CardTitle className="text-base sm:text-lg lg:text-xl leading-tight">
                        {demo.title}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-3 leading-relaxed">
                      {demo.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1">
                        {demo.messageCount} messages
                      </Badge>
                      <Badge variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                        Interactive Demo
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
              Ready for the Full Experience?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3 sm:space-y-4">
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto px-2">
              Sign in to unlock unlimited conversations, real-time
              collaboration, and advanced features
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 justify-center px-2">
              <Button
                onClick={onUpgrade}
                className="bg-primary hover:bg-primary/80 w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 py-3 touch-manipulation"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Continue
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 py-3 touch-manipulation"
              >
                <Link
                  href="https://github.com/okikeSolutions/zermind"
                  target="_blank"
                >
                  View Source Code
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2 pb-4 sm:pb-6">
          <p className="leading-relaxed">
            Open source • Privacy-focused • Built for{" "}
            <Link
              href="https://cloneathon.t3.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline touch-manipulation"
            >
              Cloneathon 2025
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
            <Link
              href="/privacy"
              className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline touch-manipulation min-h-[44px] flex items-center"
            >
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/terms"
              className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline touch-manipulation min-h-[44px] flex items-center"
            >
              Terms of Use
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/imprint"
              className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline touch-manipulation min-h-[44px] flex items-center"
            >
              Imprint
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
            <Link
              href="https://github.com/okikeSolutions/zermind"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1.5 touch-manipulation min-h-[44px]"
            >
              <GitHubIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              GitHub Repo
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              href="https://github.com/sponsors/okikeSolutions"
              className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline inline-flex items-center gap-1.5 touch-manipulation min-h-[44px]"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-primary" />
              Support Zermind
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
