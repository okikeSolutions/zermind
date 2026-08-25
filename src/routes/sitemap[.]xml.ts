import { createFileRoute } from "@tanstack/react-router";
import { DEMO_SCENARIOS } from "@/constants/demo-scenarios";
import { siteUrl } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          "",
          "/demo",
          ...Object.keys(DEMO_SCENARIOS).map((key) => `/demo/${key}`),
          "/privacy",
          "/terms",
          "/imprint",
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
          .map((path) => `<url><loc>${siteUrl}${path}</loc></url>`)
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
