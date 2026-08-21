// Resolves the site's canonical base URL, in priority order:
//
// 1. NEXT_PUBLIC_SITE_URL — set this explicitly once you have a stable
//    production URL (a custom domain, or even just a Vercel URL you've
//    committed to). Takes priority over everything else.
// 2. VERCEL_URL — automatically provided by Vercel on every deployment,
//    zero configuration needed. This means the very first deploy (before
//    you've set anything, back when you don't yet know what URL Vercel
//    will assign) already gets a correct sitemap, robots.txt, and Open
//    Graph tags with no chicken-and-egg problem.
// 3. localhost — local development fallback.
//
// Server-side only (VERCEL_URL isn't NEXT_PUBLIC_-prefixed, so it's not
// exposed to the browser) — that's fine, every place this is used
// (sitemap.ts, robots.ts, layout.tsx metadata) is server-only.
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
