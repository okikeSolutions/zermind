"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, User, Plus, GitBranch, Play, Zap } from "lucide-react";
import {
  getProviderFromModel,
  getProviderDisplayName,
  getModelDisplayName,
} from "@/lib/utils/model-utils";

export interface ConversationNodeData extends Record<string, unknown> {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  branchName?: string;
  nodeType?: "conversation" | "branching_point" | "insight";
  isMultiModelBranch?: boolean;
  siblingModels?: string[];
  onResumeConversation?: (nodeId: string) => void;
  onCreateBranch?: (nodeId: string) => void;
  onCreateMultiModelBranch?: (nodeId: string) => void;
}

function getModelTheme(model?: string) {
  if (!model)
    return {
      bg: "bg-muted",
      border: "border-muted",
      accent: "text-muted-foreground",
    };

  const provider = getProviderFromModel(model);

  switch (provider) {
    case "openai":
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/80",
        border: "border-emerald-200 dark:border-emerald-800",
        accent: "text-emerald-600 dark:text-emerald-400",
        icon: "text-emerald-600",
      };
    case "anthropic":
      return {
        bg: "bg-orange-50 dark:bg-orange-950/80",
        border: "border-orange-200 dark:border-orange-800",
        accent: "text-orange-600 dark:text-orange-400",
        icon: "text-orange-600",
      };
    case "google":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/80",
        border: "border-blue-200 dark:border-blue-800",
        accent: "text-blue-600 dark:text-blue-400",
        icon: "text-blue-600",
      };
    case "meta":
      return {
        bg: "bg-purple-50 dark:bg-purple-950/80",
        border: "border-purple-200 dark:border-purple-800",
        accent: "text-purple-600 dark:text-purple-400",
        icon: "text-purple-600",
      };
    default:
      return {
        bg: "bg-slate-50 dark:bg-slate-950/80",
        border: "border-slate-200 dark:border-slate-800",
        accent: "text-slate-600 dark:text-slate-400",
        icon: "text-slate-600",
      };
  }
}

export const ConversationNode = memo(
  ({ data, selected }: NodeProps & { data: ConversationNodeData }) => {
    const {
      role,
      content,
      model,
      branchName,
      nodeType,
      isMultiModelBranch,
      siblingModels,
      onResumeConversation,
      onCreateBranch,
      onCreateMultiModelBranch,
    } = data;

    const isUser = role === "user";
    const truncatedContent = content.length > 100 ? content.slice(0, 100) + "..." : content;

    const modelTheme = getModelTheme(model);
    const hasModelComparison = siblingModels && siblingModels.length > 0;

    return (
      <div className={`conversation-node ${selected ? "selected" : ""}`}>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-border" />

        <Card
          className={`w-80 shadow-md border-2 transition-all ${
            selected
              ? "border-purple-500 shadow-lg"
              : `border-border hover:border-purple-300 ${isUser ? "" : modelTheme.border}`
          } ${isUser ? "bg-blue-50 dark:bg-blue-950/20" : modelTheme.bg}`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isUser ? (
                  <User className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bot className={`h-4 w-4 ${modelTheme.icon}`} />
                )}
                <span className="text-sm font-medium">
                  {isUser ? "You" : getModelDisplayName(model || "Assistant")}
                </span>
                <div className="flex flex-col items-start gap-1">
                  {!isUser && model && (
                    <Badge variant="outline" className={`text-xs ${modelTheme.accent}`}>
                      {getProviderDisplayName(getProviderFromModel(model))}
                    </Badge>
                  )}

                  {isMultiModelBranch && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Multi-Model
                    </Badge>
                  )}

                  {branchName && (
                    <Badge variant="outline" className="text-xs">
                      {branchName}
                    </Badge>
                  )}

                  {nodeType === "branching_point" && (
                    <Badge variant="secondary" className="text-xs">
                      <GitBranch className="h-3 w-3 mr-1" />
                      Branch
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {hasModelComparison && (
              <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Compared with:</span>
                <div className="flex gap-1 flex-wrap">
                  {siblingModels!.slice(0, 3).map((siblingModel) => {
                    const siblingTheme = getModelTheme(siblingModel);
                    return (
                      <Badge
                        key={siblingModel}
                        variant="outline"
                        className={`text-xs ${siblingTheme.accent}`}
                      >
                        {getProviderDisplayName(getProviderFromModel(siblingModel))}
                      </Badge>
                    );
                  })}
                  {siblingModels!.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{siblingModels!.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
              {truncatedContent}
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResumeConversation?.(data.id)}
                className="flex-1"
              >
                <Play className="h-3 w-3 mr-1" />
                Resume
              </Button>

              <Button size="sm" variant="outline" onClick={() => onCreateBranch?.(data.id)}>
                <Plus className="h-3 w-3" />
              </Button>

              {onCreateMultiModelBranch && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCreateMultiModelBranch(data.id)}
                  className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-950/70"
                  title="Compare multiple AI models"
                >
                  <Zap className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-border" />
      </div>
    );
  },
);

ConversationNode.displayName = "ConversationNode";
