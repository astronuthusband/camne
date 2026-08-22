import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const supabase = await createClient();

  // Supabase's PKCE recovery flow lands here with a `code` param —
  // exchange it for a session before checking who's signed in. This
  // page used to rely on /auth/callback doing this first, but that
  // required a query string on the redirectTo URL that Supabase's
  // allowlist matching didn't accept — see the comment in
  // app/forgot-password/actions.ts for the full story.
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Reached without a valid code or an existing recovery session —
  // nothing to update.
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-ink">
          This link has expired
        </h1>
        <p className="mt-2 text-ink-soft">
          Password reset links only work once and expire after a while.
          Request a new one below.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block rounded-full bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-deep"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper-raised p-6">
        <p className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-sm text-gold">
            ?
          </span>
          Set a new password
        </p>
        <p className="mb-6 text-sm text-ink-soft">
          Signed in as {user.email}.
        </p>

        <ResetPasswordForm />
      </div>
    </div>
  );
}