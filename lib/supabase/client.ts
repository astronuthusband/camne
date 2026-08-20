import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Use this in "use client" components. Safe to call on every render —
// createBrowserClient reuses the same underlying client internally.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}