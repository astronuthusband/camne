import Link from "next/link";
import { getAdminDashboardCounts } from "@/lib/admin/queries";

export default async function AdminHomePage() {
  const counts = await getAdminDashboardCounts();

  const cards = [
    {
      label: "Published guides",
      value: counts.publishedGuides,
      href: "/admin/guides",
    },
    { label: "Draft guides", value: counts.draftGuides, href: "/admin/guides" },
    { label: "Categories", value: counts.categories, href: "/admin/categories" },
    { label: "Experts", value: counts.experts, href: "/admin/experts" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Dashboard
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-border bg-paper-raised p-5 transition hover:border-teal"
          >
            <p className="font-mono text-3xl font-semibold text-ink">
              {c.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/guides/new"
          className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
        >
          + New guide
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink hover:border-teal"
        >
          Manage categories
        </Link>
        <Link
          href="/admin/experts/new"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink hover:border-teal"
        >
          + New expert
        </Link>
      </div>
    </div>
  );
}
