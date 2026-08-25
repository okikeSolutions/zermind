import { type ReactNode } from "react";
import { useRealtimeCollaboration } from "@/hooks/use-realtime-collaboration";

interface CollaborationPresenceWrapperProps {
  enabled: boolean;
  chatId: string;
  userId: string;
  userName: string;
  children: (state: ReturnType<typeof useRealtimeCollaboration>) => ReactNode;
}

function ActiveCollaborationPresence({
  chatId,
  userId,
  userName,
  children,
}: Omit<CollaborationPresenceWrapperProps, "enabled">) {
  const state = useRealtimeCollaboration({ chatId, userId, userName });
  return children(state);
}

export function CollaborationPresenceWrapper({
  enabled,
  chatId,
  userId,
  userName,
  children,
}: CollaborationPresenceWrapperProps) {
  if (!enabled) {
    return children({
      isConnected: false,
      collaborativeUsers: [],
      userColor: "#3B82F6",
      broadcastAction: async () => undefined,
      updateCursorPosition: () => undefined,
      updateSelectedNode: () => undefined,
    });
  }

  return (
    <ActiveCollaborationPresence chatId={chatId} userId={userId} userName={userName}>
      {children}
    </ActiveCollaborationPresence>
  );
}
