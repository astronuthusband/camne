import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// The public-data client — no cookies, no user session. Use this for any
// query that doesn't need to know who's signed in: categories, published
// guides, steps, sources, experts. Every RLS policy those tables use
// (migration 0002) only checks `status = 'published'` or `is_admin()`,
// never `auth.uid() = <something>`, so there's nothing this client is
// missing out on for those reads.
//
// This also happens to be safe to call from generateStaticParams and
// during static rendering at build time, since it never touches
// Next.js's cookies() API — but that's a side effect of the real reason
// to use it, not the main one. Reserve lib/supabase/server.ts (the
// cookie-aware client) for Phase 7 onward, when bookmarks/feedback
// need to know the actual signed-in user.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
