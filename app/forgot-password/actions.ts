"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export async function requestPasswordReset(
  _prevState: { error: string | null; sent: boolean },
  formData: FormData
): Promise<{ error: string | null; sent: boolean }> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Enter your email.", sent: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Straight to /reset-password, no query string — Supabase's
    // Redirect URLs allowlist does exact matching, and a URL with
    // ?next=... appended won't match a plain allowlist entry. That
    // mismatch causes Supabase to silently fall back to the bare Site
    // URL instead of erroring, which is exactly what was happening
    // before this fix. /reset-password now handles the code exchange
    // itself (see that page), so there's no need to round-trip through
    // /auth/callback here at all.
    redirectTo: `${getSiteUrl()}/reset-password`,
  });

  // Deliberately show the same "check your email" message whether or
  // not the address is actually registered — confirming/denying an
  // email's existence here is a minor but real information leak
  // (lets someone probe which emails have accounts).
  if (error) {
    return {
      error: "Something went wrong. Please try again in a moment.",
      sent: false,
    };
  }

  return { error: null, sent: true };
}