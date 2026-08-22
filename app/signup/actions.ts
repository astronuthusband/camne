"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export async function signUp(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "") || "/";

  if (!email || !password) {
    return { error: "Enter both email and password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // No query string here on purpose — Supabase's Redirect URLs
      // allowlist does exact matching, and a URL with a query string
      // appended won't match a plain allowlist entry, causing Supabase
      // to silently fall back to the bare Site URL instead of erroring.
      // That's a real bug this project hit with the password-reset flow
      // (see app/forgot-password/actions.ts) — this keeps signup from
      // having the same latent problem for anyone who signs up with a
      // non-default returnTo. Cost: after confirming their email, they
      // land on the homepage rather than back where they started —
      // a minor UX trade for not silently breaking.
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    // Supabase returns a generic-looking error for "email already
    // registered" in some configurations to avoid leaking which emails
    // exist — but its message text is still the clearest signal we have.
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  // If email confirmation is required (the Supabase default), signUp()
  // succeeds but returns no session — the account exists but can't sign
  // in yet. Route them to login with a message instead of pretending
  // they're in.
  if (!data.session) {
    redirect(`/login?message=check-email${returnTo !== "/" ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`);
  }

  redirect(returnTo);
}