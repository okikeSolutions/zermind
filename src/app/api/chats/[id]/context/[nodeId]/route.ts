import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getConversationContext } from "@/lib/db/chats";
import { ErrorResponseSchema } from "@/lib/schemas/chat";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; nodeId: string }> },
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      const errorResponse = ErrorResponseSchema.parse({
        error: "Unauthorized",
      });
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const { nodeId } = await params;

    // Get conversation context up to the specified node with user authorization
    const context = await getConversationContext(nodeId, user.id);

    return NextResponse.json({
      context,
      nodeId,
    });
  } catch (error) {
    console.error("Error fetching conversation context:", error);

    if (error instanceof Error && error.message === "Message not found") {
      const errorResponse = ErrorResponseSchema.parse({
        error: "Node not found",
      });
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const errorResponse = ErrorResponseSchema.parse({
      error: "Failed to fetch conversation context",
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
