// Shared types for content this app curates itself rather than fetching
// live — categories and full guide data come from lib/queries/, backed
// by lib/supabase/database.types.ts.

export type CategorySlug =
  | "government"
  | "business"
  | "property"
  | "cars"
  | "money"
  | "education"
  | "home"
  | "everyday";

export interface PopularSearch {
  label: string;
  href: string;
}
