import * as m from "@/paraglide/messages.js";
export const DEMO_SCENARIOS = {
  "ai-comparison": {
    title: m.copy_ai_model_comparison_demo(),
    description: m.copy_see_how_different_ai_models_approach_the_same_question(),
    keywords: [
      m.copy_ai_comparison(),
      m.copy_gpt_4_vs_claude(),
      m.copy_model_comparison(),
      m.copy_ai_debate(),
    ],
  },
  "creative-writing": {
    title: m.copy_creative_writing_with_ai(),
    description: m.copy_explore_different_narrative_styles_and_creative_approaches(),
    keywords: [m.copy_creative_writing(), m.copy_ai_storytelling(), m.copy_narrative_branching()],
  },
  "problem-solving": {
    title: m.copy_complex_problem_solving(),
    description: m.copy_break_down_complex_problems_using_multiple_ai_perspectives(),
    keywords: [m.copy_problem_solving(), m.copy_ai_analysis(), m.copy_multiple_perspectives()],
  },
} as const;

export type DemoScenarioKey = keyof typeof DEMO_SCENARIOS;
