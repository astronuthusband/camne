import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/static";
import type { Database } from "@/lib/supabase/database.types";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

// Wrapped in React's cache() so repeated calls for the same data within
// one request (e.g. generateMetadata + the page component both asking
// for the same category) only hit Supabase once.

export const getCategories = cache(async (): Promise<CategoryRow[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<CategoryRow | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
);

export const getCategoryById = cache(
  async (id: string): Promise<CategoryRow | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
);
