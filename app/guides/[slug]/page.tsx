import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { guideSummaries, getGuide, getCategory } from "@/lib/data";

export function generateStaticParams() {
  return guideSummaries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: guide.title };
}

// NOTE: this is a Phase 1 stub — just enough for the homepage, popular
// searches, and category pages to link somewhere real. The full guide
// template (overview, steps, sources, expert advice, last-verified date)
// is built in Phase 3 once Supabase is connected.
export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const category = getCategory(guide.categorySlug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-teal">
          Home
        </Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link
              href={`/categories/${category.slug}`}
              className="hover:text-teal"
            >
              {category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-ink">{guide.title}</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        {guide.title}
      </h1>

      <div className="ticket-divider mt-6 flex items-center justify-between pt-3 font-mono text-sm text-ink-soft">
        <span>{guide.estimatedCostText}</span>
        <span>{guide.estimatedTimeText}</span>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-sm text-ink-soft">
        <p className="font-medium text-ink">
          This guide&apos;s full content is coming in Phase 3.
        </p>
        <p className="mt-1">
          Overview, step-by-step instructions, common mistakes, expert
          advice, sources, and a &ldquo;last verified&rdquo; date will
          render here once guides are connected to Supabase.
        </p>
      </div>
    </div>
  );
}
