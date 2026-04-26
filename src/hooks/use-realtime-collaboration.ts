"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import usePresence from "@convex-dev/presence/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

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

const USER_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

type PresenceData = {
  name?: string;
  email?: string;
  color?: string;
  cursor?: { x: number; y: number };
  selectedNodeId?: string | null;
  updatedAt?: number;
};

function colorForUser(userId: string) {
  let hash = 0;
  for (let index = 0; index < userId.length; index += 1) {
    hash = (hash * 31 + userId.charCodeAt(index)) >>> 0;
  }
  return USER_COLORS[hash % USER_COLORS.length];
}

function isPresenceData(value: unknown): value is PresenceData {
  return typeof value === "object" && value !== null;
}

export function useRealtimeCollaboration({
  chatId,
  userId,
  userName,
  userEmail,
  onAction,
  onPresenceChange,
}: UseRealtimeCollaborationProps) {
  const roomId = `chat-collaboration:${chatId}`;
  const userColor = useMemo(() => colorForUser(userId || userName), [userId, userName]);
  const updatePresenceData = useMutation(api.presence.updateData);
  const presenceState = usePresence(api.presence, roomId, userId);

  const latestDataRef = useRef<PresenceData>({
    name: userName,
    email: userEmail,
    color: userColor,
  });

  const onPresenceChangeRef = useRef(onPresenceChange);
  const onActionRef = useRef(onAction);

  useEffect(() => {
    onPresenceChangeRef.current = onPresenceChange;
  }, [onPresenceChange]);

  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);

  const writePresenceData = useCallback(
    async (data: PresenceData) => {
      if (!roomId || !userId) return;
      latestDataRef.current = {
        ...latestDataRef.current,
        ...data,
        name: userName,
        email: userEmail,
        color: userColor,
        updatedAt: Date.now(),
      };

      try {
        await updatePresenceData({
          roomId,
          userId,
          data: latestDataRef.current,
        });
      } catch (error) {
        console.warn("Failed to update collaboration presence:", error);
      }
    },
    [roomId, updatePresenceData, userColor, userEmail, userId, userName],
  );

  useEffect(() => {
    if (!roomId || !userId) return;
    void writePresenceData({});
  }, [roomId, userId, writePresenceData]);

  const collaborativeUsers = useMemo<CollaborativeUser[]>(() => {
    return (presenceState ?? [])
      .filter((presence) => presence.userId !== userId && presence.online)
      .map((presence) => {
        const data = isPresenceData(presence.data) ? presence.data : {};
        return {
          id: presence.userId,
          name: data.name || presence.name || presence.userId,
          email: data.email,
          cursor: data.cursor,
          color: data.color || colorForUser(presence.userId),
          online_at: data.updatedAt
            ? new Date(data.updatedAt).toISOString()
            : new Date(presence.lastDisconnected || 0).toISOString(),
        };
      });
  }, [presenceState, userId]);

  useEffect(() => {
    onPresenceChangeRef.current?.(collaborativeUsers);
  }, [collaborativeUsers]);

  const broadcastAction = useCallback(
    async (action: Omit<MindMapAction, "userId" | "userName" | "userColor" | "timestamp">) => {
      if (action.type === "cursor_move" && action.position) {
        await writePresenceData({ cursor: action.position });
        return;
      }

      if (action.type === "node_select") {
        await writePresenceData({ selectedNodeId: action.nodeId ?? null });
        return;
      }

      // Persistent collaboration state now flows through Convex mutations/queries.
      // This compatibility callback keeps old call sites safe until richer
      // collaboration events are modeled explicitly in Convex.
      onActionRef.current?.({
        ...action,
        userId,
        userName,
        userColor,
        timestamp: Date.now(),
      });
    },
    [userColor, userId, userName, writePresenceData],
  );

  const updateCursorPosition = useCallback(
    (x: number, y: number) => {
      void writePresenceData({ cursor: { x, y } });
    },
    [writePresenceData],
  );

  const updateSelectedNode = useCallback(
    (nodeId: string | null) => {
      void writePresenceData({ selectedNodeId: nodeId });
    },
    [writePresenceData],
  );

  return {
    isConnected: !!roomId && !!userId && presenceState !== undefined,
    collaborativeUsers,
    userColor,
    broadcastAction,
    updateCursorPosition,
    updateSelectedNode,
  };
}
