import type { SourceType } from "@/lib/supabase/database.types";

const config: Record<SourceType, { label: string; className: string }> = {
  official: {
    label: "Official",
    className: "bg-teal-soft text-teal-deep",
  },
  expert: {
    label: "Expert",
    className: "bg-gold-soft text-ink",
  },
  reference: {
    label: "Reference",
    className: "bg-paper text-ink-soft border border-border",
  },
};

export function SourceTypeBadge({ type }: { type: SourceType }) {
  const c = config[type] ?? config.reference;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${c.className}`}
    >
      {c.label}
    </span>
  );
}
