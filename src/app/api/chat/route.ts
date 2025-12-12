import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";
import { logModelUsage } from "@/lib/usage-logger";
import { createClient } from "@/lib/supabase/server";
import { getActiveApiKey } from "@/lib/db/api-keys";
import { type Provider } from "@/lib/schemas/api-keys";

// Attachment schema for AI SDK experimental_attachments
const AISDKAttachmentSchema = z.object({
  name: z.string().optional(),
  contentType: z.string().optional(),
  url: z.string(),
});

// Request schema with experimental_attachments only
const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
      experimental_attachments: z
        .array(AISDKAttachmentSchema)
        .optional()
        .default([]),
    })
  ),
  model: z.string().optional().default("openai/gpt-4o-mini"),
  maxTokens: z.number().optional().default(1000),
  temperature: z.number().optional().default(0.7),
  stream: z.boolean().optional().default(true),
});

// Helper function to determine provider from model
function getProviderFromModel(model: string): Provider {
  if (model.startsWith("openai/") || model.startsWith("gpt-")) {
    return "openai";
  }
  if (model.startsWith("anthropic/") || model.startsWith("claude-")) {
    return "anthropic";
  }
  if (model.startsWith("google/") || model.startsWith("gemini-")) {
    return "google";
  }
  if (model.startsWith("meta/") || model.startsWith("llama-")) {
    return "meta";
  }
  // Default to OpenRouter for any other models
  return "openrouter";
}

// Helper function to create the appropriate AI provider
async function createAIProvider(model: string, userId: string) {
  const provider = getProviderFromModel(model);

  // Try to get user's API key first
  let userApiKey: string | null = null;
  if (userId !== "anonymous") {
    try {
      userApiKey = await getActiveApiKey(userId, provider);
    } catch (error) {
      console.error(`Error fetching user API key for ${provider}:`, error);
    }
  }

  // If user has their own API key for the specific provider, use direct API
  if (userApiKey) {
    switch (provider) {
      case "openai":
        return {
          provider: createOpenAI({ apiKey: userApiKey }),
          model: model.replace("openai/", ""),
          usingUserKey: true,
        };

      case "anthropic":
        return {
          provider: createAnthropic({ apiKey: userApiKey }),
          model: model.replace("anthropic/", ""),
          usingUserKey: true,
        };

      case "google":
        return {
          provider: createGoogleGenerativeAI({ apiKey: userApiKey }),
          model: model.replace("google/", ""),
          usingUserKey: true,
        };

      case "openrouter":
      case "meta":
      default:
        return {
          provider: createOpenRouter({ apiKey: userApiKey }),
          model: model, // OpenRouter expects full model names
          usingUserKey: true,
        };
    }
  }

  // No user key found - always fallback to OpenRouter
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterKey) {
    throw new Error(
      "OpenRouter API key not configured. Please add your own API key in settings or configure OPENROUTER_API_KEY environment variable."
    );
  }

  // Convert model names to OpenRouter format if needed
  let openrouterModel = model;
  if (!model.includes("/")) {
    // Handle bare model names like "gpt-4" → "openai/gpt-4"
    switch (provider) {
      case "openai":
        openrouterModel = `openai/${model}`;
        break;
      case "anthropic":
        openrouterModel = `anthropic/${model}`;
        break;
      case "google":
        openrouterModel = `google/${model}`;
        break;
      case "meta":
        openrouterModel = `meta-llama/${model}`;
        break;
      default:
        openrouterModel = model;
    }
  }

  return {
    provider: createOpenRouter({ apiKey: openrouterKey }),
    model: openrouterModel,
    usingUserKey: false,
  };
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { messages, model, maxTokens, temperature } =
      ChatRequestSchema.parse(body);

    // Get user for authentication and API key lookup
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id || "anonymous";

    // Create appropriate AI provider (with BYOK support)
    const {
      provider,
      model: providerModel,
      usingUserKey,
    } = await createAIProvider(model, userId);

    console.log("Provider setup:", {
      originalModel: model,
      providerModel,
      usingUserKey,
      provider: usingUserKey ? getProviderFromModel(model) : "openrouter",
    });

    // Log model usage (no user data is logged, only model and user ID)
    await logModelUsage(model, userId);

    // Stream response using Vercel AI SDK
    // The AI SDK will automatically handle experimental_attachments from the frontend
    const result = streamText({
      model: provider.chat(providerModel),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        ...(msg.experimental_attachments && {
          experimental_attachments: msg.experimental_attachments,
        }),
      })),
      temperature,
      onError: (event) => {
        console.error("Streaming error:", event.error);
      },
    });

    // Return the streaming response with additional headers
    return result.toTextStreamResponse({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Using-User-Key": usingUserKey ? "true" : "false", // Debug header
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: error.message,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to process chat request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
