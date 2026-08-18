import Link from "next/link";
import { getAdminCategories } from "@/lib/admin/queries";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Categories
        </h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
        >
          + New category
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-raised text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c.id} className="bg-paper-raised/50">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                  {c.slug}
                </td>
                <td className="px-4 py-3 text-ink-soft">{c.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="text-teal hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteCategoryButton id={c.id} name={c.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
