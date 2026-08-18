import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAdminCategories } from "@/lib/admin/queries";
import { createGuide } from "../actions";

export default async function NewGuidePage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Guides", href: "/admin/guides" }, { label: "New" }]}
      />
      <h1 className="mb-2 font-display text-2xl font-semibold text-ink">
        New guide
      </h1>
      <p className="mb-6 text-sm text-ink-soft">
        Start with the basics — you&apos;ll add steps, sources, and
        everything else on the next screen.
      </p>

      <form action={createGuide} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Title
          </label>
          <input
            name="title"
            required
            placeholder="Camne nak…?"
            className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Slug
            <span className="ml-1 font-normal text-ink-soft">
              — used in the URL, e.g. /guides/renew-passport
            </span>
          </label>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
            className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Category
          </label>
          <select
            name="categoryId"
            required
            className="w-full rounded-xl border border-border bg-paper-raised px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-ink-soft">
          New guides start as a draft — nothing goes live until you publish
          it from the editor.
        </p>

        <button
          type="submit"
          className="rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-deep"
        >
          Create & continue
        </button>
      </form>
    </div>
  );
}
