"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, {
    error: null,
  });

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper-raised p-6">
        <p className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-sm text-gold">
            ?
          </span>
          CAMNE Admin
        </p>
        <p className="mb-6 text-sm text-ink-soft">
          Sign in to manage guides, categories, and experts.
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-teal py-2.5 text-sm font-medium text-white transition hover:bg-teal-deep disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
