import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; message?: string }>;
}) {
  const { returnTo, message } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper-raised p-6">
        <p className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-sm text-gold">
            ?
          </span>
          Sign in to CAMNE
        </p>
        <p className="mb-6 text-sm text-ink-soft">
          Save guides and leave feedback on the ones that helped.
        </p>

        {message === "check-email" && (
          <p className="mb-4 rounded-lg bg-teal-soft px-3 py-2 text-sm text-teal-deep">
            Almost there — check your email to confirm your account, then
            sign in below.
          </p>
        )}

        <LoginForm returnTo={returnTo} />

        <p className="mt-4 text-center text-sm text-ink-soft">
          New to CAMNE?{" "}
          <Link
            href={returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup"}
            className="text-teal hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
