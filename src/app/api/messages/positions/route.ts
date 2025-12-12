import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { batchUpdateMessagePositionsSecure } from "@/lib/db/messages";
import { batchUpdatePositionsSchema } from "@/lib/schemas/messages";
import { ZodError } from "zod";

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = batchUpdatePositionsSchema.parse(body);

    // Log the update attempt for security monitoring
    console.log(
      `User ${user.id} attempting to update positions for ${validatedData.updates.length} messages`
    );

    // Update message positions with ownership verification
    await batchUpdateMessagePositionsSecure(validatedData.updates, user.id);

    console.log(
      `Successfully updated ${validatedData.updates.length} message positions for user ${user.id}`
    );

    return NextResponse.json({
      success: true,
      updatedCount: validatedData.updates.length,
    });
  } catch (error) {
    console.error("Error updating message positions:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.message },
        { status: 400 }
      );
    }

    // Handle ownership/authorization errors
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      console.warn(
        `Authorization failed for message position update: ${error.message}`
      );
      return NextResponse.json(
        { error: "Forbidden: You can only update your own messages" },
        { status: 403 }
      );
    }

    // Handle not found errors
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "One or more messages were not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update message positions" },
      { status: 500 }
    );
  }
}
