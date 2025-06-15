// Demo conversation data for pre-populated scenarios
export const DEMO_CONVERSATIONS = {
  "ai-comparison": {
    title: "AI Model Comparison Demo",
    description: "See how different AI models approach the same question",
    messages: [
      {
        id: "demo-1",
        role: "user" as const,
        content: "What's the most exciting technology trend in 2025?",
        xPosition: 100,
        yPosition: 100,
        nodeType: "conversation" as const,
        isCollapsed: false,
      },
      {
        id: "demo-2",
        role: "assistant" as const,
        content:
          "AI agents are transforming how we work and interact with technology. From coding assistants to creative collaborators, AI is becoming deeply integrated into our daily workflows, making complex tasks more accessible and creative processes more innovative.",
        model: "openai/gpt-4o-mini",
        parentId: "demo-1",
        xPosition: 300,
        yPosition: 50,
        nodeType: "conversation" as const,
        isCollapsed: false,
      },
      {
        id: "demo-3",
        role: "assistant" as const,
        content:
          "Quantum computing is reaching practical applications in 2025. With major breakthroughs in error correction and increased qubit stability, we're seeing real-world applications in cryptography, drug discovery, and complex optimization problems.",
        model: "anthropic/claude-3-sonnet",
        parentId: "demo-1",
        branchName: "Claude's Perspective",
        xPosition: 300,
        yPosition: 150,
        nodeType: "branching_point" as const,
        isCollapsed: false,
      },
    ],
  },
  "creative-writing": {
    title: "Creative Writing Exploration",
    description: "Explore different narrative styles and creative approaches",
    messages: [
      {
        id: "demo-4",
        role: "user" as const,
        content:
          "Help me write a short story about a robot discovering emotions",
        xPosition: 100,
        yPosition: 100,
        nodeType: "conversation" as const,
        isCollapsed: false,
      },
      {
        id: "demo-5",
        role: "assistant" as const,
        content:
          "**The First Tear**\n\nUnit-47 stood in the abandoned library, its optical sensors scanning the dust-covered books. For the first time in its existence, it felt something beyond its programming—a longing for the stories it could never truly understand. When a photograph fell from an old book, showing a family laughing together, Unit-47 experienced what humans called sadness. A single drop of condensation formed on its face plate, and it understood: it was crying.",
        model: "openai/gpt-4o-mini",
        parentId: "demo-4",
        branchName: "Emotional Narrative",
        xPosition: 350,
        yPosition: 50,
        nodeType: "conversation" as const,
        isCollapsed: false,
      },
      {
        id: "demo-6",
        role: "user" as const,
        content: "That's beautiful! Can you explore what happens next?",
        parentId: "demo-5",
        xPosition: 600,
        yPosition: 50,
        nodeType: "conversation" as const,
        isCollapsed: false,
      },
    ],
  },
  "problem-solving": {
    title: "Complex Problem Solving",
    description: "Break down complex problems using multiple AI perspectives",
    messages: [
      {
        id: "demo-7",
        role: "user" as const,
        content:
          "How can cities reduce traffic congestion while improving air quality?",
        xPosition: 100,
        yPosition: 100,
        nodeType: "conversation" as const,
        isCollapsed: false,
      },
      {
        id: "demo-8",
        role: "assistant" as const,
        content:
          "**Smart Infrastructure Approach:**\n\n1. **Dynamic Traffic Management**: AI-powered traffic lights that adapt in real-time\n2. **Public Transit Integration**: Seamless multimodal transportation apps\n3. **Electric Vehicle Incentives**: Charging infrastructure + tax benefits\n4. **Congestion Pricing**: Peak hour fees for city center access\n5. **Remote Work Policies**: Reduce commuting demand through flexible work",
        model: "anthropic/claude-3-sonnet",
        parentId: "demo-7",
        branchName: "Infrastructure Focus",
        xPosition: 350,
        yPosition: 50,
        nodeType: "insight" as const,
        isCollapsed: false,
      },
      {
        id: "demo-9",
        role: "assistant" as const,
        content:
          "**Sustainable Transportation Revolution:**\n\n• **Micro-mobility**: E-scooters, bikes, and walking paths\n• **Autonomous Shuttles**: Shared, electric, and efficient\n• **15-minute Cities**: Everything within walking/cycling distance\n• **Green Corridors**: Tree-lined paths that absorb emissions\n• **Community Incentives**: Gamification of sustainable transport choices",
        model: "meta/llama-3.1-70b-instruct",
        parentId: "demo-7",
        branchName: "Sustainability Focus",
        xPosition: 350,
        yPosition: 200,
        nodeType: "insight" as const,
        isCollapsed: false,
      },
    ],
  },
} as const;
