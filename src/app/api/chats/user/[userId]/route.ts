import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserChats } from "@/lib/db/chats";
import { GetUserChatsResponseSchema, ErrorResponseSchema } from "@/lib/schemas/chat";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      const errorResponse = ErrorResponseSchema.parse({ error: "Unauthorized" });
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const { userId } = await params;

    // Verify the user can only access their own chats
    if (user.id !== userId) {
      const errorResponse = ErrorResponseSchema.parse({ error: "Forbidden" });
      return NextResponse.json(errorResponse, { status: 403 });
    }

    // Get user's chats
    const chats = await getUserChats(userId);

    // Validate and return response
    const response = GetUserChatsResponseSchema.parse({ chats });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user chats:", error);

    const errorResponse = ErrorResponseSchema.parse({
      error: "Failed to fetch chats",
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
