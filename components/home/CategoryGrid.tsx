import Link from "next/link";
import { categories } from "@/lib/data";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

// Each category gets its own quiet color wash (set in globals.css as
// --color-cat-*) rather than one repeated brand accent everywhere — makes
// the grid scannable and hints that CAMNE spans real breadth of topics.
export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Browse by category
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-paper-raised p-4 transition hover:-translate-y-0.5 hover:border-teal hover:shadow-md sm:p-5"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-cat-${cat.slug}) 14%, white)`,
                color: `var(--color-cat-${cat.slug})`,
              }}
            >
              <CategoryIcon slug={cat.slug} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-ink">{cat.name}</p>
              <p className="mt-0.5 text-xs text-ink-soft">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
