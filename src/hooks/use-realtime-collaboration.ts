import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

// Types for collaboration
export interface CollaborativeUser {
  id: string;
  name: string;
  email?: string;
  cursor?: {
    x: number;
    y: number;
  };
  color: string;
  online_at: string;
}

export interface MindMapAction {
  type:
    | "node_move"
    | "node_select"
    | "node_create"
    | "node_delete"
    | "cursor_move"
    | "user_join"
    | "user_leave";
  nodeId?: string;
  position?: { x: number; y: number };
  userId: string;
  userName: string;
  userColor: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface UseRealtimeCollaborationProps {
  chatId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  onAction?: (action: MindMapAction) => void;
  onPresenceChange?: (users: CollaborativeUser[]) => void;
}

// Color palette for different users
const USER_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

const EVENT_ACTION_TYPE = "mind_map_action";
const EVENT_USER_JOIN_TYPE = "user_join";
const EVENT_USER_LEAVE_TYPE = "user_leave";

export function useRealtimeCollaboration({
  chatId,
  userId,
  userName,
  onAction,
  onPresenceChange,
}: UseRealtimeCollaborationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborativeUsers, setCollaborativeUsers] = useState<
    CollaborativeUser[]
  >([]);
  const [userColor, setUserColor] = useState<string>("#3B82F6");
  const [shouldAnnounceJoin, setShouldAnnounceJoin] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Use refs for stable callback references
  const onActionRef = useRef(onAction);
  const onPresenceChangeRef = useRef(onPresenceChange);

