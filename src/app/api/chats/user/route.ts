import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserChats } from "@/lib/db/chats";
import { GetUserChatsResponseSchema, ErrorResponseSchema } from "@/lib/schemas/chat";

export async function GET() {
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

    // Get user's chats
    const chats = await getUserChats(user.id);

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
