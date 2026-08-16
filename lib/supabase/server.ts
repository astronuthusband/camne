import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

// Use this in Server Components, Server Actions, and Route Handlers.
// Reads/writes the user's auth cookies, so RLS policies that check
// auth.uid() work correctly for logged-in users (relevant from Phase 7
// onward). For anonymous public reads (categories, published guides),
// this still respects the "public read" policies from migration 0002.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies
            // (e.g. during static rendering) — safe to ignore as long
            // as middleware is refreshing the session, which we'll add
            // when Phase 7 introduces auth.
          }
        },
      },
    }
  );
}
