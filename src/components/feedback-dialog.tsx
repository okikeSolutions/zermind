import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getFriendlyErrorMessage } from "@/lib/rate-limit-error";

// Form schema
import { sx } from "@/styles/sx";
import * as m from "@/paraglide/messages.js";
const feedbackFormSchema = z.object({
  message: z
    .string()
    .min(1, m.copy_feedback_message_is_required())
    .max(2000, m.copy_feedback_message_is_too_long()),
  type: z.enum(["general", "bug", "feature", "improvement", "complaint", "compliment"]),
});

const feedbackTypeItems = [
  { value: "general", label: m.copy_general_feedback() },
  { value: "bug", label: m.copy_bug_report() },
  { value: "feature", label: m.copy_feature_request() },
  { value: "improvement", label: m.copy_improvement() },
  { value: "complaint", label: m.copy_complaint() },
  { value: "compliment", label: m.copy_compliment() },
] as const;

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

interface FeedbackDialogProps {
  children: React.ReactElement;
}

export function FeedbackDialog({ children }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createFeedback = useMutation(api.feedback.create);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      message: "",
      type: "general",
    },
  });

  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);

    try {
      await createFeedback({
        message: values.message.trim(),
        type: values.type,
        userAgent: navigator.userAgent,
      });

      toast.success(m.copy_thank_you_for_your_feedback_we_ll_review_it_soon());
      form.reset();
      handleOpenChange(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(
        getFriendlyErrorMessage(error, m.copy_failed_to_submit_feedback_please_try_again()),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children} />
      <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-[425px] sm:mx-auto sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageSquare {...sx("h-5 w-5")} /> {m.copy_share_your_feedback()}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {m.copy_help_us_improve_by_sharing_your_thoughts_reporting_bugs_or_sugge()}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            {...sx("space-y-4 sm:space-y-6 px-1 sm:px-0")}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">{m.copy_feedback_type()}</FormLabel>
                  <Select
                    items={feedbackTypeItems}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {feedbackTypeItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">{m.copy_your_message()}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={m.copy_tell_us_what_s_on_your_mind()}
                      disabled={isSubmitting}
                      className="min-h-[100px] sm:min-h-[120px] resize-none text-base sm:text-sm"
                      maxLength={2000}
                      {...field}
                    />
                  </FormControl>
                  <div {...sx("text-xs text-muted-foreground text-right")}>
                    {field.value.length}/2000
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto mr-2"
              >
                {m.copy_cancel()}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.watch("message").trim()}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? m.copy_submitting() : m.copy_submit_feedback()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
