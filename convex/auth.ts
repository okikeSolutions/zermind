import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.string(),
      _creationTime: v.number(),
      userId: v.optional(v.union(v.string(), v.null())),
      email: v.string(),
      emailVerified: v.boolean(),
      name: v.string(),
      image: v.optional(v.union(v.string(), v.null())),
      createdAt: v.number(),
      updatedAt: v.number(),
      twoFactorEnabled: v.optional(v.union(v.boolean(), v.null())),
      isAnonymous: v.optional(v.union(v.boolean(), v.null())),
      username: v.optional(v.union(v.string(), v.null())),
      displayUsername: v.optional(v.union(v.string(), v.null())),
      phoneNumber: v.optional(v.union(v.string(), v.null())),
      phoneNumberVerified: v.optional(v.union(v.boolean(), v.null())),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    return (await authComponent.safeGetAuthUser(ctx)) ?? null;
  },
});
