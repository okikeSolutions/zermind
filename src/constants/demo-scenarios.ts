export const DEMO_SCENARIOS = {
  "ai-comparison": {
    title: "AI Model Comparison Demo",
    description: "See how different AI models approach the same question",
    keywords: ["AI comparison", "GPT-4 vs Claude", "model comparison", "AI debate"],
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
} as const;

export type DemoScenarioKey = keyof typeof DEMO_SCENARIOS;
