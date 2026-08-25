import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Bot, Paperclip, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModelCapabilities, modelSupportsAttachments } from "@/lib/utils/model-utils";

// Popular OpenRouter models
import { sx } from "@/styles/sx";
const MODELS = [
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Best for reasoning, analysis, and coding",
    tier: "premium",
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fast and efficient for simple tasks",
    tier: "standard",
  },
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    description: "Latest multimodal model from OpenAI",
    tier: "premium",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    description: "Faster and cheaper version of GPT-5",
    tier: "standard",
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B",
    provider: "Meta",
    description: "Open source, great for general tasks",
    tier: "premium",
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct",
    name: "Llama 3.1 70B",
    provider: "Meta",
    description: "Balanced performance and speed",
    tier: "standard",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
  className,
}: ModelSelectorProps) {
  const currentModel = MODELS.find((model) => model.id === selectedModel) || MODELS[0];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Helper function to get attachment icons for a model
  const getAttachmentIcons = (modelId: string) => {
    const capabilities = getModelCapabilities(modelId);
    const icons = [];

    if (capabilities.supportsImages && capabilities.supportsDocuments) {
      icons.push(
        <div key="image" title="Supports images and documents">
          <ImageIcon {...sx("h-3 w-3 text-primary")} />
          <FileText {...sx("h-3 w-3 text-primary")} />
        </div>,
      );
    } else if (capabilities.supportsImages) {
      icons.push(
        <div key="image" title="Supports images">
          <ImageIcon {...sx("h-3 w-3 text-primary")} />
        </div>,
      );
    } else if (capabilities.supportsDocuments) {
      icons.push(
        <div key="document" title="Supports documents">
          <FileText {...sx("h-3 w-3 text-primary")} />
        </div>,
      );
    }

    if (icons.length === 0) {
      return null;
    }

    return (
      <div {...sx("flex items-center space-x-1")} title="Supports file attachments">
        {icons}
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-between min-w-0 w-full sm:min-w-[200px] h-9 sm:h-10 text-sm",
              className,
            )}
          />
        }
      >
        <div {...sx("flex items-center space-x-1.5 sm:space-x-2 min-w-0")}>
          <Bot {...sx("h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0")} />
          <span {...sx("truncate text-xs sm:text-sm")}>{currentModel.name}</span>
          {modelSupportsAttachments(selectedModel) && (
            <Paperclip {...sx("h-3 w-3 text-primary flex-shrink-0")} />
          )}
        </div>
        <ChevronDown {...sx("h-3 w-3 sm:h-4 sm:w-4 opacity-50 flex-shrink-0")} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 sm:w-80 max-h-[70vh] overflow-y-auto">
        <div {...sx("px-2 py-1.5 text-sm font-medium")}>Select AI Model</div>
        <DropdownMenuSeparator />

        {/* Group by provider */}
        {["Anthropic", "OpenAI", "Meta", "Google"].map((provider) => {
          const providerModels = MODELS.filter((model) => model.provider === provider);
          if (providerModels.length === 0) return null;

          return (
            <DropdownMenuGroup key={provider}>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                {provider}
              </DropdownMenuLabel>
              {providerModels.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className={cn(
                    "flex flex-col items-start p-2 sm:p-3 cursor-pointer min-h-[3rem] sm:min-h-[3.5rem]",
                    selectedModel === model.id && "bg-accent",
                  )}
                >
                  <div {...sx("flex items-center justify-between w-full")}>
                    <div {...sx("flex items-center space-x-2 flex-1 min-w-0")}>
                      <span {...sx("font-medium text-sm sm:text-base truncate")}>{model.name}</span>
                      {getAttachmentIcons(model.id)}
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs flex-shrink-0 ml-2", getTierColor(model.tier))}
                    >
                      {model.tier}
                    </Badge>
                  </div>
                  <span {...sx("text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1")}>
                    {model.description}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          );
        })}

        <div {...sx("px-2 py-1")}>
          <p {...sx("text-xs text-muted-foreground")}>
            Powered by{" "}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              {...sx("underline hover:text-foreground")}
            >
              OpenRouter
            </a>
          </p>
          <div {...sx("flex items-center space-x-4 mt-2 text-xs text-muted-foreground")}>
            <div {...sx("flex items-center space-x-1")}>
              <ImageIcon {...sx("h-3 w-3 text-primary")} />
              <span>Images</span>
            </div>
            <div {...sx("flex items-center space-x-1")}>
              <FileText {...sx("h-3 w-3 text-primary")} />
              <span>Documents</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
