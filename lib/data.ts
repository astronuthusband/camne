import type { Category, PopularSearch, GuideSummary } from "./types";

// V1 placeholder content. In Phase 2 this file is replaced by queries
// against Supabase — components should already be shaped to accept this
// data structure so that swap is mechanical.

export const categories: Category[] = [
  {
    slug: "government",
    name: "Government",
    description: "Documents, licences, and government services.",
    guideCount: 3,
  },
  {
    slug: "business",
    name: "Business",
    description: "Starting and running a business in Malaysia.",
    guideCount: 2,
  },
  {
    slug: "property",
    name: "Property",
    description: "Renting, buying, and owning property.",
    guideCount: 2,
  },
  {
    slug: "cars",
    name: "Cars",
    description: "Buying, selling, and maintaining a car.",
    guideCount: 1,
  },
  {
    slug: "money",
    name: "Money",
    description: "Tax, EPF, insurance, and personal finance.",
    guideCount: 1,
  },
  {
    slug: "education",
    name: "Education",
    description: "University, scholarships, and courses.",
    guideCount: 0,
  },
  {
    slug: "home",
    name: "Home",
    description: "Renovation, contractors, and utilities.",
    guideCount: 0,
  },
  {
    slug: "everyday",
    name: "Everyday",
    description: "Practical life tasks and common problems.",
    guideCount: 0,
  },
];

export const popularSearches: PopularSearch[] = [
  { label: "Renew passport", href: "/guides/renew-malaysian-passport" },
  { label: "Register SSM", href: "/guides/register-ssm" },
  { label: "Buy a house", href: "/guides/buy-my-first-house" },
  { label: "Buy a second-hand car", href: "/guides/buy-a-second-hand-car" },
  { label: "File income tax", href: "/guides/file-income-tax" },
  { label: "Renew driving licence", href: "/guides/renew-driving-licence" },
];

// A handful of stub guides so /guides/[slug] has something real to render
// in Phase 1. Full structured content (steps, sources, experts) arrives in
// Phase 3 once Supabase is connected.
export const guideSummaries: GuideSummary[] = [
  {
    slug: "renew-malaysian-passport",
    title: "Camne nak renew passport?",
    categorySlug: "government",
    estimatedCostText: "RM200",
    estimatedTimeText: "15–30 minutes at the counter",
  },
  {
    slug: "replace-mykad",
    title: "Camne nak replace MyKad?",
    categorySlug: "government",
    estimatedCostText: "RM10 (first replacement)",
    estimatedTimeText: "Same day",
  },
  {
    slug: "renew-driving-licence",
    title: "Camne nak renew driving licence?",
    categorySlug: "government",
    estimatedCostText: "RM30–RM90 depending on term",
    estimatedTimeText: "15 minutes",
  },
  {
    slug: "register-ssm",
    title: "Camne nak register SSM?",
    categorySlug: "business",
    estimatedCostText: "RM60 (sole proprietor)",
    estimatedTimeText: "Same day online",
  },
  {
    slug: "buy-my-first-house",
    title: "Camne nak buy my first house?",
    categorySlug: "property",
    estimatedCostText: "Varies — legal fees + stamp duty",
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
    estimatedCostText: "Free (e-Filing)",
    estimatedTimeText: "30–60 minutes",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getGuidesForCategory(slug: string): GuideSummary[] {
  return guideSummaries.filter((g) => g.categorySlug === slug);
}

export function getGuide(slug: string): GuideSummary | undefined {
  return guideSummaries.find((g) => g.slug === slug);
}
