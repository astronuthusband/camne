import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-paper-raised">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-soft sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-ink">CAMNE</p>
            <p className="mt-1 max-w-xs">
              How to get things done in Malaysia — clear, practical, and
              regularly verified.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 sm:flex sm:gap-10">
            <Link href="/categories/government" className="hover:text-teal">
              Government
            </Link>
            <Link href="/categories/business" className="hover:text-teal">
              Business
            </Link>
            <Link href="/categories/property" className="hover:text-teal">
              Property
            </Link>
            <Link href="/search" className="hover:text-teal">
              Search
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-6 text-xs text-ink-soft/80">
          CAMNE provides general information and does not replace
          professional legal, financial, or tax advice. Always verify
          time-sensitive requirements with the official source linked on
          each guide.
        </p>
        <p className="mt-3 text-xs text-ink-soft/60">
          © {new Date().getFullYear()} CAMNE.
        </p>
      </div>
    </footer>
  );
}
