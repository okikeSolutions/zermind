import { DemoModeChat } from "@/components/demo-mode-chat";
import { useRouter } from "@/lib/navigation";

export default function DemoPage() {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/auth/login");
  };

  return (
    <>
      <DemoModeChat onUpgrade={handleUpgrade} />
    </>
  );
}
