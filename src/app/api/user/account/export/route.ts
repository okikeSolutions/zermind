import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AccountErrorResponseSchema } from "@/lib/schemas/account";
import { exportUserData } from "@/lib/db/account";

// GET /api/user/account/export - Export user data as JSON
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
      // Export all user data
      const userData = await exportUserData(user.id);

      // Create a filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const filename = `zermind-data-export-${timestamp}.json`;

      // Return the data as a downloadable JSON file
      return new NextResponse(JSON.stringify(userData, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-cache",
        },
      });
    } catch (exportError) {
      console.error("Error exporting user data:", exportError);
      return NextResponse.json(
        AccountErrorResponseSchema.parse({
          error: "Failed to export user data. Please try again.",
        }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in data export:", error);
    return NextResponse.json(
      AccountErrorResponseSchema.parse({
        error: "An unexpected error occurred. Please try again.",
      }),
      { status: 500 },
    );
  }
}
