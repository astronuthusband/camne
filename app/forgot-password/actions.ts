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
    // Reuses the same callback route as email confirmation — it just
    // exchanges the code for a session either way. `next` sends them on
    // to the actual "set a new password" form afterward.
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
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
