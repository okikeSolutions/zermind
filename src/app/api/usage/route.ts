import { getUserModelUsage } from "@/lib/usage-logger";
import { createClient } from "@/lib/supabase/server";
import { GetUsageStatsResponseSchema } from "@/lib/schemas/usage";

export async function GET() {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get usage statistics for the authenticated user
    const stats = await getUserModelUsage(user.id);

    // Validate the response data
    const validatedStats = GetUsageStatsResponseSchema.parse(stats);

    return new Response(JSON.stringify(validatedStats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Usage API error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to get usage statistics",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
