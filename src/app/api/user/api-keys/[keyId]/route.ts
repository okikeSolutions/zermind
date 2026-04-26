import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  UpdateApiKeySchema,
  UpdateApiKeyResponseSchema,
  DeleteApiKeyResponseSchema,
  ApiKeyErrorResponseSchema,
} from "@/lib/schemas/api-keys";

// PATCH /api/user/api-keys/[keyId] - Update API key
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> },
) {
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
    const validatedData = UpdateApiKeySchema.parse(body);
    const { keyId } = await params;

    // Update the API key
    const { updateApiKey } = await import("@/lib/db/api-keys");
    const updatedApiKey = await updateApiKey(keyId, user.id, validatedData);

    return NextResponse.json(UpdateApiKeyResponseSchema.parse(updatedApiKey));
  } catch (error: unknown) {
    console.error("Error updating API key:", error);

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

    // Handle not found errors (Prisma errors)
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(ApiKeyErrorResponseSchema.parse({ error: "API key not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(
      ApiKeyErrorResponseSchema.parse({ error: "Failed to update API key" }),
      { status: 500 },
    );
  }
}

// DELETE /api/user/api-keys/[keyId] - Delete API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> },
) {
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

    const { keyId } = await params;

    // Delete the API key
    const { deleteApiKey } = await import("@/lib/db/api-keys");
    const success = await deleteApiKey(keyId, user.id);

    if (!success) {
      return NextResponse.json(ApiKeyErrorResponseSchema.parse({ error: "API key not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(DeleteApiKeyResponseSchema.parse({ success: true }));
  } catch (error: unknown) {
    console.error("Error deleting API key:", error);

    return NextResponse.json(
      ApiKeyErrorResponseSchema.parse({ error: "Failed to delete API key" }),
      { status: 500 },
    );
  }
}
