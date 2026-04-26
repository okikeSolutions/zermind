import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AccountErrorResponseSchema } from "@/lib/schemas/account";
import { getUserDataStats } from "@/lib/db/account";

// GET /api/user/account/stats - Get user account statistics
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(AccountErrorResponseSchema.parse({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    try {
      const stats = await getUserDataStats(user.id);

      return NextResponse.json(stats, { status: 200 });
    } catch (statsError) {
      console.error("Error getting account stats:", statsError);
      return NextResponse.json(
        AccountErrorResponseSchema.parse({
          error: "Failed to get account statistics. Please try again.",
        }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in account stats:", error);
    return NextResponse.json(
      AccountErrorResponseSchema.parse({
        error: "An unexpected error occurred. Please try again.",
      }),
      { status: 500 },
    );
  }
}
