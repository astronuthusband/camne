// Shared types for CAMNE that aren't tied to the database schema —
// categories and full guide data now come from lib/queries/ (Phase 3),
// backed by lib/supabase/database.types.ts. What's left here is content
// this app curates itself rather than fetching live (see lib/data.ts).

export type CategorySlug =
  | "government"
  | "business"
  | "property"
  | "cars"
  | "money"
  | "education"
  | "home"
  | "everyday";

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
