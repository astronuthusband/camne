import type { PopularSearch, GuideSummary } from "./types";

// As of Phase 3, categories and guides are served live from Supabase
// (see lib/queries/). What's left here is content Phase 3 deliberately
// didn't move to the database:
//
// - popularSearches: a hand-curated homepage shortcut list, not meant to
//   be a live query — same spirit as most "popular searches" features.
// - guideSummaries: still powers the client-side text filter on
//   /search until Phase 4 replaces it with real Postgres full-text
//   search against the guides table.

export const popularSearches: PopularSearch[] = [
  { label: "Renew passport", href: "/guides/renew-malaysian-passport" },
  { label: "Register SSM", href: "/guides/register-ssm" },
  { label: "Buy a house", href: "/guides/buy-my-first-house" },
  { label: "Buy a second-hand car", href: "/guides/buy-a-second-hand-car" },
  { label: "File income tax", href: "/guides/file-income-tax" },
  { label: "Renew driving licence", href: "/guides/renew-driving-licence" },
];

export const guideSummaries: GuideSummary[] = [
  {
    slug: "renew-malaysian-passport",
    title: "Camne nak renew passport?",
    categorySlug: "government",
    estimatedCostText: "RM200 / RM350",
    estimatedTimeText: "Same day",
  },
  {
    slug: "replace-mykad",
    title: "Camne nak replace MyKad?",
    categorySlug: "government",
    estimatedCostText: "RM10",
    estimatedTimeText: "Same day",
  },
  {
    slug: "renew-driving-licence",
    title: "Camne nak renew driving licence?",
    categorySlug: "government",
    estimatedCostText: "RM30–RM90",
    estimatedTimeText: "15 minutes",
  },
  {
    slug: "renew-road-tax",
    title: "Camne nak renew road tax?",
    categorySlug: "government",
    estimatedCostText: "Varies",
    estimatedTimeText: "10–15 minutes",
  },
  {
    slug: "register-ssm",
    title: "Camne nak register SSM?",
    categorySlug: "business",
    estimatedCostText: "RM30 / RM60",
    estimatedTimeText: "Same day",
  },
  {
    slug: "start-a-business",
    title: "Camne nak start a business?",
    categorySlug: "business",
    estimatedCostText: "Varies",
    estimatedTimeText: "1–2 weeks",
  },
  {
    slug: "rent-a-house",
    title: "Camne nak rent a house?",
    categorySlug: "property",
    estimatedCostText: "Deposit + 1 month",
    estimatedTimeText: "1–3 weeks",
  },
  {
    slug: "buy-my-first-house",
    title: "Camne nak buy my first house?",
    categorySlug: "property",
    estimatedCostText: "Varies",
    estimatedTimeText: "Weeks to months",
  },
  {
    slug: "buy-a-second-hand-car",
    title: "Camne nak buy a second-hand car?",
    categorySlug: "cars",
    estimatedCostText: "Varies",
    estimatedTimeText: "1–2 weeks",
  },
  {
    slug: "file-income-tax",
    title: "Camne nak file income tax?",
    categorySlug: "money",
    estimatedCostText: "Free",
    estimatedTimeText: "30–60 minutes",
  },
];
