"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Download,
  Trash2,
  Shield,
  Database,
  MessageSquare,
  Key,
  BarChart3,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/lib/rate-limit-error";
import { useDeleteAccount, useExportData, useAccountStats } from "@/hooks/use-account";

const DELETE_CONFIRMATION_TEXT = "DELETE MY ACCOUNT";

const deleteAccountSchema = z.object({
  confirmation: z.string().min(1, "Please enter the confirmation text"),
});

type DeleteFormData = z.infer<typeof deleteAccountSchema>;

interface DangerZoneProps {
  className?: string;
}

export function DangerZone({ className }: DangerZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // React Query hooks
  const { data: stats, isLoading: statsLoading } = useAccountStats();
  const deleteAccountMutation = useDeleteAccount();
  const exportDataMutation = useExportData();

  // Form for delete confirmation
  const deleteForm = useForm<DeleteFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const handleExportData = async () => {
    try {
      await exportDataMutation.mutateAsync();
      toast.success("Data export started! Your download should begin shortly.");
      setIsExportDialogOpen(false);
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, "Failed to export data"));
    }
  };

  const handleDeleteAccount = async (data: DeleteFormData) => {
    // Validate that the confirmation text is correct
    if (data.confirmation.trim() !== DELETE_CONFIRMATION_TEXT) {
      deleteForm.setError("confirmation", {
        type: "manual",
        message: `Please type '${DELETE_CONFIRMATION_TEXT}' exactly to confirm`,
      });
      return;
    }

    try {
      const result = await deleteAccountMutation.mutateAsync({
        confirmation: DELETE_CONFIRMATION_TEXT,
      });
      toast.success(result.message);
      setIsDeleteDialogOpen(false);
      // The useDeleteAccount hook handles redirection
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, "Failed to delete account"));
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Card className={`border-destructive/50 ${className}`}>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-destructive text-lg sm:text-xl">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <Alert className="border-destructive/50 bg-destructive/10">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Think carefully!</strong> Actions in this section are permanent and cannot be
            undone. We recommend exporting your data before making any irreversible changes.
          </AlertDescription>
        </Alert>

        {/* Account Statistics */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-lg sm:text-2xl font-bold text-primary">
                  {formatNumber(stats.chats)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Chats</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Database className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-lg sm:text-2xl font-bold text-primary">
                  {formatNumber(stats.messages)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Key className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-lg sm:text-2xl font-bold text-primary">
                  {formatNumber(stats.apiKeys)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">API Keys</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-lg sm:text-2xl font-bold text-primary">
                  {formatNumber(stats.usageLogs)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Usage Logs</p>
            </div>
          </div>
        )}

        {/* Export Data Section */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm sm:text-base">Export Your Data</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Download a copy of all your data before deletion
              </p>
            </div>
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Export Your Data</DialogTitle>
                  <DialogDescription className="text-sm">
                    This will download a JSON file containing all your chats, messages, API key
                    metadata (not the actual keys), and usage statistics.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 sm:space-y-4">
                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      The exported file will be named with today&apos;s date and can be used to
                      backup your data or import it elsewhere.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsExportDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExportData}
                    disabled={exportDataMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {exportDataMutation.isPending ? "Exporting..." : "Download Export"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-destructive/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-destructive text-sm sm:text-base">Delete Account</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-destructive text-lg sm:text-xl">
                    Delete Account
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    This action cannot be undone. This will permanently delete your account and
                    remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 sm:space-y-4">
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>This will permanently delete:</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• All your chats and conversations</li>
                        <li>• All your API keys (securely)</li>
                        <li>• All your usage history and analytics</li>
                        <li>• Your account and profile information</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <form
                    onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Type{" "}
                        <Badge variant="destructive" className="mx-1 text-xs">
                          {DELETE_CONFIRMATION_TEXT}
                        </Badge>{" "}
                        to confirm:
                      </label>
                      <Input
                        {...deleteForm.register("confirmation")}
                        placeholder={DELETE_CONFIRMATION_TEXT}
                        className="text-sm"
                      />
                      {deleteForm.formState.errors.confirmation && (
                        <p className="text-sm text-destructive mt-1">
                          {deleteForm.formState.errors.confirmation.message}
                        </p>
                      )}
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDeleteDialogOpen(false);
                          deleteForm.reset();
                        }}
                        disabled={deleteAccountMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={
                          deleteAccountMutation.isPending ||
                          !deleteForm.watch("confirmation") ||
                          deleteForm.watch("confirmation") !== DELETE_CONFIRMATION_TEXT
                        }
                        className="w-full sm:w-auto"
                      >
                        {deleteAccountMutation.isPending ? "Deleting..." : "Delete My Account"}
                      </Button>
                    </DialogFooter>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>What happens when you delete your account:</strong>
              <ul className="mt-1 space-y-1 text-sm">
                <li>• Your account will be immediately deactivated</li>
                <li>• All data will be permanently removed from our servers</li>
                <li>• Shared chat links will stop working</li>
                <li>• This action cannot be reversed</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
