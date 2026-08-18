"use client";

import { useActionState } from "react";
import type { ExpertRow } from "@/lib/admin/queries";

export function ExpertForm({
  expert,
  action,
}: {
  expert?: ExpertRow;
  action: (
    prevState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const credentials = ((expert?.credentials as string[]) ?? []).join("\n");

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {expert && <input type="hidden" name="id" value={expert.id} />}

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Name</label>
        <input
          name="name"
          required
          defaultValue={expert?.name}
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Slug
          <span className="ml-1 font-normal text-ink-soft">
            — used in the URL, e.g. /experts/jane-tan
          </span>
        </label>
        <input
          name="slug"
          required
          pattern="[a-z0-9-]+"
          title="Lowercase letters, numbers, and hyphens only"
          defaultValue={expert?.slug}
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Profession
          </label>
          <input
            name="profession"
            defaultValue={expert?.profession ?? ""}
            placeholder="Property Lawyer"
            className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Company
          </label>
          <input
            name="company"
            defaultValue={expert?.company ?? ""}
            className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Photo URL
          <span className="ml-1 font-normal text-ink-soft">optional</span>
        </label>
        <input
          name="photoUrl"
          type="url"
          defaultValue={expert?.photo_url ?? ""}
          placeholder="https://..."
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Bio</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={expert?.bio ?? ""}
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Credentials
          <span className="ml-1 font-normal text-ink-soft">
            one per line
          </span>
        </label>
        <textarea
          name="credentials"
          rows={4}
          defaultValue={credentials}
          placeholder={"15 years in conveyancing\nBar Council member"}
          className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
        />
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
        {pending ? "Saving…" : expert ? "Save changes" : "Create expert"}
      </button>
    </form>
  );
}
