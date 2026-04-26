import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteChat, getChatWithMessages, updateChatTitle } from "@/lib/db/chats";
import {
  DeleteChatResponseSchema,
  ErrorResponseSchema,
  ChatWithMessagesSchema,
  UpdateChatSchema,
} from "@/lib/schemas/chat";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      const errorResponse = ErrorResponseSchema.parse({ error: "Unauthorized" });
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Get chat with messages
    const chat = await getChatWithMessages(id, user.id);
    if (!chat) {
      const errorResponse = ErrorResponseSchema.parse({ error: "Chat not found" });
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Validate and return response
    const response = ChatWithMessagesSchema.parse(chat);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching chat:", error);
    const errorResponse = ErrorResponseSchema.parse({
      error: "Failed to fetch chat",
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      const errorResponse = ErrorResponseSchema.parse({ error: "Unauthorized" });
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Check if chat exists and belongs to user
    const chat = await getChatWithMessages(id, user.id);
    if (!chat) {
      const errorResponse = ErrorResponseSchema.parse({ error: "Chat not found" });
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Delete the chat
    await deleteChat(id, user.id);

    // Validate and return response
    const response = DeleteChatResponseSchema.parse({ success: true });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting chat:", error);
    const errorResponse = ErrorResponseSchema.parse({
      error: "Failed to delete chat",
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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
    const validatedData = UpdateChatSchema.parse(body);

    // Check if chat exists and belongs to user
    const existingChat = await getChatWithMessages(id, user.id);
    if (!existingChat) {
      const errorResponse = ErrorResponseSchema.parse({ error: "Chat not found" });
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Update the chat title
    const updatedChat = await updateChatTitle(id, user.id, validatedData.title);

    return NextResponse.json({
      id: updatedChat.id,
      title: updatedChat.title,
      updatedAt: updatedChat.updatedAt,
    });
  } catch (error) {
    console.error("Error updating chat:", error);

    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      const errorResponse = ErrorResponseSchema.parse({
        error: "Invalid request data",
      });
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const errorResponse = ErrorResponseSchema.parse({
      error: "Failed to update chat",
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
