import Imprint from "@/components/imprint";
import { AppHeader } from "@/components/app-header";

export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      {/* App Header with Logo, Auth, and Theme */}
      <AppHeader />
      <Imprint />
    </div>
  );
}
