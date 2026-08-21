import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /admin is already access-controlled (requireAdmin() + RLS), but
        // there's no reason to invite crawlers to even try, or to have
        // /admin/login show up in search results. /api/health is a
        // debugging endpoint, not content worth indexing.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
