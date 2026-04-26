import { z } from "zod";

export const DeleteAccountSchema = z.object({
  confirmation: z.literal("DELETE MY ACCOUNT"),
});

export const DeleteAccountResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type DeleteAccount = z.infer<typeof DeleteAccountSchema>;
export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;
