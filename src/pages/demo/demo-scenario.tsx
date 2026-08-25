import { DemoModeChat } from "@/components/demo-mode-chat";
import { useRouter } from "@/lib/navigation";
import { sx } from "@/styles/sx";

interface DemoScenarioClientProps {
  scenario: string;
}

export function DemoScenarioClient({ scenario }: DemoScenarioClientProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/auth/login");
  };

  return (
    <div {...sx("w-full")}>
      <DemoModeChat onUpgrade={handleUpgrade} selectedScenario={scenario} />
    </div>
  );
}
