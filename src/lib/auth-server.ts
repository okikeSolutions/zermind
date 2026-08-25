import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

export const { handler, getToken, fetchAuthQuery, fetchAuthMutation, fetchAuthAction } =
  convexBetterAuthReactStart({
    convexUrl: (process.env.VITE_CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL)!,
    convexSiteUrl: (process.env.VITE_CONVEX_SITE_URL ?? process.env.NEXT_PUBLIC_CONVEX_SITE_URL)!,
  });

export async function isAuthenticated() {
  return Boolean(await getToken());
}
