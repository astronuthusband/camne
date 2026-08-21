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
      // Without this, Supabase's confirmation email links to the bare
      // Site URL with a `?code=` param and nothing to handle it — see
      // app/auth/callback/route.ts, which is what this actually points
      // to. getSiteUrl() (lib/site-url.ts) resolves to the real
      // deployed URL automatically, not whatever localhost happened to
      // be running when this was written.
      emailRedirectTo: `${getSiteUrl()}/auth/callback${
        returnTo !== "/" ? `?next=${encodeURIComponent(returnTo)}` : ""
      }`,
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