  // Use refs for stable values to avoid dependency issues
  const userColorRef = useRef(userColor);
  const isConnectedRef = useRef(isConnected);
  const announceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update refs when callbacks change
  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);

  useEffect(() => {
    onPresenceChangeRef.current = onPresenceChange;
  }, [onPresenceChange]);

  // Update refs when state changes
  useEffect(() => {
    userColorRef.current = userColor;
  }, [userColor]);

  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // Handle user join announcement after color assignment
  useEffect(() => {
    if (!shouldAnnounceJoin || !channel || !isConnected || !userColor) return;

    // Clear any existing timeout
    if (announceTimeoutRef.current) {
      clearTimeout(announceTimeoutRef.current);
    }

    // Announce user join after a small delay
    announceTimeoutRef.current = setTimeout(async () => {
      const joinAction: MindMapAction = {
        type: "user_join",
        userId,
        userName,
        userColor,
        timestamp: Date.now(),
      };

      try {
        await channel.send({
          type: "broadcast",
          event: EVENT_USER_JOIN_TYPE,
          payload: joinAction,
        });
        setShouldAnnounceJoin(false);
      } catch (error) {
        console.warn("Failed to announce user join:", error);
      }
    }, 100);

    return () => {
      if (announceTimeoutRef.current) {
        clearTimeout(announceTimeoutRef.current);
        announceTimeoutRef.current = null;
      }
    };
  }, [shouldAnnounceJoin, channel, isConnected, userColor, userId, userName]);

  // Broadcast an action to other users
  const broadcastAction = useCallback(
    async (
      action: Omit<
        MindMapAction,
        "userId" | "userName" | "userColor" | "timestamp"
      >
    ) => {
      if (!channel || !isConnectedRef.current) return;

      const fullAction: MindMapAction = {
        ...action,
        userId,
        userName,
        userColor: userColorRef.current,
        timestamp: Date.now(),
      };

      try {
        await channel.send({
          type: "broadcast",
          event: EVENT_ACTION_TYPE,
          payload: fullAction,
        });
      } catch (error) {
        console.warn("Failed to broadcast action:", error);
      }
    },
    [channel, userId, userName] // Only include stable dependencies
  );

  // Update cursor position
  const updateCursorPosition = useCallback(
    (x: number, y: number) => {
      broadcastAction({
        type: "cursor_move",
        position: { x, y },
      });
    },
    [broadcastAction]
  );

  // Update selected node
  const updateSelectedNode = useCallback(
    (nodeId: string | null) => {
      if (nodeId) {
        broadcastAction({
          type: "node_select",
          nodeId,
        });
      }
    },
    [broadcastAction]
  );

  // Initialize collaboration channel
  useEffect(() => {
    if (!chatId || !userId) return;

    const roomName = `chat-collaboration:${chatId}`;
    const newChannel = supabase.channel(roomName);

    // Handle mind map actions
    newChannel.on("broadcast", { event: EVENT_ACTION_TYPE }, ({ payload }) => {
      const action = payload as MindMapAction;

      // Ignore actions from ourselves
      if (action.userId === userId) return;

      onActionRef.current?.(action);
    });

    // Handle user joins
    newChannel.on(
      "broadcast",
      { event: EVENT_USER_JOIN_TYPE },
      ({ payload }) => {
        const action = payload as MindMapAction;

        if (action.userId === userId) return;

        // Add user to collaborative users list
        const newUser: CollaborativeUser = {
          id: action.userId,
          name: action.userName,
          color: action.userColor,
          online_at: new Date(action.timestamp).toISOString(),
        };

        setCollaborativeUsers((current) => {
          const filtered = current.filter((u) => u.id !== action.userId);
          const updated = [...filtered, newUser];
          onPresenceChangeRef.current?.(updated);
          return updated;
        });
      }
    );

    // Handle user leaves
    newChannel.on(
      "broadcast",
      { event: EVENT_USER_LEAVE_TYPE },
      ({ payload }) => {
        const action = payload as MindMapAction;

        if (action.userId === userId) return;

        setCollaborativeUsers((current) => {
          const updated = current.filter((u) => u.id !== action.userId);
          onPresenceChangeRef.current?.(updated);
          return updated;
        });
      }
    );

    // Subscribe to the channel
    newChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        setIsConnected(true);
        console.log("Realtime collaboration connected to:", roomName);

        // Assign a color for this user synchronously
        setCollaborativeUsers((currentUsers) => {
          const availableColors = USER_COLORS.filter(
            (color) => !currentUsers.some((user) => user.color === color)
          );
          const assignedColor =
            availableColors[0] ||
            USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

          // Set the user color and trigger announcement
          setUserColor(assignedColor);
          setShouldAnnounceJoin(true);

          return currentUsers; // Don't change users here
        });
      } else if (status === "CHANNEL_ERROR") {
        setIsConnected(false);
        console.error("Realtime channel error");
      } else if (status === "TIMED_OUT") {
        setIsConnected(false);
        console.error("Realtime connection timed out");
      } else if (status === "CLOSED") {
        setIsConnected(false);
        console.log("Realtime channel closed");
      } else {
        setIsConnected(false);
        console.log("Realtime collaboration status:", status);
      }
    });

    setChannel(newChannel);

    // Cleanup on unmount
    return () => {
      // Clear any pending announcement timeout
      if (announceTimeoutRef.current) {
        clearTimeout(announceTimeoutRef.current);
        announceTimeoutRef.current = null;
      }

      // Announce user leave before cleanup
      if (newChannel && isConnectedRef.current) {
        const leaveAction: MindMapAction = {
          type: "user_leave",
          userId,
          userName,
          userColor: userColorRef.current,
          timestamp: Date.now(),
        };

        // Use sendBeacon for reliable delivery during page unload
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          try {
            const beaconData = JSON.stringify({
              chatId,
              action: leaveAction,
            });
            navigator.sendBeacon("/api/collaboration/beacon", beaconData);
          } catch (error) {
            console.warn("Failed to send user leave beacon:", error);
            // Fallback to channel send if beacon fails
            newChannel
              .send({
                type: "broadcast",
                event: EVENT_USER_LEAVE_TYPE,
                payload: leaveAction,
              })
              .catch((error) => {
                console.warn("Failed to announce user leave:", error);
              });
          }
        } else {
          // Fallback for environments without sendBeacon
          newChannel
            .send({
              type: "broadcast",
              event: EVENT_USER_LEAVE_TYPE,
              payload: leaveAction,
            })
            .catch((error) => {
              console.warn("Failed to announce user leave:", error);
            });
        }
      }

      supabase.removeChannel(newChannel);
      setChannel(null);
      setIsConnected(false);
      setCollaborativeUsers([]);
      setShouldAnnounceJoin(false);
    };
  }, [chatId, supabase, userId, userName]); // Only include truly stable dependencies

  return {
    isConnected,
    collaborativeUsers,
    userColor,
    broadcastAction,
    updateCursorPosition,
    updateSelectedNode,
  };
}
