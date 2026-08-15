"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  placeholder = "Camne nak beli rumah?",
  autoFocus = false,
  defaultValue = "",
}: {
  placeholder?: string;
  autoFocus?: boolean;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <label htmlFor="camne-search" className="sr-only">
        Search CAMNE
      </label>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-paper-raised p-2 shadow-sm transition focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20 sm:rounded-full sm:p-2.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="ml-2 h-5 w-5 shrink-0 text-ink-soft"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="camne-search"
          type="text"
          inputMode="search"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-ink placeholder:text-ink-soft/60 focus:outline-none sm:text-lg"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-teal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-deep sm:rounded-full sm:px-6 sm:py-3"
        >
          Search
        </button>
      </div>
    </form>
  );
}
