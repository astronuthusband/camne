import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type GuideRow = Database["public"]["Tables"]["guides"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type ExpertRow = Database["public"]["Tables"]["experts"]["Row"];
export type GuideStepRow = Database["public"]["Tables"]["guide_steps"]["Row"];
export type SourceRow = Database["public"]["Tables"]["sources"]["Row"];

// Every function here uses lib/supabase/server.ts (the cookie-aware
// client), NOT lib/supabase/static.ts's public client. That matters:
// the public client is anon, and the "published guides are publicly
// readable" RLS policy would silently hide every draft guide from the
// admin dashboard. The cookie-aware client carries the signed-in admin's
// session, so RLS's `status = 'published' OR is_admin()` clause lets
// them see everything.

export async function getAdminDashboardCounts() {
  const supabase = await createClient();
  const [guides, published, categories, experts] = await Promise.all([
    supabase.from("guides").select("id", { count: "exact", head: true }),
    supabase
      .from("guides")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("experts").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalGuides: guides.count ?? 0,
    publishedGuides: published.count ?? 0,
    draftGuides: (guides.count ?? 0) - (published.count ?? 0),
    categories: categories.count ?? 0,
    experts: experts.count ?? 0,
  };
}

export async function getAdminGuides(): Promise<
  (GuideRow & { categoryName: string | null })[]
> {
  const supabase = await createClient();
  const { data: guides, error } = await supabase
    .from("guides")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!guides || guides.length === 0) return [];

  const categoryIds = [...new Set(guides.map((g) => g.category_id))];
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .in("id", categoryIds);

  return guides.map((g) => ({
    ...g,
    categoryName:
      categories?.find((c) => c.id === g.category_id)?.name ?? null,
  }));
}

export async function getAdminGuideById(id: string) {
  const supabase = await createClient();

  const { data: guide, error } = await supabase
    .from("guides")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!guide) return null;

  const [{ data: steps }, { data: sources }, { data: guideExperts }] =
    await Promise.all([
      supabase
        .from("guide_steps")
        .select("*")
        .eq("guide_id", id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("sources")
        .select("*")
        .eq("guide_id", id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("guide_experts")
        .select("expert_id, advice_text, interviewed_at")
        .eq("guide_id", id),
    ]);

  return {
    guide,
    steps: steps ?? [],
    sources: sources ?? [],
    guideExperts: guideExperts ?? [],
  };
}

export async function getAdminCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminCategoryById(
  id: string
): Promise<CategoryRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminExperts(): Promise<ExpertRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experts")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminExpertById(
  id: string
): Promise<ExpertRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
