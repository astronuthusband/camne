import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "@/app/admin/login/actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-paper-raised">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-display text-base font-semibold text-ink"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-sm text-gold">
                ?
              </span>
              CAMNE Admin
            </Link>
            <nav className="hidden items-center gap-4 text-sm font-medium text-ink-soft sm:flex">
              <Link href="/admin/guides" className="hover:text-teal">
                Guides
              </Link>
              <Link href="/admin/categories" className="hover:text-teal">
                Categories
              </Link>
              <Link href="/admin/experts" className="hover:text-teal">
                Experts
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <span className="hidden sm:inline">{admin.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-border px-3 py-1.5 hover:border-teal hover:text-teal"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav className="flex items-center gap-4 border-t border-border px-4 py-2 text-sm font-medium text-ink-soft sm:hidden">
          <Link href="/admin/guides" className="hover:text-teal">
            Guides
          </Link>
          <Link href="/admin/categories" className="hover:text-teal">
            Categories
          </Link>
          <Link href="/admin/experts" className="hover:text-teal">
            Experts
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
