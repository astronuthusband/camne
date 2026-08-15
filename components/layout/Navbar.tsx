import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal font-display text-base text-gold">
            ?
          </span>
          CAMNE
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft sm:flex">
          <Link href="/categories/government" className="hover:text-teal">
            Government
          </Link>
          <Link href="/categories/business" className="hover:text-teal">
            Business
          </Link>
          <Link href="/categories/property" className="hover:text-teal">
            Property
          </Link>
          <Link href="/categories/money" className="hover:text-teal">
            Money
          </Link>
        </nav>

        <Link
          href="/search"
          className="rounded-full border border-border bg-paper-raised px-4 py-2 text-sm font-medium text-ink transition hover:border-teal hover:text-teal sm:hidden"
          aria-label="Search"
        >
          Search
        </Link>
        <Link
          href="/search"
          className="hidden rounded-full bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-deep sm:block"
        >
          Search
        </Link>
      </div>
    </header>
  );
}
