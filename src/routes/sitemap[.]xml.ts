import { createFileRoute } from "@tanstack/react-router";
import { prefixLocale, publicPagePaths, supportedLocales } from "../../i18n/config";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${publicPagePaths
          .flatMap((path) =>
            supportedLocales.map(
              (locale) =>
                `<url><loc>${absoluteUrl(prefixLocale(locale, path))}</loc>${supportedLocales
                  .map(
                    (alternateLocale) =>
                      `<xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${absoluteUrl(prefixLocale(alternateLocale, path))}" />`,
                  )
                  .join(
                    "",
                  )}<xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(prefixLocale("en", path))}" /></url>`,
            ),
          )
          .join("")}</urlset>`;
        return new Response(body, {
          headers: {
            "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
            "content-type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});
