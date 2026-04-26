import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiKeyManagement } from "@/components/api-key-management";
import { DangerZone } from "@/components/danger-zone";
import { CollaborationSettings } from "@/components/collaboration-settings";
import { User, Settings, Shield, Database } from "lucide-react";

export default async function SettingsPage() {
  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-sm">
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                {user?.email ?? "Unknown"}
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">User ID</p>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md truncate">
                {user?.userId ?? user?._id ?? "Unknown"}
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Account Created
              </p>
              <p className="text-sm bg-muted px-3 py-2 rounded-md">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Email Verified</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={user?.emailVerified ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {user?.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Preferences */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            Chat Preferences & API Keys
          </CardTitle>
          <CardDescription className="text-sm">
            Customize your chat experience and manage your API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <ApiKeyManagement />
          <div className="pt-4 sm:pt-6 border-t">
            <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Other Preferences{" "}
              <Badge variant="secondary" className="text-xs">
                Soon
              </Badge>
            </h4>
            <div className="text-xs sm:text-sm text-muted-foreground mb-2">
              Additional chat preferences will be implemented in future updates.
            </div>
          </div>
        </CardContent>
      </Card>

      <CollaborationSettings />

      {/* Privacy & Security */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            Privacy & Security
            <Badge variant="secondary" className="text-xs ml-2">
              Soon
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">
            Control your data and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Privacy controls will be implemented in future updates.
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Database className="h-4 w-4 sm:h-5 sm:w-5" />
            Data Management
            <Badge variant="secondary" className="text-xs ml-2">
              Soon
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">Manage your chat data and storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Data management features will be implemented in future updates.
          </div>
        </CardContent>
      </Card>

      <DangerZone />
    </div>
  );
}
