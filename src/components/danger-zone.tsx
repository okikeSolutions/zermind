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
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
const DELETE_CONFIRMATION_TEXT = "DELETE MY ACCOUNT" as const;

const deleteAccountSchema = z.object({
  confirmation: z.string().min(1, m.copy_please_enter_the_confirmation_text()),
});

type DeleteFormData = z.infer<typeof deleteAccountSchema>;

interface DangerZoneProps {
  className?: string;
}

export function DangerZone({ className }: DangerZoneProps) {
  const localizedDeleteConfirmation = m.copy_delete_my_account();
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
      toast.success(m.copy_data_export_started_your_download_should_begin_shortly());
      setIsExportDialogOpen(false);
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, m.copy_failed_to_export_data()));
    }
  };

  const handleDeleteAccount = async (data: DeleteFormData) => {
    // Validate that the confirmation text is correct
    if (data.confirmation.trim() !== localizedDeleteConfirmation) {
      deleteForm.setError("confirmation", {
        type: "manual",
        message: m.copy_please_type_confirmation_exactly({
          confirmation: localizedDeleteConfirmation,
        }),
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
      toast.error(getFriendlyErrorMessage(error, m.copy_failed_to_delete_account()));
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Card className={`border-destructive/50 ${className}`}>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-destructive text-lg sm:text-xl">
          <AlertTriangle {...sx("h-4 w-4 sm:h-5 sm:w-5")} /> {m.copy_danger_zone()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <Alert className="border-destructive/50 bg-destructive/10">
          <Shield {...sx("h-4 w-4")} />
          <AlertDescription className="text-sm">
            <strong>{m.copy_think_carefully()}</strong>{" "}
            {m.copy_actions_in_this_section_are_permanent_and_cannot_be_undone_we_re()}
          </AlertDescription>
        </Alert>

        {/* Account Statistics */}
        {!statsLoading && stats && (
          <div
            {...sx(
              "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg",
            )}
          >
            <div {...sx("text-center")}>
              <div {...sx("flex items-center justify-center gap-1 mb-1")}>
                <MessageSquare {...sx("h-3 w-3 sm:h-4 sm:w-4 text-primary")} />
                <span {...sx("text-lg sm:text-2xl font-bold text-primary")}>
                  {formatNumber(stats.chats)}
                </span>
              </div>
              <p {...sx("text-xs text-muted-foreground")}>{m.copy_chats()}</p>
            </div>
            <div {...sx("text-center")}>
              <div {...sx("flex items-center justify-center gap-1 mb-1")}>
                <Database {...sx("h-3 w-3 sm:h-4 sm:w-4 text-primary")} />
                <span {...sx("text-lg sm:text-2xl font-bold text-primary")}>
                  {formatNumber(stats.messages)}
                </span>
              </div>
              <p {...sx("text-xs text-muted-foreground")}>{m.copy_messages()}</p>
            </div>
            <div {...sx("text-center")}>
              <div {...sx("flex items-center justify-center gap-1 mb-1")}>
                <Key {...sx("h-3 w-3 sm:h-4 sm:w-4 text-primary")} />
                <span {...sx("text-lg sm:text-2xl font-bold text-primary")}>
                  {formatNumber(stats.apiKeys)}
                </span>
              </div>
              <p {...sx("text-xs text-muted-foreground")}>{m.copy_api_keys()}</p>
            </div>
            <div {...sx("text-center")}>
              <div {...sx("flex items-center justify-center gap-1 mb-1")}>
                <BarChart3 {...sx("h-3 w-3 sm:h-4 sm:w-4 text-primary")} />
                <span {...sx("text-lg sm:text-2xl font-bold text-primary")}>
                  {formatNumber(stats.usageLogs)}
                </span>
              </div>
              <p {...sx("text-xs text-muted-foreground")}>{m.copy_usage_logs()}</p>
            </div>
          </div>
        )}

        {/* Export Data Section */}
        <div {...sx("space-y-2 sm:space-y-3")}>
          <div
            {...sx("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4")}
          >
            <div {...sx("space-y-1")}>
              <h4 {...sx("font-medium text-sm sm:text-base")}>{m.copy_export_your_data()}</h4>
              <p {...sx("text-xs sm:text-sm text-muted-foreground")}>
                {m.copy_download_a_copy_of_all_your_data_before_deletion()}
              </p>
            </div>
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger
                render={<Button variant="outline" size="sm" className="w-full sm:w-auto" />}
              >
                <Download {...sx("h-4 w-4 mr-2")} /> {m.copy_export_data()}
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    {m.copy_export_your_data()}
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    {m.copy_this_will_download_a_json_file_containing_all_your_chats_message()}
                  </DialogDescription>
                </DialogHeader>
                <div {...sx("space-y-3 sm:space-y-4")}>
                  <Alert>
                    <Download {...sx("h-4 w-4")} />
                    <AlertDescription className="text-sm">
                      {m.copy_the_exported_file_will_be_named_with_today_s_date_and_can_be_use()}
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsExportDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    {m.copy_cancel()}
                  </Button>
                  <Button
                    onClick={handleExportData}
                    disabled={exportDataMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {exportDataMutation.isPending ? m.copy_exporting() : m.copy_download_export()}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Delete Account Section */}
        <div {...sx("space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-destructive/20")}>
          <div
            {...sx("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4")}
          >
            <div {...sx("space-y-1")}>
              <h4 {...sx("font-medium text-destructive text-sm sm:text-base")}>
                {m.copy_delete_account()}
              </h4>
              <p {...sx("text-xs sm:text-sm text-muted-foreground")}>
                {m.copy_permanently_delete_your_account_and_all_associated_data()}
              </p>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger
                render={<Button variant="destructive" size="sm" className="w-full sm:w-auto" />}
              >
                <Trash2 {...sx("h-4 w-4 mr-2")} /> {m.copy_delete_account()}
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-destructive text-lg sm:text-xl">
                    {m.copy_delete_account()}
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    {m.copy_this_action_cannot_be_undone_this_will_permanently_delete_your_a()}
                  </DialogDescription>
                </DialogHeader>

                <div {...sx("space-y-3 sm:space-y-4")}>
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertTriangle {...sx("h-4 w-4")} />
                    <AlertDescription className="text-sm">
                      <strong>{m.copy_this_will_permanently_delete()}</strong>
                      <ul {...sx("mt-2 space-y-1 text-sm")}>
                        <li>{m.copy_all_your_chats_and_conversations()}</li>
                        <li>{m.copy_all_your_api_keys_securely()}</li>
                        <li>{m.copy_all_your_usage_history_and_analytics()}</li>
                        <li>{m.copy_your_account_and_profile_information()}</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <form
                    onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}
                    {...sx("space-y-3 sm:space-y-4")}
                  >
                    <div>
                      <label {...sx("text-sm font-medium block mb-2")}>
                        {m.copy_type()}{" "}
                        <Badge variant="destructive" className="mx-1 text-xs">
                          {localizedDeleteConfirmation}
                        </Badge>{" "}
                        to confirm:
                      </label>
                      <Input
                        {...deleteForm.register("confirmation")}
                        placeholder={localizedDeleteConfirmation}
                        className="text-sm"
                      />

                      {deleteForm.formState.errors.confirmation && (
                        <p {...sx("text-sm text-destructive mt-1")}>
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
                        {m.copy_cancel()}
                      </Button>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={
                          deleteAccountMutation.isPending ||
                          !deleteForm.watch("confirmation") ||
                          deleteForm.watch("confirmation") !== localizedDeleteConfirmation
                        }
                        className="w-full sm:w-auto"
                      >
                        {deleteAccountMutation.isPending
                          ? m.copy_deleting()
                          : m.copy_delete_my_account_2()}
                      </Button>
                    </DialogFooter>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle {...sx("h-4 w-4")} />
            <AlertDescription className="text-sm">
              <strong>{m.copy_what_happens_when_you_delete_your_account()}</strong>
              <ul {...sx("mt-1 space-y-1 text-sm")}>
                <li>{m.copy_your_account_will_be_immediately_deactivated()}</li>
                <li>{m.copy_all_data_will_be_permanently_removed_from_our_servers()}</li>
                <li>{m.copy_shared_chat_links_will_stop_working()}</li>
                <li>{m.copy_this_action_cannot_be_reversed()}</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
