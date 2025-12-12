import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { joinCollaborationSession } from "@/lib/db/collaboration";
import { getChatInfo } from "@/lib/db/chats";

// Join collaboration session via link
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;

    // Check if chat exists and is collaborative
    const chat = await getChatInfo(chatId);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.isCollaborative) {
      return NextResponse.json(
        { error: "This chat is not collaborative" },
        { status: 403 }
      );
    }

    // Attempt to join the collaboration session
    const result = await joinCollaborationSession(
      chatId,
      user.id,
      chat.userId === user.id
    );

    if (!result.success) {
      const statusCode =
        result.error === "No active collaboration session" ? 404 : 500;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    if (!result.session) {
      return NextResponse.json(
        { error: "Failed to join collaboration" },
        { status: 500 }
      );
    }

    const userParticipant = result.session.participants.find(
      (p: { userId: string }) => p.userId === user.id
    );

    return NextResponse.json({
      success: true,
      session: {
        id: result.session.id,
        chatId: result.session.chatId,
        activeSince: result.session.activeSince,
        participantCount: result.session.participants.length,
        userRole: userParticipant?.role || "collaborator",
      },
    });
  } catch (error) {
    console.error("Join collaboration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
