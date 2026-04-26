import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createFeedback } from "@/lib/db/feedback";
import { CreateFeedbackSchema } from "@/lib/schemas/feedback";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = CreateFeedbackSchema.parse(body);

    // Get user agent from headers
    const userAgent = request.headers.get("user-agent") || undefined;

    // Create feedback in database
    const feedback = await createFeedback(user.id, validatedData, userAgent);

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
