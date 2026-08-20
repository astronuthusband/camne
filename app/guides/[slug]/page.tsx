import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getGuideBySlug,
  getGuidesForCategory,
  getPublishedGuideSlugs,
} from "@/lib/queries/guides";
import { getCategoryById } from "@/lib/queries/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StepList } from "@/components/guide/StepList";
import { CommonMistakes } from "@/components/guide/CommonMistakes";
import { ExpertAdvice } from "@/components/guide/ExpertAdvice";
import { SourcesList } from "@/components/guide/SourcesList";
import { GuideCard } from "@/components/guide/GuideCard";
import { BookmarkButton } from "@/components/guide/BookmarkButton";
import { FeedbackWidget } from "@/components/guide/FeedbackWidget";

export async function generateStaticParams() {
  const slugs = await getPublishedGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};

  const title = guide.seo_title || guide.title;
  const description = guide.seo_description || guide.overview || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: guide.featured_image_url
        ? [{ url: guide.featured_image_url }]
        : undefined,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const category = await getCategoryById(guide.category_id);
  const relatedGuides = await getGuidesForCategory(guide.category_id, {
    excludeGuideId: guide.id,
    limit: 3,
  });

  const whatYoullNeed = (guide.what_youll_need ?? []) as string[];
  const commonMistakes = (guide.common_mistakes ?? []) as string[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(category
            ? [{ label: category.name, href: `/categories/${category.slug}` }]
            : []),
          { label: guide.title },
        ]}
      />

      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          {guide.title}
        </h1>
        <div className="mt-1 shrink-0">
          <BookmarkButton guideId={guide.id} />
        </div>
      </div>

      {guide.last_verified_at && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          Last verified: {formatDate(guide.last_verified_at)}
        </p>
      )}

      {(guide.estimated_cost_text || guide.estimated_time_text) && (
        <div className="ticket-divider mt-5 flex items-center justify-between pt-3 font-mono text-sm text-ink-soft">
          <span>{guide.estimated_cost_text || "—"}</span>
          <span>{guide.estimated_time_text || "—"}</span>
        </div>
      )}

      {guide.overview && (
        <p className="mt-6 text-base leading-relaxed text-ink">
          {guide.overview}
        </p>
      )}

      {guide.who_this_is_for && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Who this is for
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {guide.who_this_is_for}
          </p>
        </section>
      )}

      {guide.before_you_start && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Before you start
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {guide.before_you_start}
          </p>
        </section>
      )}

      {whatYoullNeed.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            What you&apos;ll need
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {whatYoullNeed.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-teal">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <StepList steps={guide.steps} />
      <CommonMistakes items={commonMistakes} />
      <ExpertAdvice attributions={guide.expertAttributions} />
      <SourcesList sources={guide.sources} />
      <FeedbackWidget guideId={guide.id} />

      <p className="mt-8 border-t border-border pt-6 text-xs text-ink-soft">
        This guide is for general information and does not replace
        professional legal, financial, or tax advice. Fees and
        requirements are set by the relevant authority and may change —
        always confirm against the official sources above before you
        apply.
      </p>

      {relatedGuides.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">
            Related guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedGuides.map((g) => (
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
        </section>
      )}
    </div>
  );
}
