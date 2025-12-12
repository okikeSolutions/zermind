import { z } from "zod";

// Account deletion request schema
export const DeleteAccountSchema = z.object({
  confirmation: z.literal("DELETE MY ACCOUNT", {
    message: "You must type 'DELETE MY ACCOUNT' to confirm",
  }),
});

// Account deletion response schemas
export const DeleteAccountResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const AccountErrorResponseSchema = z.object({
  error: z.string(),
  field: z.string().optional(),
});

// Account data export schema
export const ExportDataResponseSchema = z.object({
  success: z.boolean(),
  downloadUrl: z.string().optional(),
  message: z.string(),
});

// Type exports
export type DeleteAccount = z.infer<typeof DeleteAccountSchema>;
export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;
export type AccountErrorResponse = z.infer<typeof AccountErrorResponseSchema>;
export type ExportDataResponse = z.infer<typeof ExportDataResponseSchema>;
