import { createFileRoute, notFound } from "@tanstack/react-router";
import { DemoScenarioClient } from "@/pages/demo/demo-scenario";
import DemoNotFound from "@/pages/demo/not-found";
import { DEMO_SCENARIOS } from "@/constants/demo-scenarios";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/demo/$scenario")({
  loader: ({ params }) => {
    if (!(params.scenario in DEMO_SCENARIOS)) {
      throw notFound();
    }
    return { scenario: params.scenario };
  },
  head: ({ params }) => {
    const scenario = DEMO_SCENARIOS[params.scenario as keyof typeof DEMO_SCENARIOS];
    return scenario
      ? seo({
          title: `${scenario.title} | Zermind`,
          description: scenario.description,
          path: `/demo/${params.scenario}`,
        })
      : {};
  },
  notFoundComponent: DemoNotFound,
  component: DemoScenario,
});

function DemoScenario() {
  const { scenario } = Route.useLoaderData();
  return <DemoScenarioClient scenario={scenario} />;
}
