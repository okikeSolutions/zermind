"use client";

import { useCallback, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PositionUpdate {
  id: string;
  xPosition: number;
  yPosition: number;
}

export function useNodePositions() {
  const updatePositions = useMutation(api.zermindNodes.updatePositions);
  const pendingPositionUpdates = useRef<Map<string, { x: number; y: number }>>(new Map());
  const positionUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateNodePositions = useCallback(
    async (updates: PositionUpdate[]) => {
      try {
        return await updatePositions({
          updates: updates.map((update) => ({
            agentMessageId: update.id,
            xPosition: update.xPosition,
            yPosition: update.yPosition,
          })),
        });
      } catch (error) {
        console.error("Failed to update node positions:", error);
        throw error;
      }
    },
    [updatePositions],
  );

  const savePendingPositions = useCallback(async () => {
    if (positionUpdateTimeout.current) {
      clearTimeout(positionUpdateTimeout.current);
    }

    const updates = Array.from(pendingPositionUpdates.current.entries()).map(
      ([id, position]: [string, { x: number; y: number }]) => ({
        id,
        xPosition: position.x,
        yPosition: position.y,
      }),
    );

    if (updates.length > 0) {
      try {
        await updateNodePositions(updates);
        pendingPositionUpdates.current.clear();
      } catch (error) {
        console.error("Failed to save pending positions:", error);
      }
    }
  }, [updateNodePositions]);

  const handleNodePositionChange = useCallback(
    (nodeId: string, x: number, y: number) => {
      pendingPositionUpdates.current.set(nodeId, { x, y });

      if (positionUpdateTimeout.current) {
        clearTimeout(positionUpdateTimeout.current);
      }

      positionUpdateTimeout.current = setTimeout(() => {
        const updates = Array.from(pendingPositionUpdates.current.entries()).map(
          ([id, position]: [string, { x: number; y: number }]) => ({
            id,
            xPosition: position.x,
            yPosition: position.y,
          }),
        );

        if (updates.length > 0) {
          updateNodePositions(updates).catch((error) => {
            console.error("Failed to save node positions:", error);
          });
          pendingPositionUpdates.current.clear();
        }
      }, 1000);
    },
    [updateNodePositions],
  );

  useEffect(() => {
    return () => {
      savePendingPositions().catch((error) => {
        console.error("Failed to save pending positions on unmount:", error);
      });

      if (positionUpdateTimeout.current) {
        clearTimeout(positionUpdateTimeout.current);
      }
    };
  }, [savePendingPositions]);

  return {
    handleNodePositionChange,
    savePendingPositions,
    hasPendingUpdates: () => pendingPositionUpdates.current.size > 0,
  };
}
