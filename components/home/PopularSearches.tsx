import Link from "next/link";
import { popularSearches } from "@/lib/data";

export function PopularSearches() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-14">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-ink-soft/70">
        Popular searches
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {popularSearches.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-border bg-paper-raised px-4 py-2 text-sm text-ink-soft transition hover:border-teal hover:text-teal"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
