import * as m from "@/paraglide/messages.js";
/**
 * Generate a chat title from the first user message
 * @param message - The first user message content
 * @returns A truncated and cleaned title
 */
export function generateChatTitle(message: string): string {
  // Remove extra whitespace and newlines
  const cleaned = message.replace(/\s+/g, " ").trim();

  // If message is very short, use it as is
  if (cleaned.length <= 40) {
    return cleaned;
  }

  // Try to truncate at a word boundary within 40 characters
  const truncated = cleaned.substring(0, 40);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 20) {
    // Truncate at the last space if it's not too early
    return truncated.substring(0, lastSpaceIndex) + "...";
  } else {
    // If no good space found, just cut at character limit
    return truncated + "...";
  }
}

/**
 * Check if a chat title is a default/generic title that should be updated
 * @param title - The current chat title
 * @returns Whether the title should be auto-updated
 */
export function shouldUpdateChatTitle(title: string | null): boolean {
  if (!title) return true;

  const defaultTitles: string[] = [m.copy_new_chat(), m.copy_untitled_chat(), m.copy_chat()];

  return defaultTitles.includes(title);
}
