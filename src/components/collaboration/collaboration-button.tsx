import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Copy,
  Share2,
  Crown,
  Eye,
  Edit,
  MoreHorizontal,
  X,
  LogOut,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/lib/rate-limit-error";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const collaborationRoleItems = [
  { value: "collaborator", label: m.copy_collaborator() },
  { value: "viewer", label: m.copy_viewer() },
] as const;

interface CollaborationButtonProps {
  chatId: string;
  chatTitle?: string;
  isCollaborative?: boolean;
  currentUserRole?: "owner" | "collaborator" | "viewer";
  className?: string;
  isRealtimeConnected?: boolean;
}

export function CollaborationButton({
  chatId,
  chatTitle = m.copy_untitled_chat(),
  currentUserRole = "owner",
  className,
  isRealtimeConnected = false,
}: CollaborationButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"collaborator" | "viewer">("collaborator");
  const convexChatId = chatId as Id<"chats">;
  const session = useQuery(
    api.collaboration.getSession,
    chatId ? { chatId: convexChatId } : "skip",
  );
  const startSession = useMutation(api.collaboration.start);
  const leaveSession = useMutation(api.collaboration.leave);
  const endSession = useMutation(api.collaboration.end);
  const inviteToSession = useMutation(api.collaboration.invite);
  const isLoading = session === undefined;
  const isStarting = false;
  const isLeaving = false;
  const isEnding = false;
  const effectiveUserRole = session?.userRole ?? currentUserRole;
  const hasActiveSession = Boolean(session);

  const startCollaboration = useCallback(async () => {
    try {
      await startSession({ chatId: convexChatId });
      toast.success(m.copy_collaboration_session_started());
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, m.copy_failed_to_start_collaboration()));
    }
  }, [convexChatId, startSession]);

  const leaveCollaboration = useCallback(async () => {
    if (!session) return;
    try {
      await leaveSession({ sessionId: session.id });
      toast.success(m.copy_left_collaboration_session());
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, m.copy_failed_to_leave_collaboration()));
    }
  }, [leaveSession, session]);

  const endCollaboration = useCallback(async () => {
    if (!session) return;
    try {
      await endSession({ chatId: convexChatId, sessionId: session.id });
      toast.success(m.copy_collaboration_session_ended_for_all_participants());
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, m.copy_failed_to_end_collaboration_session()));
    }
  }, [convexChatId, endSession, session]);

  // Copy collaboration link
  const copyCollaborationLink = useCallback(() => {
    const url = `${window.location.origin}/collaborate/${chatId}?collaborate=true`;
    navigator.clipboard.writeText(url);
    toast.success(m.copy_collaboration_link_copied_to_clipboard());
  }, [chatId]);

  // Send invitation
  const sendInvitation = useCallback(async () => {
    if (!inviteEmail) {
      toast.error(m.copy_please_enter_an_email_address());
      return;
    }

    try {
      await inviteToSession({
        chatId: convexChatId,
        inviteeEmail: inviteEmail,
        role: inviteRole,
        chatTitle,
      });

      toast.success(m.copy_invitation_recorded_for({ email: inviteEmail }));
      setInviteEmail("");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, m.copy_failed_to_send_invitation()));
    }
  }, [chatTitle, convexChatId, inviteEmail, inviteRole, inviteToSession]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown {...sx("h-3 w-3")} />;
      case "collaborator":
        return <Edit {...sx("h-3 w-3")} />;
      case "viewer":
        return <Eye {...sx("h-3 w-3")} />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "collaborator":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  // If we don't have an active session and we're not loading, show the start button
  if (!hasActiveSession && !isLoading) {
    return (
      <Button
        onClick={() => void startCollaboration()}
        disabled={isStarting}
        size="sm"
        variant="outline"
        className={className}
      >
        <Users {...sx("h-4 w-4 mr-2")} />
        <span {...sx("hidden sm:inline")}>
          {isStarting ? m.copy_starting() : m.copy_collaborate()}
        </span>
        <span {...sx("sm:hidden")}>{isStarting ? "..." : m.copy_collab()}</span>
      </Button>
    );
  }

  // If we're loading (only when hasActiveSession is true), show loading state
  if (isLoading) {
    return (
      <Button disabled size="sm" variant="outline" className={className}>
        <Users {...sx("h-4 w-4 mr-2")} />
        <span {...sx("hidden sm:inline")}>{m.copy_loading()}</span>
        <span {...sx("sm:hidden")}>...</span>
      </Button>
    );
  }

  // If we have a session, show the active collaboration dropdown
  if (session) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button size="sm" variant="outline" className={className} />}
          >
            <div {...sx("flex items-center gap-2")}>
              <Users {...sx("h-4 w-4")} />
              <span {...sx("flex items-center gap-1")}>
                <span {...sx("hidden sm:inline")}>
                  {session.participantCount}
                  {session.participantCount === 1 ? " user" : " users"}
                </span>
                <span {...sx("sm:hidden")}>{session.participantCount}</span>
                {getRoleIcon(effectiveUserRole)}
              </span>
              {/* Realtime connection indicator */}
              {isRealtimeConnected ? (
                <Wifi {...sx("h-3 w-3 text-green-500")} />
              ) : (
                <WifiOff {...sx("h-3 w-3 text-orange-500")} />
              )}
              <MoreHorizontal {...sx("h-4 w-4")} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div {...sx("px-2 py-1.5")}>
              <p {...sx("text-sm font-medium")}>{m.copy_collaboration_active()}</p>
              <p {...sx("text-xs text-muted-foreground")}>
                {session.participantCount} participants
              </p>
              <div {...sx("flex items-center justify-between mt-1")}>
                <Badge variant="secondary" className={`${getRoleColor(effectiveUserRole)}`}>
                  {getRoleIcon(effectiveUserRole)}
                  <span {...sx("ml-1 capitalize")}>{effectiveUserRole}</span>
                </Badge>
                <div {...sx("flex items-center gap-1 text-xs text-muted-foreground")}>
                  {isRealtimeConnected ? (
                    <>
                      <Wifi {...sx("h-3 w-3 text-green-500")} />
                      <span>{m.copy_connected()}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff {...sx("h-3 w-3 text-orange-500")} />
                      <span>{m.copy_reconnecting()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              <UserPlus {...sx("h-4 w-4 mr-2")} /> {m.copy_invite_users()}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyCollaborationLink}>
              <Copy {...sx("h-4 w-4 mr-2")} /> {m.copy_copy_link()}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Owner-only: End session for everyone */}
            {effectiveUserRole === "owner" && (
              <DropdownMenuItem
                onClick={() => void endCollaboration()}
                disabled={isEnding}
                className="text-destructive"
              >
                <X {...sx("h-4 w-4 mr-2")} />
                {isEnding ? m.copy_ending() : m.copy_end_session_for_all()}
              </DropdownMenuItem>
            )}
            {/* Individual leave option */}
            <DropdownMenuItem
              onClick={() => void leaveCollaboration()}
              disabled={isLeaving}
              className={effectiveUserRole === "owner" ? "" : "text-destructive"}
            >
              <LogOut {...sx("h-4 w-4 mr-2")} />
              {isLeaving ? m.copy_leaving() : m.copy_leave_session()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Invitation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{m.copy_invite_to_collaboration()}</DialogTitle>
              <DialogDescription>
                {m.copy_invite_others_to_collaborate_on_ldquo()}
                {chatTitle}&rdquo;
              </DialogDescription>
            </DialogHeader>
            <div {...sx("space-y-4")}>
              <div {...sx("space-y-2")}>
                <Label htmlFor="email">{m.copy_email_address()}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={m.copy_colleague_example_com()}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendInvitation();
                    }
                  }}
                />
              </div>
              <div {...sx("space-y-2")}>
                <Label htmlFor="role">{m.copy_role()}</Label>
                <Select
                  items={collaborationRoleItems}
                  value={inviteRole}
                  onValueChange={(value) => {
                    if (value !== null) setInviteRole(value);
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
              <div {...sx("flex justify-between gap-3")}>
                <Button variant="outline" onClick={copyCollaborationLink} className="flex-1">
                  <Share2 {...sx("h-4 w-4 mr-2")} /> {m.copy_copy_link()}
                </Button>
                <Button onClick={sendInvitation} className="flex-1">
                  <UserPlus {...sx("h-4 w-4 mr-2")} /> {m.copy_send_invite()}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Fallback: show start button if something went wrong
  return (
    <Button
      onClick={() => void startCollaboration()}
      disabled={isStarting}
      size="sm"
      variant="outline"
      className={className}
    >
      <Users {...sx("h-4 w-4 mr-2")} />
      <span {...sx("hidden sm:inline")}>
        {isStarting ? m.copy_starting() : m.copy_collaborate()}
      </span>
      <span {...sx("sm:hidden")}>{isStarting ? "..." : m.copy_collab()}</span>
    </Button>
  );
}
