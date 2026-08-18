import Link from "next/link";
import { getAdminExperts } from "@/lib/admin/queries";
import { DeleteExpertButton } from "./DeleteExpertButton";

export default async function AdminExpertsPage() {
  const experts = await getAdminExperts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Experts
        </h1>
        <Link
          href="/admin/experts/new"
          className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
        >
          + New expert
        </Link>
      </div>

      {experts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-ink-soft">
          <p className="font-medium text-ink">No experts yet.</p>
          <p className="mt-1 text-sm">
            Add one after your first real interview — see the README for
            what makes a good profile.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-raised text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Profession</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {experts.map((e) => (
                <tr key={e.id} className="bg-paper-raised/50">
                  <td className="px-4 py-3 font-medium text-ink">{e.name}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {e.profession || "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {e.company || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/experts/${e.id}/edit`}
                        className="text-teal hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteExpertButton id={e.id} name={e.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
