import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase's email confirmation link (and any future magic-link /
// OAuth flow) redirects here with a `code` query param. This route's
// only job is to exchange that code for a real session — setting the
// auth cookies — then send the person on to wherever they should land.
// Without this route, the confirmation link has nowhere correct to go:
// Supabase falls back to redirecting to the bare Site URL with an
// unhandled `?code=`, which is exactly the broken behavior this fixes.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=confirmation-failed`
  );
}