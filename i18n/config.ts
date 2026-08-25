export const supportedLocales = ["en", "de"] as const;

export const localizableRoutePatterns = [
  "/",
  "/demo/",
  "/demo",
  "/demo/:scenario",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/login",
  "/auth/sign-up-success",
  "/auth/sign-up",
  "/auth/update-password",
  "/collaborate/:chatId",
  "/protected/",
  "/protected",
  "/protected/chat/:id",
  "/protected/settings",
  "/protected/usage",
  "/share/:shareId",
  "/privacy",
  "/terms",
  "/imprint",
] as const;

export const publicPagePaths = [
  "/",
  "/demo",
  "/demo/ai-comparison",
  "/demo/creative-writing",
  "/demo/problem-solving",
  "/privacy",
  "/terms",
  "/imprint",
] as const;

export function prefixLocale(locale: (typeof supportedLocales)[number], path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

export const localizedUrlPatterns = localizableRoutePatterns.map((pattern) => ({
  pattern,
  localized: supportedLocales.map(
    (locale) =>
      [locale, prefixLocale(locale, pattern !== "/" ? pattern.replace(/\/$/, "") : pattern)] as [
        string,
        string,
      ],
  ),
}));

export const paraglideRouteStrategies = [
  { match: "/api/:path(.*)?", exclude: true },
  { match: "/sitemap.xml", exclude: true },
  { match: "/robots.txt", exclude: true },
  { match: "/llms.txt", exclude: true },
] as const;

export const localizedPrerenderPaths = supportedLocales.flatMap((locale) =>
  publicPagePaths.map((path) => prefixLocale(locale, path)),
);
