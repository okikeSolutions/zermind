/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as account from "../account.js";
import type * as apiKeyActions from "../apiKeyActions.js";
import type * as apiKeys from "../apiKeys.js";
import type * as auth from "../auth.js";
import type * as chats from "../chats.js";
import type * as collaboration from "../collaboration.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as messages from "../messages.js";
import type * as presence from "../presence.js";
import type * as usage from "../usage.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  account: typeof account;
  apiKeyActions: typeof apiKeyActions;
  apiKeys: typeof apiKeys;
  auth: typeof auth;
  chats: typeof chats;
  collaboration: typeof collaboration;
  feedback: typeof feedback;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  messages: typeof messages;
  presence: typeof presence;
  usage: typeof usage;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
  persistentTextStreaming: import("@convex-dev/persistent-text-streaming/_generated/component.js").ComponentApi<"persistentTextStreaming">;
  presence: import("@convex-dev/presence/_generated/component.js").ComponentApi<"presence">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
