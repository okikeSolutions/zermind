const RATE_LIMIT_RETRY_AFTER_REGEX = /retryAfter\s*[:=]\s*(\d+)/i;
const RATE_LIMIT_NAME_REGEX = /name\s*[:=]\s*["']?([A-Za-z0-9_-]+)/i;

const RATE_LIMIT_MESSAGES: Record<string, string> = {
  aiSendBurst: "You’re sending messages too quickly. Please wait a moment and try again.",
  aiSendHourly: "You’ve reached the hourly message limit. Please try again later.",
  fileUploadUrlBurst: "You’re uploading files too quickly. Please wait a moment and try again.",
  fileUploadUrlHourly: "You’ve reached the hourly upload limit. Please try again later.",
  fileSaveHourly: "You’ve reached the hourly file save limit. Please try again later.",
  feedbackCreate: "You’ve submitted feedback recently. Please try again later.",
  collaborationStart: "You’re starting collaboration sessions too quickly. Please try again later.",
  collaborationInvite: "You’re sending collaboration invites too quickly. Please try again later.",
  collaborationJoin: "You’re joining collaboration sessions too quickly. Please try again later.",
  chatCreate: "You’re creating chats too quickly. Please wait a moment and try again.",
  shareLinkGenerate: "You’re creating share links too quickly. Please try again later.",
  apiKeyCreate: "You’re adding API keys too quickly. Please try again later.",
  accountExport: "You’ve exported your data recently. Please try again later.",
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
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

export function getFriendlyErrorMessage(error: unknown, fallback: string) {
  const rateLimitData = getRateLimitData(error);
  if (rateLimitData?.name) {
    const baseMessage = RATE_LIMIT_MESSAGES[rateLimitData.name] ?? "Rate limit reached.";
    return rateLimitData.retryAfter
      ? `${baseMessage} Try again in ${formatRetryAfter(rateLimitData.retryAfter)}.`
      : baseMessage;
  }

  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("RateLimitError")) {
    const name = message.match(RATE_LIMIT_NAME_REGEX)?.[1];
    const retryAfter = Number(message.match(RATE_LIMIT_RETRY_AFTER_REGEX)?.[1]);
    const baseMessage = name
      ? (RATE_LIMIT_MESSAGES[name] ?? "Rate limit reached.")
      : "Rate limit reached.";
    return Number.isFinite(retryAfter) && retryAfter > 0
      ? `${baseMessage} Try again in ${formatRetryAfter(retryAfter)}.`
      : baseMessage;
  }

  return error instanceof Error ? error.message : fallback;
}
