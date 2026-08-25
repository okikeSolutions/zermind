import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Eye, MousePointer, Shield, Zap, Crown, Edit } from "lucide-react";
import { toast } from "sonner";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
interface CollaborationSettingsProps {
  className?: string;
}

const conflictResolutionItems = [
  { value: "last-writer-wins", label: m.copy_last_writer_wins() },
  { value: "manual", label: m.copy_manual_resolution() },
  { value: "auto-merge", label: m.copy_auto_merge() },
] as const;

const collaborationRoleItems = [
  { value: "collaborator", label: m.copy_collaborator() },
  { value: "viewer", label: m.copy_viewer() },
] as const;

export function CollaborationSettings({ className }: CollaborationSettingsProps) {
  // Default collaboration preferences
  const [settings, setSettings] = useState({
    showCursors: true,
    showPresence: true,
    autoLayout: true,
    allowAnonymous: false,
    requireApproval: true,
    conflictResolution: "last-writer-wins" as "last-writer-wins" | "manual" | "auto-merge",
    defaultRole: "collaborator" as "collaborator" | "viewer",
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success(m.copy_collaboration_preferences_updated());
  };

  return (
    <div {...sx(`space-y-4 sm:space-y-6 ${className}`)}>
      {/* Collaboration Features */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users {...sx("h-4 w-4 sm:h-5 sm:w-5")} /> {m.copy_real_time_collaboration()}
          </CardTitle>
          <CardDescription className="text-sm">
            {m.copy_configure_how_collaboration_works_in_your_mind_maps()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div {...sx("grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6")}>
            {/* Show Cursors */}
            <div {...sx("flex items-center justify-between space-x-2")}>
              <div {...sx("space-y-0.5")}>
                <div {...sx("flex items-center gap-2")}>
                  <MousePointer {...sx("h-4 w-4")} />
                  <Label className="text-sm font-medium">{m.copy_real_time_cursors()}</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>
                  {m.copy_show_other_users_cursors_in_mind_maps()}
                </p>
              </div>
              <Switch
                checked={settings.showCursors}
                onCheckedChange={(checked) => handleSettingChange("showCursors", checked)}
              />
            </div>

            {/* Show Presence */}
            <div {...sx("flex items-center justify-between space-x-2")}>
              <div {...sx("space-y-0.5")}>
                <div {...sx("flex items-center gap-2")}>
                  <Eye {...sx("h-4 w-4")} />
                  <Label className="text-sm font-medium">{m.copy_live_presence()}</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>
                  {m.copy_show_who_s_online_and_collaborating()}
                </p>
              </div>
              <Switch
                checked={settings.showPresence}
                onCheckedChange={(checked) => handleSettingChange("showPresence", checked)}
              />
            </div>

            {/* Auto Layout */}
            <div {...sx("flex items-center justify-between space-x-2")}>
              <div {...sx("space-y-0.5")}>
                <div {...sx("flex items-center gap-2")}>
                  <Zap {...sx("h-4 w-4")} />
                  <Label className="text-sm font-medium">{m.copy_auto_layout()}</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>
                  {m.copy_automatically_arrange_mind_map_nodes()}
                </p>
              </div>
              <Switch
                checked={settings.autoLayout}
                onCheckedChange={(checked) => handleSettingChange("autoLayout", checked)}
              />
            </div>

            {/* Require Approval */}
            <div {...sx("flex items-center justify-between space-x-2")}>
              <div {...sx("space-y-0.5")}>
                <div {...sx("flex items-center gap-2")}>
                  <Shield {...sx("h-4 w-4")} />
                  <Label className="text-sm font-medium">{m.copy_require_approval()}</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>
                  {m.copy_approve_new_collaborators_before_they_join()}
                </p>
              </div>
              <Switch
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleSettingChange("requireApproval", checked)}
              />
            </div>
          </div>

          <div {...sx("grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t space-y-4")}>
            {/* Conflict Resolution */}
            <div {...sx("space-y-2")}>
              <Label className="text-sm font-medium">{m.copy_conflict_resolution()}</Label>
              <Select
                items={conflictResolutionItems}
                value={settings.conflictResolution}
                onValueChange={(value) => {
                  if (value !== null) handleSettingChange("conflictResolution", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="last-writer-wins">
                      <div {...sx("flex items-center gap-2")}>
                        <Edit {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>{m.copy_last_writer_wins()}</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            {m.copy_most_recent_edit_takes_precedence()}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="manual">
                      <div {...sx("flex items-center gap-2")}>
                        <Shield {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>{m.copy_manual_resolution()}</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            {m.copy_prompt_user_to_resolve_conflicts()}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="auto-merge">
                      <div {...sx("flex items-center gap-2")}>
                        <Zap {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>{m.copy_auto_merge()}</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            {m.copy_automatically_merge_compatible_changes()}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Default Role */}
            <div {...sx("space-y-2")}>
              <Label className="text-sm font-medium">
                {m.copy_default_role_for_new_collaborators()}
              </Label>
              <Select
                items={collaborationRoleItems}
                value={settings.defaultRole}
                onValueChange={(value) => {
                  if (value !== null) handleSettingChange("defaultRole", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="collaborator">
                      <div {...sx("flex items-center gap-2")}>
                        <Edit {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>{m.copy_collaborator()}</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            {m.copy_can_edit_and_add_content()}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div {...sx("flex items-center gap-2")}>
                        <Eye {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>{m.copy_viewer()}</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            {m.copy_can_view_but_not_edit()}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div {...sx("grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4")}>
            <div {...sx("p-3 rounded-lg border")}>
              <div {...sx("flex items-center gap-2 mb-2")}>
                <Crown {...sx("h-4 w-4 text-yellow-600")} />
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs"
                >
                  {m.copy_owner()}
                </Badge>
              </div>
              <ul {...sx("text-xs space-y-1 text-muted-foreground")}>
                <li>{m.copy_full_editing_access()}</li>
                <li>{m.copy_manage_participants()}</li>
                <li>{m.copy_end_sessions()}</li>
                <li>{m.copy_change_permissions()}</li>
              </ul>
            </div>

            <div {...sx("p-3 rounded-lg border")}>
              <div {...sx("flex items-center gap-2 mb-2")}>
                <Edit {...sx("h-4 w-4 text-blue-600")} />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs"
                >
                  {m.copy_collaborator()}
                </Badge>
              </div>
              <ul {...sx("text-xs space-y-1 text-muted-foreground")}>
                <li>{m.copy_edit_content()}</li>
                <li>{m.copy_create_branches()}</li>
                <li>{m.copy_add_messages()}</li>
                <li>{m.copy_view_all_content()}</li>
              </ul>
            </div>

            <div {...sx("p-3 rounded-lg border")}>
              <div {...sx("flex items-center gap-2 mb-2")}>
                <Eye {...sx("h-4 w-4 text-gray-600")} />
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs"
                >
                  {m.copy_viewer()}
                </Badge>
              </div>
              <ul {...sx("text-xs space-y-1 text-muted-foreground")}>
                <li>{m.copy_view_content_only()}</li>
                <li>{m.copy_see_live_cursors()}</li>
                <li>{m.copy_follow_changes()}</li>
                <li>{m.copy_no_editing_access()}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
