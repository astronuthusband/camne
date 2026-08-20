import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper-raised p-6">
        <p className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-sm text-gold">
            ?
          </span>
          Create your account
        </p>
        <p className="mb-6 text-sm text-ink-soft">
          Save guides and leave feedback on the ones that helped.
        </p>

        <SignupForm returnTo={returnTo} />

        <p className="mt-4 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link
            href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"}
            className="text-teal hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
