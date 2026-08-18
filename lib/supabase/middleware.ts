import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

// Standard Supabase SSR middleware pattern: refreshes the auth session
// cookie on every request so it doesn't silently expire mid-visit, and
// hands back a response with the refreshed cookies attached. This does
// NOT check who the user is or whether they're an admin — that's
// deliberately left to app/admin/layout.tsx, which can do a real
// database check (role = 'admin'), something middleware shouldn't be
// doing on every single request for cost/latency reasons.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Required even though we don't use the result here — this is what
  // actually triggers the token refresh against Supabase Auth.
  await supabase.auth.getUser();

  return response;
}
