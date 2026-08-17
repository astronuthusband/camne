import { createPublicClient } from "@/lib/supabase/static";

export interface SearchResult {
  slug: string;
  title: string;
  estimatedCostText: string | null;
  estimatedTimeText: string | null;
  categorySlug: string;
  categoryName: string;
}

// Small, hand-maintained bridge from common Malay keywords to the English
// terms our (currently English-only) guide content actually uses. Not a
// translation engine — just enough so "camne nak renew lesen" still finds
// "renew driving licence" before real Malay content (guides.locale = 'ms')
// exists. Safe to delete once bilingual guides make this redundant.
const MALAY_TO_ENGLISH: Record<string, string> = {
  lesen: "licence",
  kereta: "car",
  rumah: "house",
  cukai: "tax",
  syarikat: "company",
  perniagaan: "business",
  sewa: "rent",
  jual: "sell",
  beli: "buy",
  daftar: "register",
  bayar: "pay",
  pasport: "passport",
  gantikan: "replace",
};

function bridgeMalayTerms(query: string): string {
  return query
    .split(/\s+/)
    .map((word) => MALAY_TO_ENGLISH[word.toLowerCase()] ?? word)
    .join(" ");
}

export async function searchGuides(query: string): Promise<SearchResult[]> {
  const supabase = createPublicClient();
  const bridgedQuery = bridgeMalayTerms(query);

  const { data, error } = await supabase.rpc("search_guides", {
    search_query: bridgedQuery,
    result_limit: 20,
  });

  if (error) throw error;
  let results: SearchResult[] = (data ?? []).map((r) => ({
    slug: r.slug,
    title: r.title,
    estimatedCostText: r.estimated_cost_text,
    estimatedTimeText: r.estimated_time_text,
    categorySlug: r.category_slug,
    categoryName: r.category_name,
  }));

  // Full-text search is word-based, so short/partial queries (e.g. "pas")
  // often return nothing even when a title obviously matches. A plain
  // substring fallback catches those cases without pulling in a fuzzy-
  // matching extension for what's still a fairly small guide catalog.
  if (results.length === 0) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("guides")
      .select("slug, title, estimated_cost_text, estimated_time_text, category_id")
      .eq("status", "published")
      .ilike("title", `%${query}%`)
      .limit(20);

    if (!fallbackError && fallback && fallback.length > 0) {
      const categoryIds = [...new Set(fallback.map((g) => g.category_id))];
      const { data: categories } = await supabase
        .from("categories")
        .select("id, slug, name")
        .in("id", categoryIds);

      results = fallback.map((g) => {
        const category = categories?.find((c) => c.id === g.category_id);
        return {
          slug: g.slug,
          title: g.title,
          estimatedCostText: g.estimated_cost_text,
          estimatedTimeText: g.estimated_time_text,
          categorySlug: category?.slug ?? "",
          categoryName: category?.name ?? "",
        };
      });
    }
  }

  return results;
}

// Fire-and-forget: a broken analytics insert should never break the
// search page itself, so failures are swallowed here rather than thrown.
export async function logSearch(query: string, resultCount: number) {
  if (!query.trim()) return;
  try {
    const supabase = createPublicClient();
    await supabase
      .from("search_analytics")
      .insert({ query, result_count: resultCount });
  } catch {
    // Analytics logging is best-effort — never let it affect the page.
  }
}
