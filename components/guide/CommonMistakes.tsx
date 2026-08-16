export function CommonMistakes({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-coral-soft bg-coral-soft/40 p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-5 w-5 text-coral"
          aria-hidden="true"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
        Common mistakes
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-ink-soft">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-coral">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
