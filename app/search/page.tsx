import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchBar } from "@/components/search/SearchBar";

// Search runs server-side via lib/queries/search.ts (Postgres full-text
// search + a small Malay-keyword bridge + an ILIKE fallback for short/
// partial queries) — see that file for the matching strategy. This page
// stays a thin shell: parse the query param, render the search box, hand
// the rest to <SearchResults>.
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        Camne nak apa?
      </h1>
      <SearchBar defaultValue={query} autoFocus={!query} />
      <Suspense fallback={null}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
