import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConversationNode, ConversationNodeData } from "./mind-map-node";
import { Brain, GitBranch, Plus, Zap } from "lucide-react";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  parentId?: string;
  branchName?: string;
  xPosition?: number;
  yPosition?: number;
}

interface MindMapViewProps {
  messages: Message[];
  onResumeConversation: (nodeId: string) => void;
  onCreateBranch: (parentNodeId: string) => void;
  onCreateMultiModelBranch?: (parentNodeId: string) => void;
  onNodePositionChange?: (nodeId: string, x: number, y: number) => void;
}

// Define custom node types
const nodeTypes = {
  conversationNode: ConversationNode,
};

// Helper function to detect multi-model branches (siblings from same parent with different models)
function detectMultiModelBranches(messages: Message[]): Map<string, string[]> {
  const siblingGroups = new Map<string, string[]>();

  // Group messages by parent
  const parentToChildren = new Map<string, Message[]>();
  messages.forEach((msg) => {
    if (msg.parentId) {
      const siblings = parentToChildren.get(msg.parentId) || [];
      siblings.push(msg);
      parentToChildren.set(msg.parentId, siblings);
    }
  });

  // Find groups where multiple AI models responded to the same parent
  parentToChildren.forEach((children) => {
    const aiChildren = children.filter((child) => child.role === "assistant" && child.model);
    if (aiChildren.length > 1) {
      const models = aiChildren.map((child) => child.model!);
      const uniqueModels = [...new Set(models)];
      if (uniqueModels.length > 1) {
        // This is a multi-model comparison
        aiChildren.forEach((child) => {
          const siblingModels = uniqueModels.filter((model) => model !== child.model);
          siblingGroups.set(child.id, siblingModels);
        });
      }
    }
  });

  return siblingGroups;
}

// Enhanced layout algorithm for multi-model branches
function calculateNodePositions(messages: Message[], multiModelGroups: Map<string, string[]>) {
  const positioned = new Map<string, { x: number; y: number }>();
  const processed = new Set<string>();

  // First, use stored positions for messages that have them
  messages.forEach((msg) => {
    if (
      msg.xPosition !== undefined &&
      msg.yPosition !== undefined &&
      msg.xPosition !== 0 &&
      msg.yPosition !== 0
    ) {
      // Use stored position if it's not the default (0, 0)
      positioned.set(msg.id, { x: msg.xPosition, y: msg.yPosition });
      processed.add(msg.id);
    }
  });

  // Only calculate positions for messages that don't have stored positions
  const unpositionedMessages = messages.filter((msg) => !processed.has(msg.id));

  if (unpositionedMessages.length === 0) {
    return positioned; // All messages have stored positions
  }

  // Calculate positions for unpositioned messages
  const rootNodes = unpositionedMessages.filter((msg) => !msg.parentId);
  let currentY = 0;

  // Find the lowest Y position of existing positioned nodes to avoid overlap
  if (positioned.size > 0) {
    const existingPositions = Array.from(positioned.values());
    const maxY = Math.max(...existingPositions.map((p) => p.y));
    currentY = maxY + 300; // Start below existing nodes
  }

  // Position root nodes that don't have stored positions
  rootNodes.forEach((node, index) => {
    if (!positioned.has(node.id)) {
      positioned.set(node.id, { x: index * 400, y: currentY });
      processed.add(node.id);
    }
  });

  // Process levels for unpositioned messages
  let currentLevel = rootNodes;
  while (currentLevel.length > 0) {
    currentY += 250;
    const nextLevel: Message[] = [];

    currentLevel.forEach((parent) => {
      const children = unpositionedMessages.filter((msg) => msg.parentId === parent.id);

      if (children.length === 0) return;

      // Check if this is a multi-model comparison
      const aiChildren = children.filter((child) => child.role === "assistant");
      const hasMultiModel = aiChildren.some((child) => multiModelGroups.has(child.id));

      if (hasMultiModel && aiChildren.length > 1) {
        // Arrange multi-model responses side by side
        const parentPos = positioned.get(parent.id)!;
        const totalWidth = (aiChildren.length - 1) * 350;
        const startX = parentPos.x - totalWidth / 2;

        aiChildren.forEach((child, index) => {
          if (!positioned.has(child.id)) {
            positioned.set(child.id, {
              x: startX + index * 350,
              y: currentY,
            });
            processed.add(child.id);
            nextLevel.push(child);
          }
        });

        // Position any user messages
        const userChildren = children.filter((child) => child.role === "user");
        userChildren.forEach((child, index) => {
          if (!positioned.has(child.id)) {
            positioned.set(child.id, {
              x: parentPos.x + (index - userChildren.length / 2) * 300,
              y: currentY + 125,
            });
            processed.add(child.id);
            nextLevel.push(child);
          }
        });
      } else {
        // Normal spacing for non-comparison branches
        const parentPos = positioned.get(parent.id)!;
        children.forEach((child, index) => {
          if (!positioned.has(child.id)) {
            positioned.set(child.id, {
              x: parentPos.x + (index - children.length / 2) * 300,
              y: currentY,
            });
            processed.add(child.id);
            nextLevel.push(child);
          }
        });
      }
    });

    currentLevel = nextLevel.filter((msg) => !processed.has(msg.id));
  }

  return positioned;
}

