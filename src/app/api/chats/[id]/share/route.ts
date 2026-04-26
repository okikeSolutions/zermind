import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateShareLink, removeShareLink } from "@/lib/db/chats";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Generate or get existing share link
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: chatId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate share link
    const shareId = await generateShareLink(chatId, user.id);

    if (!shareId) {
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({
      shareId,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${shareId}`,
    });
  } catch (error) {
    console.error("Error generating share link:", error);
    return NextResponse.json({ error: "Failed to generate share link" }, { status: 500 });
  }
}

// Remove share link
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: chatId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove share link
    const success = await removeShareLink(chatId, user.id);

    if (!success) {
      return NextResponse.json({ error: "Failed to remove share link" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing share link:", error);
    return NextResponse.json({ error: "Failed to remove share link" }, { status: 500 });
  }
}
