"use client";

import { DemoModeChat } from "@/components/demo-mode-chat";
import { useRouter } from "next/navigation";

interface DemoScenarioClientProps {
  scenario: string;
}

export function DemoScenarioClient({ scenario }: DemoScenarioClientProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/auth/login");
  };

  return (
    <div className="w-full">
      <DemoModeChat onUpgrade={handleUpgrade} selectedScenario={scenario} />
    </div>
  );
} 