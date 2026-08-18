import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getExpertBySlug,
  getExpertSlugs,
  getGuidesForExpert,
} from "@/lib/queries/experts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GuideCard } from "@/components/guide/GuideCard";

export async function generateStaticParams() {
  const slugs = await getExpertSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const expert = await getExpertBySlug(slug);
  if (!expert) return {};
  return {
    title: expert.name,
    description: expert.bio ?? undefined,
  };
}

export default async function ExpertPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expert = await getExpertBySlug(slug);
  if (!expert) notFound();

  const guides = await getGuidesForExpert(expert.id);
  const credentials = (expert.credentials ?? []) as string[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: expert.name }]} />

      <div className="flex items-center gap-4">
        {expert.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={expert.photo_url}
            alt={expert.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal font-display text-2xl text-white">
            {expert.name.charAt(0)}
          </span>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {expert.name}
          </h1>
          {(expert.profession || expert.company) && (
            <p className="text-sm text-ink-soft">
              {[expert.profession, expert.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {expert.bio && (
        <p className="mt-6 text-base leading-relaxed text-ink">{expert.bio}</p>
      )}

      {credentials.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Credentials
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {credentials.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-teal">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">
            Guides {expert.name} contributed to
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {guides.map((g) => (
              <GuideCard
                key={g.slug}
                guide={{
                  slug: g.slug,
                  title: g.title,
                  estimatedCostText: g.estimatedCostText,
                  estimatedTimeText: g.estimatedTimeText,
                  categoryName: g.categoryName,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
