"use client";

import { useCallback } from "react";
import { DemoSelection } from "./demo/demo-selection";
import { DemoConversationView } from "./demo/demo-conversation-view";

interface DemoModeChatProps {
  onUpgrade: () => void;
  selectedScenario?: string;
}

export function DemoModeChat({
  onUpgrade,
  selectedScenario,
}: DemoModeChatProps) {
  const selectedDemo = selectedScenario || null;

  const handleBackToSelection = useCallback(() => {
    window.history.back();
  }, []);

  if (!selectedDemo) {
    return <DemoSelection onUpgrade={onUpgrade} />;
  }

  return (
    <DemoConversationView
      scenario={selectedDemo}
      onUpgrade={onUpgrade}
      onBack={handleBackToSelection}
    />
  );
}
