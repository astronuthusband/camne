import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// SERVICE ROLE CLIENT — bypasses Row Level Security entirely.
//
// The `import "server-only"` line above makes Next.js throw a build error
// if any client component ever imports this file, even indirectly. That's
// intentional: this client uses SUPABASE_SERVICE_ROLE_KEY, which must
// never reach the browser. Use this only in Route Handlers, Server
// Actions, or the admin dashboard's server-side code (Phase 6) — never in
// a "use client" component, and never pass its result to the client.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
