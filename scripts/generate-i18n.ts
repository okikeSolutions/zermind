import { compile } from "@inlang/paraglide-js";
import { localizedUrlPatterns, paraglideRouteStrategies } from "../i18n/config.ts";

await compile({
  project: "./project.inlang",
  outdir: "./src/paraglide",
  outputStructure: "message-modules",
  cookieName: "PARAGLIDE_LOCALE",
  strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
  urlPatterns: localizedUrlPatterns,
  routeStrategies: [...paraglideRouteStrategies],
});
