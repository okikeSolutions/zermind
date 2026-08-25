import * as m from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";
const RATE_LIMIT_RETRY_AFTER_REGEX = /retryAfter\s*[:=]\s*(\d+)/i;
const RATE_LIMIT_NAME_REGEX = /name\s*[:=]\s*["']?([A-Za-z0-9_-]+)/i;

const RATE_LIMIT_MESSAGES: Record<string, () => string> = {
  aiSendBurst: m.copy_rate_limit_ai_send_burst,
  aiSendHourly: m.copy_rate_limit_ai_send_hourly,
  fileUploadUrlBurst: m.copy_rate_limit_file_upload_burst,
  fileUploadUrlHourly: m.copy_rate_limit_file_upload_hourly,
  fileSaveHourly: m.copy_rate_limit_file_save_hourly,
  feedbackCreate: m.copy_rate_limit_feedback,
  collaborationStart: m.copy_rate_limit_collaboration_start,
  collaborationInvite: m.copy_rate_limit_collaboration_invite,
  collaborationJoin: m.copy_rate_limit_collaboration_join,
  chatCreate: m.copy_rate_limit_chat_create,
  shareLinkGenerate: m.copy_rate_limit_share_link,
  apiKeyCreate: m.copy_rate_limit_api_key,
  accountExport: m.copy_rate_limit_account_export,
};

type ConvexRateLimitData = {
  kind?: string;
  name?: string;
  retryAfter?: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRateLimitData(error: unknown): ConvexRateLimitData | null {
  if (!isObject(error)) return null;
  const data = error.data;
  if (!isObject(data)) return null;
  if (data.kind !== "RateLimitError" && typeof data.name !== "string") return null;
  return {
    kind: typeof data.kind === "string" ? data.kind : undefined,
    name: typeof data.name === "string" ? data.name : undefined,
    retryAfter: typeof data.retryAfter === "number" ? data.retryAfter : undefined,
  };
}

function formatRetryAfter(milliseconds: number) {
  const seconds = Math.max(1, Math.ceil(milliseconds / 1000));
  const formatter = new Intl.RelativeTimeFormat(getLocale(), { numeric: "always" });
  if (seconds < 60) return formatter.format(seconds, "second");
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return formatter.format(minutes, "minute");
  const hours = Math.ceil(minutes / 60);
  return formatter.format(hours, "hour");
}

export function getFriendlyErrorMessage(error: unknown, fallback: string) {
  const rateLimitData = getRateLimitData(error);
  if (rateLimitData?.name) {
    const baseMessage = RATE_LIMIT_MESSAGES[rateLimitData.name]?.() ?? m.copy_rate_limit_reached();
    return rateLimitData.retryAfter
      ? `${baseMessage} ${m.copy_try_again_time({ time: formatRetryAfter(rateLimitData.retryAfter) })}`
      : baseMessage;
  }

  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("RateLimitError")) {
    const name = message.match(RATE_LIMIT_NAME_REGEX)?.[1];
    const retryAfter = Number(message.match(RATE_LIMIT_RETRY_AFTER_REGEX)?.[1]);
    const baseMessage = name
      ? (RATE_LIMIT_MESSAGES[name]?.() ?? m.copy_rate_limit_reached())
      : m.copy_rate_limit_reached();
    return Number.isFinite(retryAfter) && retryAfter > 0
      ? `${baseMessage} ${m.copy_try_again_time({ time: formatRetryAfter(retryAfter) })}`
      : baseMessage;
  }

  return error instanceof Error ? error.message : fallback;
}
