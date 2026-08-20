"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [state, formAction, pending] = useActionState(signIn, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
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
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
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
  );
}
