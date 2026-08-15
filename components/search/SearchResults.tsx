import { guideSummaries } from "@/lib/data";
import { GuideCard } from "@/components/guide/GuideCard";
import { popularSearches } from "@/lib/data";
import Link from "next/link";

function matches(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return guideSummaries.filter((g) => g.title.toLowerCase().includes(q));
}

export function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="mt-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-soft/70">
          Try one of these
        </p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-paper-raised px-4 py-2 text-sm text-ink-soft hover:border-teal hover:text-teal"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const results = matches(query);

  if (results.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="font-medium text-ink">
          No guides found for &ldquo;{query}&rdquo; yet.
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          We&apos;re adding new guides regularly — try a different phrase,
          or browse categories from the homepage.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {results.map((g) => (
        <GuideCard key={g.slug} guide={g} />
      ))}
    </div>
  );
}
