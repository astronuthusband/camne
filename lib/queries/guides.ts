import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/static";
import type { Database } from "@/lib/supabase/database.types";

export type GuideRow = Database["public"]["Tables"]["guides"]["Row"];
export type GuideStepRow = Database["public"]["Tables"]["guide_steps"]["Row"];
export type SourceRow = Database["public"]["Tables"]["sources"]["Row"];
export type ExpertRow = Database["public"]["Tables"]["experts"]["Row"];

export interface GuideExpertAttribution {
  adviceText: string | null;
  interviewedAt: string | null;
  expert: ExpertRow;
}

export interface FullGuide extends GuideRow {
  steps: GuideStepRow[];
  sources: SourceRow[];
  expertAttributions: GuideExpertAttribution[];
}

export interface GuideCardData {
  slug: string;
  title: string;
  estimatedCostText: string | null;
  estimatedTimeText: string | null;
}

// NOTE: deliberately avoids Supabase's embedded-relation select syntax
// (e.g. `.select("*, category:categories(*)")`) — that requires foreign
// key metadata in the generated types that our hand-written
// database.types.ts doesn't carry, and would need real type gymnastics
// to keep safe. Plain follow-up queries are a few more lines but stay
// simple and fully type-checked, which matters more at this stage.

export const getPublishedGuideSlugs = cache(async (): Promise<string[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("guides")
    .select("slug")
    .eq("status", "published");
  if (error) throw error;
  return (data ?? []).map((g) => g.slug);
});

export interface SitemapGuideEntry {
  slug: string;
  updatedAt: string;
}

// Separate from getPublishedGuideSlugs above — the sitemap wants
// updated_at too (search engines use it as a freshness signal), no
// reason to make every other caller of the slug-only query pay for a
// column it doesn't need.
export const getGuidesForSitemap = cache(
  async (): Promise<SitemapGuideEntry[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("guides")
      .select("slug, updated_at")
      .eq("status", "published");
    if (error) throw error;
    return (data ?? []).map((g) => ({ slug: g.slug, updatedAt: g.updated_at }));
  }
);

export const getGuideBySlug = cache(
  async (slug: string): Promise<FullGuide | null> => {
    const supabase = createPublicClient();

    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (guideError) throw guideError;
    if (!guide) return null;

    const [
      { data: steps, error: stepsError },
      { data: sources, error: sourcesError },
      { data: guideExperts, error: guideExpertsError },
    ] = await Promise.all([
      supabase
        .from("guide_steps")
        .select("*")
        .eq("guide_id", guide.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("sources")
        .select("*")
        .eq("guide_id", guide.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("guide_experts")
        .select("advice_text, interviewed_at, expert_id")
        .eq("guide_id", guide.id),
    ]);

    if (stepsError) throw stepsError;
    if (sourcesError) throw sourcesError;
    if (guideExpertsError) throw guideExpertsError;

    let expertAttributions: GuideExpertAttribution[] = [];
    if (guideExperts && guideExperts.length > 0) {
      const expertIds = guideExperts.map((ge) => ge.expert_id);
      const { data: experts, error: expertsError } = await supabase
        .from("experts")
        .select("*")
        .in("id", expertIds);
      if (expertsError) throw expertsError;

      expertAttributions = guideExperts
        .map((ge) => {
          const expert = experts?.find((e) => e.id === ge.expert_id);
          if (!expert) return null;
          return {
            adviceText: ge.advice_text,
            interviewedAt: ge.interviewed_at,
            expert,
          };
        })
        .filter((x): x is GuideExpertAttribution => x !== null);
    }

    return {
      ...guide,
      steps: steps ?? [],
      sources: sources ?? [],
      expertAttributions,
    };
  }
);

export const getGuidesForCategory = cache(
  async (
    categoryId: string,
    options?: { excludeGuideId?: string; limit?: number }
  ): Promise<GuideCardData[]> => {
    const supabase = createPublicClient();
    const base = supabase
      .from("guides")
      .select("slug, title, estimated_cost_text, estimated_time_text")
      .eq("category_id", categoryId)
      .eq("status", "published");

    const filtered = options?.excludeGuideId
      ? base.neq("id", options.excludeGuideId)
      : base;

    const { data, error } = await filtered
      .order("title", { ascending: true })
      .limit(options?.limit ?? 24);

    if (error) throw error;

    return (data ?? []).map((g) => ({
      slug: g.slug,
      title: g.title,
      estimatedCostText: g.estimated_cost_text,
      estimatedTimeText: g.estimated_time_text,
    }));
  }
);
