import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchBar } from "@/components/search/SearchBar";

// NOTE: this is a Phase 1 UI shell. It filters the small local placeholder
// dataset in lib/data.ts on the client. Phase 4 replaces the matching logic
// with real Postgres full-text search (and later, natural-language intent
// matching) — the <SearchResults> component boundary is drawn so that swap
// doesn't touch this page.
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
