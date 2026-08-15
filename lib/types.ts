// Shared types for CAMNE. These mirror the Supabase schema we designed in
// Phase 0, so Phase 2 (connecting the real database) is mostly a matter of
// swapping the data source, not reshaping components.

export type CategorySlug =
  | "government"
  | "business"
  | "property"
  | "cars"
  | "money"
  | "education"
  | "home"
  | "everyday";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  guideCount: number; // placeholder count until Phase 2 wires up real data
}

export interface GuideSummary {
  slug: string;
  title: string;
  categorySlug: CategorySlug;
  estimatedCostText: string;
  estimatedTimeText: string;
}

export interface PopularSearch {
  label: string;
  href: string;
}
