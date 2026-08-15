import { SearchBar } from "@/components/search/SearchBar";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-14 pb-10 text-center sm:pt-20 sm:pb-14">
      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-ink-soft">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        Here&apos;s how.
      </p>
      <h1 className="text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
        Camne nak&nbsp;<span className="text-teal">...?</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-balance text-base text-ink-soft sm:text-lg">
        Tell CAMNE what you&apos;re trying to get done in Malaysia. We&apos;ll
        show you exactly how — no guessing which office to call.
      </p>
      <div className="mt-8">
        <SearchBar />
      </div>
    </section>
  );
}
