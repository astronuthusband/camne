"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Deliberately a client component, not a server-side auth check in the
// shared layout — reading the session server-side (via cookies()) would
// force every single page through this layout to render dynamically,
// including the guide/category pages we specifically built to be
// statically generated. A brief "signed out" flash before this hydrates
// is the trade-off, and it's the same one most static sites make for
// exactly this kind of auth-aware nav widget.
export function AuthNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  // Still loading — reserve the space without flashing either state.
  if (email === undefined) {
    return <span className="h-8 w-16" aria-hidden="true" />;
  }

  if (!email) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-ink-soft hover:text-teal"
      >
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm font-medium">
      <Link href="/bookmarks" className="text-ink-soft hover:text-teal">
        Bookmarks
      </Link>
      <button
        onClick={handleSignOut}
        className="text-ink-soft hover:text-teal"
      >
        Log out
      </button>
    </div>
  );
}