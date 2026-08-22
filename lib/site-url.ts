// Resolves the site's canonical base URL, in priority order:
//
// 1. NEXT_PUBLIC_SITE_URL — set this explicitly once you have a stable
//    production URL (a custom domain, or even just a Vercel URL you've
//    committed to). Takes priority over everything else.
// 2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain
//    (their docs: "always set, even in preview deployments... useful to
//    reliably generate links that point to production"). Zero
//    configuration needed.
// 3. localhost — local development fallback.
//
// IMPORTANT: this deliberately does NOT fall back to VERCEL_URL.
// VERCEL_URL is the URL of the SPECIFIC deployment that's currently
// running — it includes a random per-deployment hash
// (camne-xyz123-yourteam.vercel.app) and changes on every single
// deploy. Using it here was a real bug: Supabase's password-reset and
// email-confirmation redirects need a URL that matches an entry in
// Supabase's Redirect URLs allowlist, and an allowlist entry can't be
// kept in sync with a URL that changes on every deploy. That mismatch
// caused Supabase to silently fall back to the bare Site URL instead of
// routing through /reset-password — see the git history on this file
// for the full debugging story.
//
// Server-side only (neither Vercel var is NEXT_PUBLIC_-prefixed, so
// neither is exposed to the browser) — that's fine, every place this is
// used (sitemap.ts, robots.ts, layout.tsx metadata, the auth actions)
// is server-only.
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}