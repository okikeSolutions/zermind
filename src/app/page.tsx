import { isAuthenticated } from "@/lib/auth-server";
import { AppHeader } from "@/components/app-header";
import { ChatInterface } from "@/components/chat-interface";

export default async function Home() {
  const signedIn = await isAuthenticated();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      {/* App Header with Logo, Auth, and Theme */}
      <AppHeader />

      {/* Main Content */}
      <ChatInterface isAuthenticated={signedIn} />
    </div>
  );
}
