import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createChat } from "@/lib/db/chats";
import {
  CreateChatSchema,
  CreateChatResponseSchema,
  ErrorResponseSchema,
} from "@/lib/schemas/chat";

export async function POST(request: NextRequest) {
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

    // Validate request body
    const body = await request.json();
    const validatedData = CreateChatSchema.parse(body);

    // Create the chat
    const newChat = await createChat(user.id, validatedData.title);

    // Validate and return response
    const response = CreateChatResponseSchema.parse({
      id: newChat.id,
      title: newChat.title,
      userId: newChat.userId,
      createdAt: newChat.createdAt,
      updatedAt: newChat.updatedAt,
      shareId: newChat.shareId,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating chat:", error);

    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      const errorResponse = ErrorResponseSchema.parse({
        error: "Invalid request data",
      });
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse = ErrorResponseSchema.parse({
      error: "Failed to create chat",
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
