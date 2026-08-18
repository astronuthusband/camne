"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  GuideRow,
  CategoryRow,
  ExpertRow,
  GuideStepRow,
  SourceRow,
} from "@/lib/admin/queries";
import type { SourceType } from "@/lib/supabase/database.types";
import {
  saveGuide,
  deleteGuide,
  addGuideExpert,
  removeGuideExpert,
} from "../../actions";

interface StepDraft {
  title: string;
  content: string;
}
interface SourceDraft {
  sourceType: SourceType;
  label: string;
  url: string;
}
interface GuideExpertLink {
  expert_id: string;
  advice_text: string | null;
  interviewed_at: string | null;
}

const SOURCE_TYPES: SourceType[] = ["official", "expert", "reference"];

export function GuideEditor({
  guide,
  initialSteps,
  initialSources,
  guideExperts,
  categories,
  experts,
}: {
  guide: GuideRow;
  initialSteps: GuideStepRow[];
  initialSources: SourceRow[];
  guideExperts: GuideExpertLink[];
  categories: CategoryRow[];
  experts: ExpertRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // --- Meta fields ---------------------------------------------------
  const [title, setTitle] = useState(guide.title);
  const [slug, setSlug] = useState(guide.slug);
  const [categoryId, setCategoryId] = useState(guide.category_id);
  const [status, setStatus] = useState(guide.status);
  const [overview, setOverview] = useState(guide.overview ?? "");
  const [whoThisIsFor, setWhoThisIsFor] = useState(guide.who_this_is_for ?? "");
  const [beforeYouStart, setBeforeYouStart] = useState(
    guide.before_you_start ?? ""
  );
  const [estimatedCostText, setEstimatedCostText] = useState(
    guide.estimated_cost_text ?? ""
  );
  const [estimatedTimeText, setEstimatedTimeText] = useState(
    guide.estimated_time_text ?? ""
  );
  const [lastVerifiedAt, setLastVerifiedAt] = useState(
    guide.last_verified_at ?? ""
  );
  const [seoTitle, setSeoTitle] = useState(guide.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    guide.seo_description ?? ""
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    guide.featured_image_url ?? ""
  );

  // --- List fields -----------------------------------------------------
  const [whatYoullNeed, setWhatYoullNeed] = useState<string[]>(
    (guide.what_youll_need as string[]) ?? []
  );
  const [commonMistakes, setCommonMistakes] = useState<string[]>(
    (guide.common_mistakes as string[]) ?? []
  );
  const [steps, setSteps] = useState<StepDraft[]>(
    initialSteps.map((s) => ({ title: s.title, content: s.content }))
  );
  const [sources, setSources] = useState<SourceDraft[]>(
    initialSources.map((s) => ({
      sourceType: s.source_type,
      label: s.label,
      url: s.url,
    }))
  );

  function handleSave() {
    setSaveError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveGuide(guide.id, {
        meta: {
          title,
          slug,
          categoryId,
          overview,
          whoThisIsFor,
          beforeYouStart,
          estimatedCostText,
          estimatedTimeText,
          lastVerifiedAt,
          seoTitle,
          seoDescription,
          featuredImageUrl,
          status,
          whatYoullNeed,
          commonMistakes,
        },
        steps,
        sources,
      });
      if (result.error) {
        setSaveError(result.error);
      } else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <div className="max-w-3xl pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {guide.title}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "published"
              ? "bg-teal-soft text-teal-deep"
              : "bg-gold-soft text-ink"
          }`}
        >
          {status === "published" ? "Published" : "Draft"}
        </span>
      </div>

      {/* --- Basics --- */}
      <Section title="Basics">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Slug" hint="Used in the URL: /guides/…">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            pattern="[a-z0-9-]+"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* --- Content --- */}
      <Section title="Content">
        <Field label="Overview">
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Who this is for">
          <textarea
            value={whoThisIsFor}
            onChange={(e) => setWhoThisIsFor(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>
        <Field label="Before you start">
          <textarea
            value={beforeYouStart}
            onChange={(e) => setBeforeYouStart(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>
      </Section>

      {/* --- Cost / time / verification --- */}
      <Section title="Cost, time & verification">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Estimated cost">
            <input
              value={estimatedCostText}
              onChange={(e) => setEstimatedCostText(e.target.value)}
              placeholder="RM200"
              className={inputClass}
            />
          </Field>
          <Field label="Estimated time">
            <input
              value={estimatedTimeText}
              onChange={(e) => setEstimatedTimeText(e.target.value)}
              placeholder="15–30 minutes"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Last verified">
          <input
            type="date"
            value={lastVerifiedAt}
            onChange={(e) => setLastVerifiedAt(e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      {/* --- What you'll need --- */}
      <Section title="What you'll need">
        <StringListEditor items={whatYoullNeed} onChange={setWhatYoullNeed} />
      </Section>

      {/* --- Steps --- */}
      <Section title="Step-by-step">
        <StepListEditor steps={steps} onChange={setSteps} />
      </Section>

      {/* --- Common mistakes --- */}
      <Section title="Common mistakes">
        <StringListEditor items={commonMistakes} onChange={setCommonMistakes} />
      </Section>

      {/* --- Sources --- */}
      <Section title="Official sources">
        <SourceListEditor sources={sources} onChange={setSources} />
      </Section>

      {/* --- Expert attribution --- */}
      <Section title="Expert advice">
        <ExpertAttributionEditor
          guideId={guide.id}
          guideExperts={guideExperts}
          experts={experts}
        />
      </Section>

      {/* --- SEO --- */}
      <Section title="SEO">
        <Field label="SEO title" hint="Falls back to the guide title if empty">
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label="SEO description"
          hint="Falls back to the overview if empty"
        >
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>
        <Field label="Featured image URL">
          <input
            value={featuredImageUrl}
            onChange={(e) => setFeaturedImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
      </Section>

      {/* --- Danger zone --- */}
      <Section title="Danger zone">
        <form
          action={deleteGuide}
          onSubmit={(e) => {
            if (
              !confirm(
                `Delete "${guide.title}"? This can't be undone.`
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={guide.id} />
          <button
            type="submit"
            className="rounded-full border border-coral px-4 py-2 text-sm font-medium text-coral hover:bg-coral-soft"
          >
            Delete this guide
          </button>
        </form>
      </Section>

      {/* --- Sticky save bar --- */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-paper-raised/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="text-sm">
            {saveError && <span className="text-coral">{saveError}</span>}
            {saved && !saveError && (
              <span className="text-teal">Saved.</span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full bg-teal px-6 py-2.5 text-sm font-medium text-white transition hover:bg-teal-deep disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">
        {label}
        {hint && <span className="ml-1 font-normal text-ink-soft">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// String list editor (what you'll need / common mistakes)
// ─────────────────────────────────────────────────────────────────────────

function StringListEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="shrink-0 rounded-lg border border-border px-3 text-sm text-coral hover:bg-coral-soft"
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-teal hover:text-teal"
      >
        + Add item
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Step list editor
// ─────────────────────────────────────────────────────────────────────────

function StepListEditor({
  steps,
  onChange,
}: {
  steps: StepDraft[];
  onChange: (steps: StepDraft[]) => void;
}) {
  function update(i: number, patch: Partial<StepDraft>) {
    const next = [...steps];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="rounded-xl border border-border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-ink-soft">
              Step {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded px-2 text-xs text-ink-soft hover:text-teal disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === steps.length - 1}
                className="rounded px-2 text-xs text-ink-soft hover:text-teal disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(steps.filter((_, idx) => idx !== i))}
                className="rounded px-2 text-xs text-coral hover:bg-coral-soft"
              >
                Remove
              </button>
            </div>
          </div>
          <input
            value={step.title}
            onChange={(e) => update(i, { title: e.target.value })}
            placeholder="Step title"
            className={`${inputClass} mb-2`}
          />
          <textarea
            value={step.content}
            onChange={(e) => update(i, { content: e.target.value })}
            placeholder="What to actually do"
            rows={2}
            className={inputClass}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...steps, { title: "", content: "" }])}
        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-teal hover:text-teal"
      >
        + Add step
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Source list editor
// ─────────────────────────────────────────────────────────────────────────

function SourceListEditor({
  sources,
  onChange,
}: {
  sources: SourceDraft[];
  onChange: (sources: SourceDraft[]) => void;
}) {
  function update(i: number, patch: Partial<SourceDraft>) {
    const next = [...sources];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {sources.map((source, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3">
          <select
            value={source.sourceType}
            onChange={(e) =>
              update(i, { sourceType: e.target.value as SourceType })
            }
            className="rounded-lg border border-border bg-paper px-2 py-1.5 text-xs"
          >
            {SOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={source.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Label"
            className="min-w-[10rem] flex-1 rounded-lg border border-border bg-paper px-2 py-1.5 text-sm"
          />
          <input
            value={source.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://..."
            className="min-w-[12rem] flex-[2] rounded-lg border border-border bg-paper px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => onChange(sources.filter((_, idx) => idx !== i))}
            className="shrink-0 rounded-lg border border-border px-2 py-1.5 text-xs text-coral hover:bg-coral-soft"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...sources, { sourceType: "official", label: "", url: "" }])
        }
        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-teal hover:text-teal"
      >
        + Add source
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Expert attribution editor — uses the FormData-based actions directly
// (addGuideExpert / removeGuideExpert), separate from the big save flow,
// since each is a single-row operation that takes effect immediately.
// ─────────────────────────────────────────────────────────────────────────

function ExpertAttributionEditor({
  guideId,
  guideExperts,
  experts,
}: {
  guideId: string;
  guideExperts: GuideExpertLink[];
  experts: ExpertRow[];
}) {
  const attachedIds = new Set(guideExperts.map((ge) => ge.expert_id));
  const availableExperts = experts.filter((e) => !attachedIds.has(e.id));

  return (
    <div className="space-y-4">
      {guideExperts.length > 0 && (
        <div className="space-y-2">
          {guideExperts.map((ge) => {
            const expert = experts.find((e) => e.id === ge.expert_id);
            return (
              <div
                key={ge.expert_id}
                className="flex items-center justify-between rounded-xl border border-gold-soft bg-gold-soft/40 px-4 py-3"
              >
                <div className="text-sm">
                  <p className="font-medium text-ink">
                    {expert?.name ?? "Unknown expert"}
                  </p>
                  {ge.advice_text && (
                    <p className="mt-0.5 text-ink-soft">
                      &ldquo;{ge.advice_text}&rdquo;
                    </p>
                  )}
                </div>
                <form action={removeGuideExpert}>
                  <input type="hidden" name="guideId" value={guideId} />
                  <input type="hidden" name="expertId" value={ge.expert_id} />
                  <button
                    type="submit"
                    className="shrink-0 text-xs text-coral hover:underline"
                  >
                    Remove
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      {experts.length === 0 ? (
        <p className="text-sm text-ink-soft">
          No experts yet — add one under Experts first.
        </p>
      ) : availableExperts.length === 0 ? (
        <p className="text-sm text-ink-soft">
          Every expert is already attributed to this guide.
        </p>
      ) : (
        <form
          action={addGuideExpert}
          className="space-y-2 rounded-xl border border-dashed border-border p-3"
        >
          <input type="hidden" name="guideId" value={guideId} />
          <select
            name="expertId"
            required
            className="w-full rounded-lg border border-border bg-paper px-2 py-1.5 text-sm"
          >
            {availableExperts.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <textarea
            name="adviceText"
            placeholder="Quote or paraphrased advice from the interview"
            rows={2}
            className="w-full rounded-lg border border-border bg-paper px-2 py-1.5 text-sm"
          />
          <input
            name="interviewedAt"
            type="date"
            className="w-full rounded-lg border border-border bg-paper px-2 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-teal px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-deep"
          >
            Attribute
          </button>
        </form>
      )}
    </div>
  );
}
