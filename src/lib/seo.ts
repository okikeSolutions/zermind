import { getLocale, localizeHref } from "@/paraglide/runtime.js";
import { prefixLocale, supportedLocales } from "../../i18n/config";

import * as m from "@/paraglide/messages.js";
const defaultSiteUrl = "https://zermind.ai";
const siteName = m.copy_zermind();
const defaultImagePath = "/opengraph-image.png";

export const siteUrl = (
  import.meta.env.VITE_SITE_URL ??
  import.meta.env.NEXT_PUBLIC_SITE_URL ??
  defaultSiteUrl
).replace(/\/$/, "");

type JsonLd = Record<string, unknown>;

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  jsonLd?: JsonLd | JsonLd[];
};

export function absoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).toString();
}

export function localizedAbsoluteUrl(path: string) {
  return absoluteUrl(localizeHref(path));
}

export function jsonLdScript(jsonLd: JsonLd | JsonLd[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
  };
}

export function seo({
  title,
  description,
  path,
  imagePath = defaultImagePath,
  noIndex = false,
  type = "website",
  jsonLd,
}: SeoOptions) {
  const locale = getLocale();
  const canonicalUrl = localizedAbsoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);
  const robots = "noindex, nofollow, noarchive";
  const pageJsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: locale,
    isPartOf: { "@id": localizedAbsoluteUrl("/#website") },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
  };
  const extraJsonLd = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const scripts = noIndex
    ? undefined
    : [pageJsonLd, ...extraJsonLd].map((entry) => jsonLdScript(entry));

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: siteName },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:locale", content: locale === "de" ? "de-DE" : "en-US" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: m.copy_site_preview({ siteName }) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: m.copy_site_preview({ siteName }) },
      ...(noIndex
        ? [
            { name: "robots", content: robots },
            { name: "googlebot", content: robots },
          ]
        : []),
    ],
    links: noIndex
      ? []
      : [
          { rel: "canonical", href: canonicalUrl },
          ...supportedLocales.map((alternateLocale) => ({
            rel: "alternate",
            hrefLang: alternateLocale,
            href: absoluteUrl(prefixLocale(alternateLocale, path)),
          })),
          {
            rel: "alternate",
            hrefLang: "x-default",
            href: absoluteUrl(prefixLocale("en", path)),
          },
        ],
    scripts,
  };
}
