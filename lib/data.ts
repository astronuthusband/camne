import type { PopularSearch } from "./types";

// As of Phase 4, categories, guides, and search all read live from
// Supabase (see lib/queries/). What's left here is the one piece
// deliberately NOT database-driven: a hand-curated homepage shortcut
// list, same spirit as most "popular searches" features. Now that
// Phase 4 logs every search to search_analytics, a future version of
// this could be replaced by a "top searched queries" query — worth
// revisiting once there's real usage data to make that meaningful.

export const popularSearches: PopularSearch[] = [
  { label: "Renew passport", href: "/guides/renew-malaysian-passport" },
  { label: "Register SSM", href: "/guides/register-ssm" },
  { label: "Buy a house", href: "/guides/buy-my-first-house" },
  { label: "Buy a second-hand car", href: "/guides/buy-a-second-hand-car" },
  { label: "File income tax", href: "/guides/file-income-tax" },
  { label: "Renew driving licence", href: "/guides/renew-driving-licence" },
];
