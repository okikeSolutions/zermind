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

interface CollaborationSettingsProps {
  className?: string;
}

const conflictResolutionItems = [
  { value: "last-writer-wins", label: "Last Writer Wins" },
  { value: "manual", label: "Manual Resolution" },
  { value: "auto-merge", label: "Auto Merge" },
] as const;

const collaborationRoleItems = [
  { value: "collaborator", label: "Collaborator" },
  { value: "viewer", label: "Viewer" },
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
    toast.success("Collaboration preferences updated");
  };

  return (
    <div {...sx(`space-y-4 sm:space-y-6 ${className}`)}>
      {/* Collaboration Features */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users {...sx("h-4 w-4 sm:h-5 sm:w-5")} />
            Real-time Collaboration
          </CardTitle>
          <CardDescription className="text-sm">
            Configure how collaboration works in your mind maps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div {...sx("grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6")}>
            {/* Show Cursors */}
            <div {...sx("flex items-center justify-between space-x-2")}>
              <div {...sx("space-y-0.5")}>
                <div {...sx("flex items-center gap-2")}>
                  <MousePointer {...sx("h-4 w-4")} />
                  <Label className="text-sm font-medium">Real-time Cursors</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>
                  Show other users&apos; cursors in mind maps
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
                  <Label className="text-sm font-medium">Live Presence</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>
                  Show who&apos;s online and collaborating
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
                  <Label className="text-sm font-medium">Auto Layout</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>Automatically arrange mind map nodes</p>
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
                  <Label className="text-sm font-medium">Require Approval</Label>
                </div>
                <p {...sx("text-xs text-muted-foreground")}>
                  Approve new collaborators before they join
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
              <Label className="text-sm font-medium">Conflict Resolution</Label>
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
                          <p {...sx("font-medium")}>Last Writer Wins</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            Most recent edit takes precedence
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="manual">
                      <div {...sx("flex items-center gap-2")}>
                        <Shield {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>Manual Resolution</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            Prompt user to resolve conflicts
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="auto-merge">
                      <div {...sx("flex items-center gap-2")}>
                        <Zap {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>Auto Merge</p>
                          <p {...sx("text-xs text-muted-foreground")}>
                            Automatically merge compatible changes
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
              <Label className="text-sm font-medium">Default Role for New Collaborators</Label>
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
                          <p {...sx("font-medium")}>Collaborator</p>
                          <p {...sx("text-xs text-muted-foreground")}>Can edit and add content</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div {...sx("flex items-center gap-2")}>
                        <Eye {...sx("h-4 w-4")} />
                        <div>
                          <p {...sx("font-medium")}>Viewer</p>
                          <p {...sx("text-xs text-muted-foreground")}>Can view but not edit</p>
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
                  Owner
                </Badge>
              </div>
              <ul {...sx("text-xs space-y-1 text-muted-foreground")}>
                <li>• Full editing access</li>
                <li>• Manage participants</li>
                <li>• End sessions</li>
                <li>• Change permissions</li>
              </ul>
            </div>

            <div {...sx("p-3 rounded-lg border")}>
              <div {...sx("flex items-center gap-2 mb-2")}>
                <Edit {...sx("h-4 w-4 text-blue-600")} />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs"
                >
                  Collaborator
                </Badge>
              </div>
              <ul {...sx("text-xs space-y-1 text-muted-foreground")}>
                <li>• Edit content</li>
                <li>• Create branches</li>
                <li>• Add messages</li>
                <li>• View all content</li>
              </ul>
            </div>

            <div {...sx("p-3 rounded-lg border")}>
              <div {...sx("flex items-center gap-2 mb-2")}>
                <Eye {...sx("h-4 w-4 text-gray-600")} />
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs"
                >
                  Viewer
                </Badge>
              </div>
              <ul {...sx("text-xs space-y-1 text-muted-foreground")}>
                <li>• View content only</li>
                <li>• See live cursors</li>
                <li>• Follow changes</li>
                <li>• No editing access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
