import { describe, expect, it } from "vitest";
import { absoluteUrl, seo } from "./seo";
import { buildHomeJsonLd, buildSiteJsonLd, homeFaqs } from "./site-content";

describe("SEO metadata", () => {
  it("creates canonical and social metadata for public pages", () => {
    const head = seo({
      title: "Example | Zermind",
      description: "Example description",
      path: "/example",
    });

    expect(head.links).toContainEqual({
      rel: "canonical",
      href: absoluteUrl("/example"),
    });
    expect(head.meta).toContainEqual({
      property: "og:url",
      content: absoluteUrl("/example"),
    });
    expect(head.meta).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    });
    expect(JSON.parse(head.scripts?.[0]?.children ?? "{}")).toMatchObject({
      "@type": "WebPage",
      url: absoluteUrl("/example"),
      inLanguage: "en",
      isPartOf: { "@id": absoluteUrl("/#website") },
    });
  });

  it("prevents private pages from being indexed", () => {
    const head = seo({
      title: "Private | Zermind",
      description: "Private page",
      path: "/private",
      noIndex: true,
    });

    expect(head.links).toEqual([]);
    expect(head.meta).toContainEqual({
      name: "robots",
      content: "noindex, nofollow, noarchive",
    });
    expect(head.scripts).toBeUndefined();
  });

  it("escapes JSON-LD before placing it in the document head", () => {
    const head = seo({
      title: "Structured data | Zermind",
      description: "Structured data test",
      path: "/structured-data",
      jsonLd: {
        "@context": "https://schema.org",
        name: "</script>",
      },
    });

    const scripts = head.scripts?.map((script) => script.children).join("\n") ?? "";
    expect(scripts).toContain("\\u003c/script>");
    expect(scripts).not.toContain("</script>");
  });

  it("keeps homepage FAQ schema aligned with the visible FAQ content", () => {
    const siteJsonLd = buildSiteJsonLd();
    const jsonLd = buildHomeJsonLd();
    const graph = jsonLd["@graph"];
    const faqPage = graph.find((entry) => entry["@type"] === "FAQPage");

    expect(siteJsonLd["@graph"].map((entry) => entry["@type"])).toEqual([
      "Organization",
      "WebSite",
    ]);
    expect(siteJsonLd["@graph"][0]).toMatchObject({
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/apple-touch-icon.png"),
      },
    });
    expect(siteJsonLd["@graph"][1]).toMatchObject({ inLanguage: "en" });
    expect(graph.map((entry) => entry["@type"])).toEqual(["WebApplication", "FAQPage"]);
    expect(faqPage?.mainEntity).toHaveLength(homeFaqs.length);
    expect(faqPage?.mainEntity?.[0]).toMatchObject({
      name: homeFaqs[0].question,
      acceptedAnswer: { text: homeFaqs[0].answer },
    });
  });
});
