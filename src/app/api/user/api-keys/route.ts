import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  CreateApiKeySchema,
  GetUserApiKeysResponseSchema,
  CreateApiKeyResponseSchema,
  ApiKeyErrorResponseSchema,
} from "@/lib/schemas/api-keys";
import { validateApiKeyFormat } from "@/lib/crypto";

// GET /api/user/api-keys - Get user's API keys
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(ApiKeyErrorResponseSchema.parse({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Import getUserApiKeys dynamically to avoid Prisma client issues during build
    const { getUserApiKeys } = await import("@/lib/db/api-keys");
    const apiKeys = await getUserApiKeys(user.id);

    return NextResponse.json(GetUserApiKeysResponseSchema.parse({ apiKeys }));
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      ApiKeyErrorResponseSchema.parse({ error: "Failed to fetch API keys" }),
      { status: 500 },
    );
  }
}

// POST /api/user/api-keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(ApiKeyErrorResponseSchema.parse({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const validatedData = CreateApiKeySchema.parse(body);

    // Validate API key format
    if (!validateApiKeyFormat(validatedData.apiKey, validatedData.provider)) {
      return NextResponse.json(
        ApiKeyErrorResponseSchema.parse({
          error: "Invalid API key format for the selected provider",
          field: "apiKey",
        }),
        { status: 400 },
      );
    }

    // Check if key name already exists for this provider
    const { validateApiKeyExists } = await import("@/lib/db/api-keys");
    const exists = await validateApiKeyExists(
      user.id,
      validatedData.provider,
      validatedData.keyName,
    );

    if (exists) {
      return NextResponse.json(
        ApiKeyErrorResponseSchema.parse({
          error: "A key with this name already exists for this provider",
          field: "keyName",
        }),
        { status: 400 },
      );
    }

    // Create the API key
    const { createApiKey } = await import("@/lib/db/api-keys");
    const newApiKey = await createApiKey(
      user.id,
      validatedData.provider,
      validatedData.apiKey,
      validatedData.keyName,
    );

    return NextResponse.json(CreateApiKeyResponseSchema.parse(newApiKey), { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating API key:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        ApiKeyErrorResponseSchema.parse({
          error: "Invalid input data",
          field: "data",
        }),
        { status: 400 },
      );
    }

    return NextResponse.json(
      ApiKeyErrorResponseSchema.parse({ error: "Failed to create API key" }),
      { status: 500 },
    );
  }
}
