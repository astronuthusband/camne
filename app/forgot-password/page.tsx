import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper-raised p-6">
        <p className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-sm text-gold">
            ?
          </span>
          Reset your password
        </p>
        <p className="mb-6 text-sm text-ink-soft">
          Enter your email and we&apos;ll send you a link to set a new
          password.
        </p>

        <ForgotPasswordForm />

        <p className="mt-4 text-center text-sm text-ink-soft">
          <Link href="/login" className="text-teal hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
