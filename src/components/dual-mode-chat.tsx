"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryClient } from "@tanstack/react-query";
import { ChatConversation } from "@/components/chat-conversation";
import { MindMapView } from "@/components/mind-map/mind-map-view";
import { ResumeMessageInput } from "@/components/resume-message-input";
import { CreateBranchInput } from "@/components/create-branch-input";
import { CreateMultiModelBranch } from "@/components/create-multi-model-branch";
import { useChatModeStore } from "@/lib/store/chat-mode-store";
import { useAuthUser } from "@/hooks/use-auth";
import { useChatWithMessages } from "@/hooks/use-chats-query";
import { useNodePositions } from "@/hooks/use-node-positions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, X } from "lucide-react";
import { CollaborationButton } from "@/components/collaboration/collaboration-button";
import { RealtimeCursors, CollaborationPresence } from "@/components/mind-map/realtime-cursors";
import { useRealtimeCollaboration } from "@/hooks/use-realtime-collaboration";
import { chatKeys } from "@/hooks/use-chats-query";
import { conversationContextKeys } from "@/hooks/use-conversation-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  parentId?: string;
  branchName?: string;
  xPosition?: number;
  yPosition?: number;
  nodeType?: "conversation" | "branching_point" | "insight";
  isCollapsed?: boolean;
  isLocked?: boolean;
  lastEditedBy?: string;
  editedAt?: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    name: string;
    mimeType: string;
    size: number;
    url: string;
    type: "image" | "document";
  }>;
}

interface DualModeChatProps {
  chatId: string;
  initialMessages: Message[]; // Keep for SSR hydration, but use live data after mount
  userId: string;
  chatTitle?: string;
  enableCollaboration?: boolean; // Optional prop to enable collaboration
}

// Error handler for collaboration features
function handleCollaborationError(error: Error, errorInfo: unknown) {
  // Log the error for debugging purposes
  console.warn("Collaboration Error Boundary caught an error:", error, errorInfo);

  // You can also log the error to an error reporting service here
  // Example: errorReportingService.captureException(error, { extra: errorInfo });
}

// Fallback component for collaboration errors (silently fail)
function CollaborationErrorFallback() {
  return null; // Silently fail collaboration features without breaking the rest of the app
}

