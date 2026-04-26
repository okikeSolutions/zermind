import { AppHeader } from "@/components/app-header";
import { Metadata } from "next";
import { DEMO_SCENARIOS } from "@/constants/demo-scenarios";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scenario?: string }>;
}): Promise<Metadata> {
  const { scenario } = await params;

  if (scenario && scenario in DEMO_SCENARIOS) {
    const scenarioData = DEMO_SCENARIOS[scenario as keyof typeof DEMO_SCENARIOS];
    return {
      title: `${scenarioData.title} | Zermind Demo`,
      description: `${scenarioData.description} - Experience Zermind's revolutionary AI mind mapping with this interactive demo. No signup required.`,
      keywords: [...scenarioData.keywords, "AI demo", "mind mapping", "conversation visualization"],
      openGraph: {
        title: `${scenarioData.title} - Zermind Demo`,
        description: scenarioData.description,
        type: "website",
        url: `/demo/${scenario}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${scenarioData.title} - Zermind Demo`,
        description: scenarioData.description,
      },
    };
  }

  // Default metadata for main demo page
  return {
    title: "Try Zermind Demo - Experience AI Mind Mapping",
    description:
      "Experience the future of AI conversation with Zermind's interactive demo. Transform chats into visual mind maps, compare AI models, and explore revolutionary conversation branching - no signup required.",
    keywords: [
      "AI demo",
      "mind mapping",
      "conversation visualization",
      "AI chat demo",
      "GPT-4 vs Claude",
      "interactive AI",
      "visual thinking",
      "AI comparison",
    ],
    openGraph: {
      title: "Try Zermind Demo - Revolutionary AI Mind Mapping",
      description:
        "The first AI platform that transforms conversations into visual mind maps. Try our interactive demo featuring multi-model AI comparison and conversation branching.",
      type: "website",
      url: "/demo",
    },
    twitter: {
      card: "summary_large_image",
      title: "Try Zermind Demo - AI Mind Mapping Revolution",
      description:
        "Experience visual AI conversations with mind maps, multi-model comparison, and conversation branching. No signup required!",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/demo",
    },
  };
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
