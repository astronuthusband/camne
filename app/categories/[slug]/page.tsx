import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categories";
import { getGuidesForCategory } from "@/lib/queries/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { GuideCard } from "@/components/guide/GuideCard";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const guides = await getGuidesForCategory(category.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: category.name }]}
      />

      <div className="mb-8 flex items-center gap-4">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in srgb, var(--color-cat-${category.slug}, var(--color-teal)) 14%, white)`,
            color: `var(--color-cat-${category.slug}, var(--color-teal))`,
          }}
        >
          <CategoryIcon slug={category.slug} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-ink-soft">{category.description}</p>
          )}
        </div>
      </div>

      {guides.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((g) => (
            <GuideCard
              key={g.slug}
              guide={{
                slug: g.slug,
                title: g.title,
                estimatedCostText: g.estimatedCostText,
                estimatedTimeText: g.estimatedTimeText,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-ink-soft">
          <p className="font-medium text-ink">No guides here yet.</p>
          <p className="mt-1 text-sm">
            We&apos;re still writing this category — check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
