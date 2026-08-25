import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiKeyManagement } from "@/components/api-key-management";
import { DangerZone } from "@/components/danger-zone";
import { CollaborationSettings } from "@/components/collaboration-settings";
import { User, Settings, Shield, Database } from "lucide-react";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
export default function SettingsPage({
  user,
}: {
  user: FunctionReturnType<typeof api.auth.getCurrentUser>;
}) {
  return (
    <div {...sx("p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6")}>
      <div {...sx("space-y-1 sm:space-y-2")}>
        <h1 {...sx("text-xl sm:text-2xl font-semibold")}>{m.copy_settings()}</h1>
        <p {...sx("text-sm sm:text-base text-muted-foreground")}>
          {m.copy_manage_your_account_preferences_and_privacy_settings()}
        </p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User {...sx("h-4 w-4 sm:h-5 sm:w-5")} /> {m.copy_profile_information()}
          </CardTitle>
          <CardDescription className="text-sm">
            {m.copy_your_account_details_and_preferences()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div {...sx("grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4")}>
            <div {...sx("space-y-1.5 sm:space-y-2")}>
              <p {...sx("text-xs sm:text-sm font-medium text-muted-foreground")}>
                {m.copy_email()}
              </p>
              <p {...sx("text-sm font-mono bg-muted px-3 py-2 rounded-md break-all")}>
                {user?.email ?? m.copy_unknown()}
              </p>
            </div>
            <div {...sx("space-y-1.5 sm:space-y-2")}>
              <p {...sx("text-xs sm:text-sm font-medium text-muted-foreground")}>
                {m.copy_user_id()}
              </p>
              <p {...sx("text-sm font-mono bg-muted px-3 py-2 rounded-md truncate")}>
                {user?.userId ?? user?._id ?? m.copy_unknown()}
              </p>
            </div>
            <div {...sx("space-y-1.5 sm:space-y-2")}>
              <p {...sx("text-xs sm:text-sm font-medium text-muted-foreground")}>
                {m.copy_account_created()}
              </p>
              <p {...sx("text-sm bg-muted px-3 py-2 rounded-md")}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : m.copy_unknown()}
              </p>
            </div>
            <div {...sx("space-y-1.5 sm:space-y-2")}>
              <p {...sx("text-xs sm:text-sm font-medium text-muted-foreground")}>
                {m.copy_email_verified()}
              </p>
              <div {...sx("flex items-center gap-2 mt-1")}>
                <Badge
                  variant={user?.emailVerified ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {user?.emailVerified ? m.copy_verified() : m.copy_not_verified()}
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
            <Settings {...sx("h-4 w-4 sm:h-5 sm:w-5")} /> {m.copy_chat_preferences_api_keys()}
          </CardTitle>
          <CardDescription className="text-sm">
            {m.copy_customize_your_chat_experience_and_manage_your_api_keys()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <ApiKeyManagement />
          <div {...sx("pt-4 sm:pt-6 border-t")}>
            <h4 {...sx("font-medium mb-2 sm:mb-3 text-sm sm:text-base")}>
              {m.copy_other_preferences()}{" "}
              <Badge variant="secondary" className="text-xs">
                {m.copy_soon()}
              </Badge>
            </h4>
            <div {...sx("text-xs sm:text-sm text-muted-foreground mb-2")}>
              {m.copy_additional_chat_preferences_will_be_implemented_in_future_update()}
            </div>
          </div>
        </CardContent>
      </Card>

      <CollaborationSettings />

      {/* Privacy & Security */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield {...sx("h-4 w-4 sm:h-5 sm:w-5")} /> {m.copy_privacy_security()}{" "}
            <Badge variant="secondary" className="text-xs ml-2">
              {m.copy_soon()}
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">
            {m.copy_control_your_data_and_security_settings()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div {...sx("text-xs sm:text-sm text-muted-foreground")}>
            {m.copy_privacy_controls_will_be_implemented_in_future_updates()}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Database {...sx("h-4 w-4 sm:h-5 sm:w-5")} /> {m.copy_data_management()}{" "}
            <Badge variant="secondary" className="text-xs ml-2">
              {m.copy_soon()}
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">
            {m.copy_manage_your_chat_data_and_storage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div {...sx("text-xs sm:text-sm text-muted-foreground")}>
            {m.copy_data_management_features_will_be_implemented_in_future_updates()}
          </div>
        </CardContent>
      </Card>

      <DangerZone />
    </div>
  );
}
