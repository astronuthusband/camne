import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only /admin needs a fresh session on every request — every other
  // route reads public data through the anon client and doesn't care
  // who's logged in, so there's no reason to pay the cookie-refresh
  // cost on every homepage/guide/search request.
  matcher: ["/admin/:path*"],
};
