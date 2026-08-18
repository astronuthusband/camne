"use client";

import { useActionState } from "react";
import type { CategoryRow } from "@/lib/admin/queries";

export function CategoryForm({
  category,
  action,
}: {
  category?: CategoryRow;
  action: (
    prevState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {category && <input type="hidden" name="id" value={category.id} />}

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Name</label>
        <input
          name="name"
          required
          defaultValue={category?.name}
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Slug
          <span className="ml-1 font-normal text-ink-soft">
            — used in the URL, e.g. /categories/government
          </span>
        </label>
        <input
          name="slug"
          required
          pattern="[a-z0-9-]+"
          title="Lowercase letters, numbers, and hyphens only"
          defaultValue={category?.slug}
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={category?.description ?? ""}
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Icon key
            <span className="ml-1 font-normal text-ink-soft">optional</span>
          </label>
          <input
            name="icon"
            defaultValue={category?.icon ?? ""}
            placeholder="government"
            className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Sort order
          </label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={category?.sort_order ?? 0}
            className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : category ? "Save changes" : "Create category"}
      </button>
    </form>
  );
}