export function DualModeChat({
  chatId,
  initialMessages,
  userId,
  chatTitle,
  enableCollaboration = false, // Default to false
}: DualModeChatProps) {
  const { mode } = useChatModeStore();
  const { user } = useAuthUser();
  const queryClient = useQueryClient();
  const [resumeFromNodeId, setResumeFromNodeId] = useState<string | null>(null);
  const [createBranchFromNodeId, setCreateBranchFromNodeId] = useState<string | null>(null);
  const [createMultiModelFromNodeId, setCreateMultiModelFromNodeId] = useState<string | null>(null);

  // Use custom hook for node position management
  const { handleNodePositionChange, savePendingPositions } = useNodePositions();

  // Use live data from React Query instead of static initialMessages
  const { data: liveData } = useChatWithMessages(chatId, userId);

  // Use live data if available, fallback to initial messages during loading
  const messages = liveData?.messages || initialMessages;
  const currentChatTitle = liveData?.title || chatTitle;

  // Get display name from user data with fallback
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      // Extract name from email (before @ symbol) as fallback
      return user.email.split("@")[0];
    }
    return "User"; // Final fallback
  };

  // Real-time collaboration hook - always called but conditionally active
  const collaborationState = useRealtimeCollaboration({
    chatId: enableCollaboration ? chatId : "", // Empty chatId disables the hook
    userId,
    userName: getUserDisplayName(),
    onAction: (action) => {
      if (enableCollaboration) {
        console.log("Received collaborative action:", action);
        // Handle collaborative actions here
      }
    },
    onPresenceChange: (users) => {
      if (enableCollaboration) {
        console.log("Collaboration presence changed:", users);
      }
    },
  });

  // Safely extract values with defaults
  const { collaborativeUsers = [], isConnected: isRealtimeConnected = false } =
    collaborationState || { collaborativeUsers: [], isConnected: false };

  // Handle resuming conversation from a specific node
  const handleResumeConversation = useCallback((nodeId: string) => {
    setResumeFromNodeId(nodeId);
    setCreateBranchFromNodeId(null); // Clear branch creation if active
    setCreateMultiModelFromNodeId(null); // Clear multi-model creation if active
    console.log("Resuming conversation from node:", nodeId);
  }, []);

  // Handle creating a new branch from a node
  const handleCreateBranch = useCallback((parentNodeId: string) => {
    setCreateBranchFromNodeId(parentNodeId);
    setResumeFromNodeId(null); // Clear resume if active
    setCreateMultiModelFromNodeId(null); // Clear multi-model creation if active
    console.log("Creating branch from node:", parentNodeId);
  }, []);

  // Handle creating a multi-model comparison branch
  const handleCreateMultiModelBranch = useCallback((parentNodeId: string) => {
    setCreateMultiModelFromNodeId(parentNodeId);
    setResumeFromNodeId(null); // Clear resume if active
    setCreateBranchFromNodeId(null); // Clear single branch creation if active
    console.log("Creating multi-model branch from node:", parentNodeId);
  }, []);

  // Handle successful message sent in resume mode
  const handleResumeMessageSent = useCallback(() => {
    // Invalidate all relevant queries to refresh the mind map
    queryClient.invalidateQueries({
      queryKey: chatKeys.details(),
      predicate: (query) => query.queryKey.includes(chatId),
    });

    // Invalidate conversation context queries
    queryClient.invalidateQueries({
      queryKey: conversationContextKeys.all,
    });

    // Update chat list to show latest message
    queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

    console.log("Resume message sent successfully - queries invalidated");
  }, [queryClient, chatId]);

  // Handle successful branch creation
  const handleBranchCreated = useCallback(() => {
    // Invalidate all relevant queries to refresh the mind map
    queryClient.invalidateQueries({
      queryKey: chatKeys.details(),
      predicate: (query) => query.queryKey.includes(chatId),
    });

    // Invalidate conversation context queries
    queryClient.invalidateQueries({
      queryKey: conversationContextKeys.all,
    });

    // Update chat list to show latest message
    queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

    console.log("Branch created successfully - queries invalidated");
  }, [queryClient, chatId]);

  // Handle successful multi-model branch creation
  const handleMultiModelBranchCreated = useCallback(() => {
    // Invalidate all relevant queries to refresh the mind map
    queryClient.invalidateQueries({
      queryKey: chatKeys.details(),
      predicate: (query) => query.queryKey.includes(chatId),
    });

    // Invalidate conversation context queries
    queryClient.invalidateQueries({
      queryKey: conversationContextKeys.all,
    });

    // Update chat list to show latest message
    queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

    console.log("Multi-model branch created successfully - queries invalidated");
  }, [queryClient, chatId]);

  // Clear all active actions
  const clearAllActions = useCallback(() => {
    setResumeFromNodeId(null);
    setCreateBranchFromNodeId(null);
    setCreateMultiModelFromNodeId(null);
  }, []);

  // Add keyboard event handler for Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const hasActiveAction =
          resumeFromNodeId || createBranchFromNodeId || createMultiModelFromNodeId;
        if (hasActiveAction) {
          clearAllActions();
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [resumeFromNodeId, createBranchFromNodeId, createMultiModelFromNodeId, clearAllActions]);

  // Save pending node positions on component unmount or navigation
  useEffect(() => {
    return () => {
      // Save any pending position changes when component unmounts
      savePendingPositions();
    };
  }, [savePendingPositions]);

  // Convert messages to mind map format with proper typing
  const mindMapMessages = messages.map((msg, index) => ({
    ...msg,
    xPosition: msg.xPosition || (index % 3) * 400,
    yPosition: msg.yPosition || Math.floor(index / 3) * 250,
    // Convert all nullish fields to undefined for proper typing
    model: msg.model || undefined,
    parentId: msg.parentId || undefined,
    branchName: msg.branchName || undefined,
    lastEditedBy: msg.lastEditedBy || undefined,
    editedAt: msg.editedAt || undefined,
  }));

  // Check if any action is active
  const hasActiveAction = resumeFromNodeId || createBranchFromNodeId || createMultiModelFromNodeId;

  // Get active action name for better UX
  const getActiveActionName = () => {
    if (resumeFromNodeId) return "Resume Conversation";
    if (createBranchFromNodeId) return "Create Branch";
    if (createMultiModelFromNodeId) return "Create Multi-Model Branch";
    return "";
  };

  if (mode === "mind") {
    return (
      <div className="flex flex-col h-full">
        {/* Mind Mode Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <h2 className="font-semibold">{currentChatTitle || "Mind Map Chat"}</h2>
                <p className="text-xs text-muted-foreground">
                  Interactive conversation visualization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
              >
                <Brain className="h-3 w-3 mr-1" />
                Mind Mode
              </Badge>

              {/* Collaboration Controls */}
              <ErrorBoundary
                FallbackComponent={CollaborationErrorFallback}
                onError={handleCollaborationError}
              >
                <CollaborationButton
                  chatId={chatId}
                  chatTitle={currentChatTitle}
                  currentUserRole="owner"
                  isRealtimeConnected={isRealtimeConnected}
                />
              </ErrorBoundary>

              {/* Enhanced Clear Actions Button */}
              {hasActiveAction && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={clearAllActions}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <X className="h-3 w-3" />
                  <span className="hidden sm:inline">Close {getActiveActionName()}</span>
                  <span className="sm:hidden">Close</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Collaboration Presence Indicator */}
        {collaborativeUsers.length > 0 && (
          <ErrorBoundary
            FallbackComponent={CollaborationErrorFallback}
            onError={handleCollaborationError}
          >
            <div className="px-4 py-2 border-b bg-muted/30">
              <CollaborationPresence users={collaborativeUsers} />
            </div>
          </ErrorBoundary>
        )}

        {/* Mind Map View */}
        <div className="flex-1 overflow-hidden relative">
          <MindMapView
            messages={mindMapMessages}
            onResumeConversation={handleResumeConversation}
            onCreateBranch={handleCreateBranch}
            onCreateMultiModelBranch={handleCreateMultiModelBranch}
            onNodePositionChange={handleNodePositionChange}
          />

          {/* Real-time Cursors Overlay */}
          {collaborativeUsers.length > 0 && (
            <ErrorBoundary
              FallbackComponent={CollaborationErrorFallback}
              onError={handleCollaborationError}
            >
              <RealtimeCursors users={collaborativeUsers} />
            </ErrorBoundary>
          )}
        </div>

        {/* Resume Conversation Panel */}
        {resumeFromNodeId && (
          <div className="relative">
            {/* Panel Header with Close Button */}
            <div className="absolute top-2 right-2 z-10">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setResumeFromNodeId(null)}
                className="h-6 w-6 p-0 rounded-full bg-background/80 hover:bg-background border shadow-sm"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <ResumeMessageInput
              chatId={chatId}
              parentNodeId={resumeFromNodeId}
              onClose={() => setResumeFromNodeId(null)}
              onMessageSent={handleResumeMessageSent}
            />
          </div>
        )}

        {/* Create Branch Panel */}
        {createBranchFromNodeId && (
          <div className="relative">
            {/* Panel Header with Close Button */}
            <div className="absolute top-2 right-2 z-10">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCreateBranchFromNodeId(null)}
                className="h-6 w-6 p-0 rounded-full bg-background/80 hover:bg-background border shadow-sm"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <CreateBranchInput
              chatId={chatId}
              parentNodeId={createBranchFromNodeId}
              onClose={() => setCreateBranchFromNodeId(null)}
              onBranchCreated={handleBranchCreated}
            />
          </div>
        )}

        {/* Create Multi-Model Branch Panel */}
        {createMultiModelFromNodeId && (
          <div className="relative">
            {/* Panel Header with Close Button */}
            <div className="absolute top-2 right-2 z-10">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCreateMultiModelFromNodeId(null)}
                className="h-6 w-6 p-0 rounded-full bg-background/80 hover:bg-background border shadow-sm"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <CreateMultiModelBranch
              chatId={chatId}
              parentNodeId={createMultiModelFromNodeId}
              onClose={() => setCreateMultiModelFromNodeId(null)}
              onBranchCreated={handleMultiModelBranchCreated}
            />
          </div>
        )}
      </div>
    );
  }

  // Traditional Chat Mode
  return (
    <div className="flex flex-col h-full">
      {/* Chat Mode Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <div>
              <h2 className="font-semibold">{currentChatTitle || "Chat"}</h2>
              <p className="text-xs text-muted-foreground">Traditional linear conversation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Chat Mode
            </Badge>

            {/* Collaboration Controls */}
            <ErrorBoundary
              FallbackComponent={CollaborationErrorFallback}
              onError={handleCollaborationError}
            >
              <CollaborationButton
                chatId={chatId}
                chatTitle={currentChatTitle}
                currentUserRole="owner"
                isRealtimeConnected={isRealtimeConnected}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Traditional Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatConversation
          chatId={chatId}
          initialMessages={messages.map((msg) => ({
            ...msg,
            role: msg.role as "user" | "assistant",
            createdAt: new Date(msg.createdAt),
            attachments: msg.attachments || [],
            xPosition: msg.xPosition || 0,
            yPosition: msg.yPosition || 0,
            nodeType: msg.nodeType || "conversation",
            isCollapsed: msg.isCollapsed || false,
            isLocked: msg.isLocked || false,
            editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
            // Convert nullish model to undefined for consistency
            model: msg.model || undefined,
            parentId: msg.parentId || undefined,
            branchName: msg.branchName || undefined,
            lastEditedBy: msg.lastEditedBy || undefined,
          }))}
          userId={userId}
          chatTitle={currentChatTitle}
        />
      </div>
    </div>
  );
}