export function MindMapView({
  messages,
  onResumeConversation,
  onCreateBranch,
  onCreateMultiModelBranch,
  onNodePositionChange,
}: MindMapViewProps) {
  // Detect multi-model branches
  const multiModelGroups = useMemo(() => detectMultiModelBranches(messages), [messages]);

  // Calculate enhanced positions
  const nodePositions = useMemo(
    () => calculateNodePositions(messages, multiModelGroups),
    [messages, multiModelGroups],
  );

  // Convert messages to React Flow nodes with enhanced positioning
  const nodes: Node<ConversationNodeData>[] = useMemo(() => {
    return messages.map((message) => {
      const position = nodePositions.get(message.id) || {
        x: message.xPosition || 0,
        y: message.yPosition || 0,
      };

      const siblingModels = multiModelGroups.get(message.id) || [];
      const isMultiModelBranch = siblingModels.length > 0;

      return {
        id: message.id,
        type: "conversationNode",
        position,
        data: {
          id: message.id,
          role: message.role,
          content: message.content,
          model: message.model,
          branchName: message.branchName,
          nodeType: "conversation",
          isMultiModelBranch,
          siblingModels,
          onResumeConversation,
          onCreateBranch,
          onCreateMultiModelBranch,
        },
      };
    });
  }, [
    messages,
    nodePositions,
    multiModelGroups,
    onResumeConversation,
    onCreateBranch,
    onCreateMultiModelBranch,
  ]);

  // Enhanced edges with styling for multi-model comparisons
  const edges: Edge[] = useMemo(() => {
    return messages
      .filter((message) => message.parentId)
      .map((message) => {
        const isMultiModelChild = multiModelGroups.has(message.id);

        return {
          id: `${message.parentId}-${message.id}`,
          source: message.parentId!,
          target: message.id,
          type: "smoothstep",
          animated: isMultiModelChild,
          style: {
            stroke: isMultiModelChild ? "#a855f7" : "#8b5cf6",
            strokeWidth: isMultiModelChild ? 3 : 2,
            strokeDasharray: isMultiModelChild ? "5 5" : undefined,
          },
          label: isMultiModelChild ? m.copy_compare() : undefined,
          labelStyle: {
            fontSize: "10px",
            fontWeight: "bold",
            fill: "#a855f7",
          },
        };
      });
  }, [messages, multiModelGroups]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Enhanced onNodesChange to handle position updates
  const handleNodesChange = useCallback(
    (changes: NodeChange<Node<ConversationNodeData>>[]) => {
      // Apply the changes to nodes
      onNodesChange(changes);

      // Check if any of the changes are position changes and call the callback
      if (onNodePositionChange) {
        changes.forEach((change) => {
          // Handle position changes
          if (change.type === "position" && "position" in change && change.position) {
            onNodePositionChange(change.id, change.position.x, change.position.y);
          }
        });
      }
    },
    [onNodesChange, onNodePositionChange],
  );

  // Update nodes when messages change - preserve user-dragged positions
  React.useEffect(() => {
    const currentNodeIds = new Set(reactFlowNodes.map((node) => node.id));
    const newNodeIds = new Set(nodes.map((node) => node.id));

    // Check if there are actual changes (additions or removals)
    const hasChanges =
      currentNodeIds.size !== newNodeIds.size ||
      [...currentNodeIds].some((id) => !newNodeIds.has(id)) ||
      [...newNodeIds].some((id) => !currentNodeIds.has(id));

    if (hasChanges) {
      // Merge new nodes with existing positions to preserve user-dragged positions
      const updatedNodes = nodes.map((newNode) => {
        const existingNode = reactFlowNodes.find((n) => n.id === newNode.id);
        return existingNode ? { ...newNode, position: existingNode.position } : newNode;
      });
      setNodes(updatedNodes);
    }
  }, [nodes, reactFlowNodes, setNodes]);

  // Update edges when messages change - only update if there are actual changes
  React.useEffect(() => {
    const currentEdgeIds = new Set(reactFlowEdges.map((edge) => edge.id));
    const newEdgeIds = new Set(edges.map((edge) => edge.id));

    // Check if there are actual changes (additions or removals)
    const hasChanges =
      currentEdgeIds.size !== newEdgeIds.size ||
      [...currentEdgeIds].some((id) => !newEdgeIds.has(id)) ||
      [...newEdgeIds].some((id) => !currentEdgeIds.has(id));

    if (hasChanges) {
      setEdges(edges);
    }
  }, [edges, reactFlowEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Handle node drag stop to save position
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onNodePositionChange) {
        onNodePositionChange(node.id, node.position.x, node.position.y);
      }
    },
    [onNodePositionChange],
  );

  // Statistics
  const totalNodes = messages.length;
  const userNodes = messages.filter((m) => m.role === "user").length;
  const assistantNodes = messages.filter((m) => m.role === "assistant").length;
  const multiModelComparisons = Array.from(multiModelGroups.keys()).length;
  const uniqueModels = new Set(messages.filter((m) => m.model).map((m) => m.model)).size;

  return (
    <div {...sx("w-full h-full bg-background")}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeColor="#8b5cf6"
          nodeStrokeWidth={3}
          pannable
          zoomable
          style={{ backgroundColor: "var(--card)" }}
        />

        {/* Enhanced Info Panel */}
        <Panel
          position="top-left"
          {...sx("bg-background/80 backdrop-blur-sm rounded-lg border p-2 sm:p-4 max-w-[320px]")}
        >
          <div {...sx("flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2")}>
            <div {...sx("flex items-center gap-2")}>
              <Brain {...sx("h-4 w-4 sm:h-5 sm:w-5 text-purple-500")} />
              <h3 {...sx("font-semibold text-sm sm:text-base")}>{m.copy_mind_map()}</h3>
            </div>
            {multiModelComparisons > 0 && (
              <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                <Zap {...sx("h-3 w-3 mr-1")} /> {m.copy_multi_model()}
              </Badge>
            )}
          </div>

          <div {...sx("flex flex-wrap items-center gap-1 sm:gap-2 text-sm text-muted-foreground")}>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              {totalNodes} nodes
            </Badge>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              {userNodes} user
            </Badge>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              {assistantNodes} {m.copy_ai()}
            </Badge>
            {uniqueModels > 1 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {uniqueModels} models
              </Badge>
            )}
            {multiModelComparisons > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0.5 bg-secondary text-secondary-foreground"
              >
                {multiModelComparisons} comparisons
              </Badge>
            )}
          </div>

          {selectedNodeId && (
            <div {...sx("mt-2 pt-2 border-t")}>
              <p {...sx("text-xs text-muted-foreground truncate")}>
                {m.copy_selected()} {selectedNodeId.slice(0, 8)}...
              </p>
            </div>
          )}
        </Panel>

        {/* Enhanced Action Panel */}
        <Panel
          position="top-right"
          {...sx(
            "bg-background/80 backdrop-blur-sm rounded-lg border p-2 sm:p-4 max-w-[140px] sm:max-w-none",
          )}
        >
          <div {...sx("flex flex-col gap-1 sm:gap-2")}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => selectedNodeId && onCreateBranch(selectedNodeId)}
              disabled={!selectedNodeId}
              className="w-full min-h-[36px] sm:min-h-auto text-xs sm:text-sm px-2 sm:px-3"
            >
              <GitBranch {...sx("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2")} />
              <span {...sx("hidden sm:inline")}>{m.copy_create_branch()}</span>
              <span {...sx("sm:hidden")}>{m.copy_branch()}</span>
            </Button>

            {/* Multi-Model Branch Button */}
            {onCreateMultiModelBranch && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => selectedNodeId && onCreateMultiModelBranch(selectedNodeId)}
                disabled={!selectedNodeId}
                className="w-full min-h-[36px] sm:min-h-auto text-xs sm:text-sm px-2 sm:px-3 bg-secondary text-secondary-foreground"
                title={m.copy_compare_multiple_ai_models()}
              >
                <Zap {...sx("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2")} />
                <span {...sx("hidden sm:inline")}>{m.copy_multi_model_2()}</span>
                <span {...sx("sm:hidden")}>{m.copy_multi()}</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => selectedNodeId && onResumeConversation(selectedNodeId)}
              disabled={!selectedNodeId}
              className="w-full min-h-[36px] sm:min-h-auto text-xs sm:text-sm px-2 sm:px-3"
            >
              <Plus {...sx("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2")} />
              <span {...sx("hidden sm:inline")}>{m.copy_continue_chat()}</span>
              <span {...sx("sm:hidden")}>{m.copy_continue()}</span>
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
