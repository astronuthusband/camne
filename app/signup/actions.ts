"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  const { data, error } = await supabase.auth.signUp({ email, password });

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
