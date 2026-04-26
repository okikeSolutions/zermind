"use client";

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
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

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
  chatTitle = "Untitled Chat",
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
      toast.success("Collaboration session started!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start collaboration";
      toast.error(message);
    }
  }, [convexChatId, startSession]);

  const leaveCollaboration = useCallback(async () => {
    if (!session) return;
    try {
      await leaveSession({ sessionId: session.id });
      toast.success("Left collaboration session");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to leave collaboration";
      toast.error(message);
    }
  }, [leaveSession, session]);

  const endCollaboration = useCallback(async () => {
    if (!session) return;
    try {
      await endSession({ chatId: convexChatId, sessionId: session.id });
      toast.success("Collaboration session ended for all participants");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to end collaboration session";
      toast.error(message);
    }
  }, [convexChatId, endSession, session]);

  // Copy collaboration link
  const copyCollaborationLink = useCallback(() => {
    const url = `${window.location.origin}/collaborate/${chatId}?collaborate=true`;
    navigator.clipboard.writeText(url);
    toast.success("Collaboration link copied to clipboard!");
  }, [chatId]);

  // Send invitation
  const sendInvitation = useCallback(async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      await inviteToSession({
        chatId: convexChatId,
        inviteeEmail: inviteEmail,
        role: inviteRole,
        chatTitle,
      });

      toast.success(`Invitation recorded for ${inviteEmail}!`);
      setInviteEmail("");
      setIsDialogOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(errorMessage);
    }
  }, [chatTitle, convexChatId, inviteEmail, inviteRole, inviteToSession]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3" />;
      case "collaborator":
        return <Edit className="h-3 w-3" />;
      case "viewer":
        return <Eye className="h-3 w-3" />;
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
        <Users className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">{isStarting ? "Starting..." : "Collaborate"}</span>
        <span className="sm:hidden">{isStarting ? "..." : "Collab"}</span>
      </Button>
    );
  }

  // If we're loading (only when hasActiveSession is true), show loading state
  if (isLoading) {
    return (
      <Button disabled size="sm" variant="outline" className={className}>
        <Users className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Loading...</span>
        <span className="sm:hidden">...</span>
      </Button>
    );
  }

  // If we have a session, show the active collaboration dropdown
  if (session) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className={className}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  <span className="hidden sm:inline">
                    {session.participantCount}
                    {session.participantCount === 1 ? " user" : " users"}
                  </span>
                  <span className="sm:hidden">{session.participantCount}</span>
                  {getRoleIcon(effectiveUserRole)}
                </span>
                {/* Realtime connection indicator */}
                {isRealtimeConnected ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-orange-500" />
                )}
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Collaboration Active</p>
              <p className="text-xs text-muted-foreground">
                {session.participantCount} participants
              </p>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="secondary" className={`${getRoleColor(effectiveUserRole)}`}>
                  {getRoleIcon(effectiveUserRole)}
                  <span className="ml-1 capitalize">{effectiveUserRole}</span>
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isRealtimeConnected ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-orange-500" />
                      <span>Reconnecting...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyCollaborationLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Owner-only: End session for everyone */}
            {effectiveUserRole === "owner" && (
              <DropdownMenuItem
                onClick={() => void endCollaboration()}
                disabled={isEnding}
                className="text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                {isEnding ? "Ending..." : "End Session for All"}
              </DropdownMenuItem>
            )}
            {/* Individual leave option */}
            <DropdownMenuItem
              onClick={() => void leaveCollaboration()}
              disabled={isLeaving}
              className={effectiveUserRole === "owner" ? "" : "text-destructive"}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLeaving ? "Leaving..." : "Leave Session"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Invitation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite to Collaboration</DialogTitle>
              <DialogDescription>
                Invite others to collaborate on &ldquo;{chatTitle}&rdquo;
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
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
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(value: "collaborator" | "viewer") => setInviteRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collaborator">
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Collaborator</p>
                          <p className="text-xs text-muted-foreground">Can edit and add content</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Viewer</p>
                          <p className="text-xs text-muted-foreground">Can view but not edit</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={copyCollaborationLink} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button onClick={sendInvitation} className="flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invite
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
      <Users className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">{isStarting ? "Starting..." : "Collaborate"}</span>
      <span className="sm:hidden">{isStarting ? "..." : "Collab"}</span>
    </Button>
  );
}
