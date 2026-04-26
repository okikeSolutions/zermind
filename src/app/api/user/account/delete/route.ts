import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  DeleteAccountSchema,
  DeleteAccountResponseSchema,
  AccountErrorResponseSchema,
} from "@/lib/schemas/account";
import { deleteUserData } from "@/lib/db/account";

// DELETE /api/user/account/delete - Delete user account and all data
export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = DeleteAccountSchema.parse(body);

    // Additional safety check - ensure confirmation text is exactly right
    if (validatedData.confirmation !== "DELETE MY ACCOUNT") {
      return NextResponse.json(
        AccountErrorResponseSchema.parse({
          error: "Invalid confirmation text. Please type exactly: DELETE MY ACCOUNT",
          field: "confirmation",
        }),
        { status: 400 },
      );
    }

    try {
      // Step 1: Delete all user data from our database
      console.log(`Starting account deletion for user: ${user.id}`);
      const deletionResult = await deleteUserData(user.id);

      if (!deletionResult.success) {
        console.error("Failed to delete user data from database");
        return NextResponse.json(
          AccountErrorResponseSchema.parse({
            error: "Failed to delete user data. Please try again or contact support.",
          }),
          { status: 500 },
        );
      }

      console.log("User data deleted successfully:", deletionResult.deletedItems);

      // Step 2: Delete the user from Supabase Auth
      // Note: This requires the service role key for admin operations
      // For now, we'll just sign out the user and let them know to contact support
      // In a production environment, you'd want to use the Supabase Admin API
      // to actually delete the auth user record

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Error signing out user:", signOutError);
      }

      const response = DeleteAccountResponseSchema.parse({
        success: true,
        message: `Account deletion initiated. Deleted: ${deletionResult.deletedItems.chats} chats, ${deletionResult.deletedItems.messages} messages, ${deletionResult.deletedItems.apiKeys} API keys, and ${deletionResult.deletedItems.usageLogs} usage logs. You have been signed out.`,
      });

      return NextResponse.json(response, { status: 200 });
    } catch (dbError) {
      console.error("Database error during account deletion:", dbError);
      return NextResponse.json(
        AccountErrorResponseSchema.parse({
          error: "Failed to delete account data. Please try again.",
        }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in account deletion:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        AccountErrorResponseSchema.parse({
          error: "Invalid request data. Please check your input.",
        }),
        { status: 400 },
      );
    }

    return NextResponse.json(
      AccountErrorResponseSchema.parse({
        error: "An unexpected error occurred. Please try again.",
      }),
      { status: 500 },
    );
  }
}
