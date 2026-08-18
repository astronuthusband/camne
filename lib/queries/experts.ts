import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/static";
import type { Database } from "@/lib/supabase/database.types";

export type ExpertRow = Database["public"]["Tables"]["experts"]["Row"];

export interface ExpertGuideCardData {
  slug: string;
  title: string;
  estimatedCostText: string | null;
  estimatedTimeText: string | null;
  categoryName: string | null;
}

export const getExpertSlugs = cache(async (): Promise<string[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("experts").select("slug");
  if (error) throw error;
  return (data ?? []).map((e) => e.slug);
});

export const getExpertBySlug = cache(
  async (slug: string): Promise<ExpertRow | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("experts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
);

// Deliberately avoids embedded-relation selects — see the same note in
// lib/queries/guides.ts. A few plain follow-up queries instead.
export const getGuidesForExpert = cache(
  async (expertId: string): Promise<ExpertGuideCardData[]> => {
    const supabase = createPublicClient();

    const { data: links, error: linksError } = await supabase
      .from("guide_experts")
      .select("guide_id")
      .eq("expert_id", expertId);
    if (linksError) throw linksError;
    if (!links || links.length === 0) return [];

    const guideIds = links.map((l) => l.guide_id);
    const { data: guides, error: guidesError } = await supabase
      .from("guides")
      .select("slug, title, estimated_cost_text, estimated_time_text, category_id")
      .in("id", guideIds)
      .eq("status", "published")
      .order("title", { ascending: true });
    if (guidesError) throw guidesError;
    if (!guides || guides.length === 0) return [];

    const categoryIds = [...new Set(guides.map((g) => g.category_id))];
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name")
      .in("id", categoryIds);
    if (categoriesError) throw categoriesError;

    return guides.map((g) => ({
      slug: g.slug,
      title: g.title,
      estimatedCostText: g.estimated_cost_text,
      estimatedTimeText: g.estimated_time_text,
      categoryName:
        categories?.find((c) => c.id === g.category_id)?.name ?? null,
    }));
  }
);
