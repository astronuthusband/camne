import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/queries/categories";
import { getGuidesForSitemap } from "@/lib/queries/guides";
import { getExpertSlugs } from "@/lib/queries/experts";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const [categories, guides, expertSlugs] = await Promise.all([
    getCategories(),
    getGuidesForSitemap(),
    getExpertSlugs(),
  ]);

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: "daily",
      priority: 0.5,
    },
    // Categories and experts don't carry an updated_at in the schema
    // (see migration 0001) — omitting lastModified for them rather than
    // guessing at a freshness date we don't actually have.
    ...categories.map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...guides.map((g) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...expertSlugs.map((slug) => ({
      url: `${baseUrl}/experts/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
