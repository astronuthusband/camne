import Link from "next/link";
import { getAdminGuides } from "@/lib/admin/queries";
import { setGuideStatus } from "./actions";
import { DeleteGuideButton } from "./DeleteGuideButton";

export default async function AdminGuidesPage() {
  const guides = await getAdminGuides();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Guides
        </h1>
        <Link
          href="/admin/guides/new"
          className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
        >
          + New guide
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-raised text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last verified</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {guides.map((g) => (
              <tr key={g.id} className="bg-paper-raised/50">
                <td className="px-4 py-3 font-medium text-ink">{g.title}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {g.categoryName ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <form action={setGuideStatus}>
                    <input type="hidden" name="id" value={g.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={g.status === "published" ? "draft" : "published"}
                    />
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                        g.status === "published"
                          ? "bg-teal-soft text-teal-deep hover:bg-teal/20"
                          : "bg-gold-soft text-ink hover:bg-gold/30"
                      }`}
                      title={
                        g.status === "published"
                          ? "Click to unpublish"
                          : "Click to publish"
                      }
                    >
                      {g.status === "published" ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {g.last_verified_at ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/guides/${g.id}/edit`}
                      className="text-teal hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteGuideButton id={g.id} title={g.title} />
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
