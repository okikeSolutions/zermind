import TermsOfUse from "@/components/terms-of-use";
import { AppHeader } from "@/components/app-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      {/* App Header with Logo, Auth, and Theme */}
      <AppHeader />
      <TermsOfUse />
    </div>
  );
} 