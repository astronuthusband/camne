import Link from "next/link";

export interface GuideCardInfo {
  slug: string;
  title: string;
  estimatedCostText?: string | null;
  estimatedTimeText?: string | null;
}

// Signature "ticket-stub" info strip: cost and time set in monospace,
// separated by a dashed ticket-divider — the one place we lean into the
// receipt/counter-slip motif that ties back to what CAMNE actually does.
export function GuideCard({ guide }: { guide: GuideCardInfo }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-paper-raised p-5 transition hover:-translate-y-0.5 hover:border-teal hover:shadow-md"
    >
      <p className="font-display text-lg font-semibold text-ink group-hover:text-teal">
        {guide.title}
      </p>
      <div className="ticket-divider mt-4 flex items-center justify-between pt-3 font-mono text-xs text-ink-soft">
        <span>{guide.estimatedCostText || "—"}</span>
        <span>{guide.estimatedTimeText || "—"}</span>
      </div>
    </Link>
  );
}
