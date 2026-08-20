import Link from "next/link";
import type { ReactNode } from "react";

// authSlot is rendered here but instantiated in app/layout.tsx, not
// imported directly by this file. Both work in React/Next's model, but
// this composition pattern (Server Component receives a Client
// Component as a prop, rather than importing and rendering one nested
// inside itself) is the officially recommended approach for mixing
// Server/Client Components — and empirically, it's the pattern that
// works reliably here.
export function Navbar({ authSlot }: { authSlot: ReactNode }) {
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

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">{authSlot}</div>
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
      </div>
      <div className="flex items-center justify-center border-t border-border/70 py-2 sm:hidden">
        {authSlot}
      </div>
    </header>
  );
}