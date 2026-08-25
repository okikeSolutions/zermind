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
import { sx } from "@/styles/sx";

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
        bg: "bg-card",
        border: "border-border",
        accent: "text-emerald-600",
        icon: "text-emerald-600",
      };
    case "anthropic":
      return {
        bg: "bg-card",
        border: "border-border",
        accent: "text-orange-600",
        icon: "text-orange-600",
      };
    case "google":
      return {
        bg: "bg-card",
        border: "border-border",
        accent: "text-blue-600",
        icon: "text-blue-600",
      };
    case "meta":
      return {
        bg: "bg-card",
        border: "border-border",
        accent: "text-purple-600",
        icon: "text-purple-600",
      };
    default:
      return {
        bg: "bg-card",
        border: "border-border",
        accent: "text-slate-600",
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
      <div {...sx(`conversation-node ${selected ? "selected" : ""}`)}>
        <Handle type="target" position={Position.Top} {...sx("w-3 h-3 bg-border")} />

        <Card
          className={`w-80 shadow-md border-2 transition-all ${
            selected
              ? "border-purple-500 shadow-lg"
              : `border-border hover:border-purple-300 ${isUser ? "" : modelTheme.border}`
          } ${isUser ? "bg-card" : modelTheme.bg}`}
        >
          <CardHeader className="pb-2">
            <div {...sx("flex items-center justify-between")}>
              <div {...sx("flex items-center gap-2")}>
                {isUser ? (
                  <User {...sx("h-4 w-4 text-blue-600")} />
                ) : (
                  <Bot {...sx(`h-4 w-4 ${modelTheme.icon}`)} />
                )}
                <span {...sx("text-sm font-medium")}>
                  {isUser ? "You" : getModelDisplayName(model || "Assistant")}
                </span>
                <div {...sx("flex flex-col items-start gap-1")}>
                  {!isUser && model && (
                    <Badge variant="outline" className={`text-xs ${modelTheme.accent}`}>
                      {getProviderDisplayName(getProviderFromModel(model))}
                    </Badge>
                  )}

                  {isMultiModelBranch && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-secondary text-secondary-foreground"
                    >
                      <Zap {...sx("h-3 w-3 mr-1")} />
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
                      <GitBranch {...sx("h-3 w-3 mr-1")} />
                      Branch
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {hasModelComparison && (
              <div {...sx("flex items-center gap-1 mt-2 pt-2 border-t border-border/50")}>
                <span {...sx("text-xs text-muted-foreground")}>Compared with:</span>
                <div {...sx("flex gap-1 flex-wrap")}>
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
            <p {...sx("text-sm text-muted-foreground mb-3 whitespace-pre-wrap")}>
              {truncatedContent}
            </p>

            <div {...sx("flex items-center gap-2")}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResumeConversation?.(data.id)}
                className="flex-1"
              >
                <Play {...sx("h-3 w-3 mr-1")} />
                Resume
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onCreateBranch?.(data.id)}
                aria-label="Create branch"
              >
                <Plus {...sx("h-3 w-3")} />
              </Button>

              {onCreateMultiModelBranch && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCreateMultiModelBranch(data.id)}
                  aria-label="Compare multiple AI models"
                  className="bg-secondary text-secondary-foreground"
                  title="Compare multiple AI models"
                >
                  <Zap {...sx("h-3 w-3")} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Handle type="source" position={Position.Bottom} {...sx("w-3 h-3 bg-border")} />
      </div>
    );
  },
);

ConversationNode.displayName = "ConversationNode";
