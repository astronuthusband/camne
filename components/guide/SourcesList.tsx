import type { SourceRow } from "@/lib/queries/guides";
import { SourceTypeBadge } from "./SourceTypeBadge";

export function SourcesList({ sources }: { sources: SourceRow[] }) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-ink">
        Official sources
      </h2>
      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li key={source.id}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border bg-paper-raised px-4 py-3 text-sm text-ink transition hover:border-teal hover:text-teal"
            >
              <SourceTypeBadge type={source.source_type} />
              <span className="flex-1 truncate">{source.label}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-4 w-4 shrink-0 text-ink-soft"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
