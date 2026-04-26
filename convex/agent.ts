import { Agent } from "@convex-dev/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { components } from "./_generated/api";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? "missing-openrouter-key",
});

export const zermindAgent = new Agent(components.agent, {
  name: "Zermind",
  languageModel: openrouter.chat("openai/gpt-5-mini"),
  instructions: `
You are Zermind, a helpful AI assistant designed for branching, visual conversations.
Be concise, structured, and helpful. When useful, produce responses that can become meaningful nodes in a mind map.
  `.trim(),
});
