import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";
import betterAuth from "@convex-dev/better-auth/convex.config";
import persistentTextStreaming from "@convex-dev/persistent-text-streaming/convex.config";
import presence from "@convex-dev/presence/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

const app = defineApp();
/**
 * The AI Agent component provides a structured framework for building agentic AI workflows with 
 * persistent message threads, automatic conversation context, and vector search capabilities. 
 * It separates long-running AI operations from your UI while maintaining real-time reactivity 
 * through Convex's websocket streaming. The component handles thread management, message persistence, 
 * file storage integration, and includes built-in debugging tools and usage tracking.
 */
app.use(agent);

/**
 * This component provides an integration layer for using Better Auth with Convex, enabling 
 * framework-agnostic authentication across React, Vue, Svelte, Next.js, and other popular frameworks. 
 * It handles email/password authentication, OAuth providers (GitHub, Google, Discord, Twitter), 
 * and multi-factor authentication while managing sessions and accounts through Convex's database.
 */
app.use(betterAuth);

/**
 * This component combines HTTP streaming with database persistence to deliver real-time text updates 
 * while storing content permanently. It provides a React hook that streams text from HTTP actions while 
 * simultaneously persisting chunks to the database at sentence boundaries. Developers get low-latency 
 * streaming for the original client plus durable storage accessible by other users or after reconnection.
 */
app.use(persistentTextStreaming);

/**
 * This component provides real-time user presence tracking for rooms or spaces in your application. 
 * It efficiently manages who's online, when users were last active, and handles join/leave events 
 * without polling or constant query re-execution. The implementation uses Convex scheduled functions 
 * to minimize unnecessary updates and includes React hooks for seamless client integration.
 */
app.use(presence);

/**
 * Provides type-safe, transactional application-layer rate limiting for Convex apps. Supports both 
 * fixed window and token bucket algorithms with configurable sharding for high-throughput scenarios. 
 * Features include capacity reservation to prevent starvation, fairness guarantees, and React hooks for client-side rate limit checking.
 */
app.use(rateLimiter);

export default app;