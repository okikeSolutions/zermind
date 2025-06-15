import { DemoScenarioClient } from "./demo-scenario-client";
import { notFound } from "next/navigation";

// Define available demo scenarios
const DEMO_SCENARIOS = {
  "ai-comparison": {
    title: "AI Model Comparison Demo",
    description: "See how different AI models approach the same question",
    keywords: [
      "AI comparison",
      "GPT-4 vs Claude",
      "model comparison",
      "AI debate",
    ],
  },
  "creative-writing": {
    title: "Creative Writing with AI",
    description: "Explore different narrative styles and creative approaches",
    keywords: ["creative writing", "AI storytelling", "narrative branching"],
  },
  "problem-solving": {
    title: "Complex Problem Solving",
    description: "Break down complex problems using multiple AI perspectives",
    keywords: ["problem solving", "AI analysis", "multiple perspectives"],
  },
};

type Props = {
  params: Promise<{ scenario: string }>;
};

export async function generateStaticParams() {
  return Object.keys(DEMO_SCENARIOS).map((scenario) => ({
    scenario,
  }));
}

export default async function DemoScenarioPage({ params }: Props) {
  const { scenario } = await params;

  // Check if scenario exists
  if (!(scenario in DEMO_SCENARIOS)) {
    notFound();
  }

  return <DemoScenarioClient scenario={scenario} />;
}
