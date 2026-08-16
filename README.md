# CAMNE

**Camne nak...? Here's how.**

How to get things done in Malaysia — clear, practical, Malaysian-specific guides.

## Status: Phase 3 complete

Phases 1–2 (project setup, PWA shell, design system, Supabase schema/RLS)
plus Phase 3: categories, guide listings, and guide detail pages now read
live from Supabase — `lib/data.ts` no longer backs them. Two guides
(`renew-malaysian-passport`, `register-ssm`) have full real content
(overview, steps, sources, common mistakes) as worked examples of the
complete template; the other 8 V1 guides are still shells and render
correctly with just their title/cost/time until content is added.
Search still runs against the placeholder list in `lib/data.ts` — that's
Phase 4.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Serwist (PWA service worker / precaching)
- Supabase (Postgres, RLS, live-queried by categories/guides pages)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase credentials
npm run dev
```

Open http://localhost:3000. Visit http://localhost:3000/api/health to
confirm the Supabase connection is working.

Note: `dev` and `build` both run with `--webpack` (not Turbopack). Serwist's
service worker bundling doesn't yet support Turbopack — see `next.config.ts`
for details. Don't remove the `--webpack` flag.

## Database

- `supabase/migrations/` — SQL migrations, run in order via the Supabase
  SQL Editor. `0001` creates all tables, `0002` enables Row Level Security,
  `0003` seeds categories and the 10 V1 guides (as shells), `0004` fills in
  real content for the passport and SSM guides.
- `lib/supabase/server.ts` — cookie-aware server client, for Server
  Components/Actions that need to know the signed-in user (`auth.uid()`).
  Not used yet — reserved for Phase 7 (bookmarks/auth).
- `lib/supabase/static.ts` — `createPublicClient()`, the client actually
  used by every current query (categories, guides, steps, sources,
  experts). No cookies, no session — safe everywhere including
  `generateStaticParams` at build time. Every RLS policy those tables use
  only checks `status = 'published'` or `is_admin()`, never a specific
  user, so there's nothing this client is missing out on for now.
- `lib/supabase/admin.ts` — service-role client. **Server-only** (enforced
  by the `server-only` package) — bypasses RLS entirely. Reserved for the
  admin dashboard (Phase 6).
- `lib/supabase/database.types.ts` — hand-written types mirroring the
  schema. Note: every table needs a `Relationships: []` field even though
  we don't use embedded relation queries — `@supabase/postgrest-js`
  requires that shape structurally, and omitting it makes every query
  result silently type as `never` with no clear error.
- `lib/queries/categories.ts`, `lib/queries/guides.ts` — typed query
  functions, wrapped in React's `cache()` so a page and its
  `generateMetadata` calling for the same data only hit Supabase once.

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Homepage — categories fetched live from Supabase
  search/             Search page (still placeholder data — Phase 4)
  categories/[slug]/  Category listing pages — live from Supabase
  guides/[slug]/      Full guide template — live from Supabase
  api/health/         Supabase connection check (temporary, Phase 2)
  manifest.ts         PWA web app manifest
  sw.ts               Service worker source (compiled by Serwist into public/sw.js)
components/
  layout/             Navbar, Footer
  home/               Hero, PopularSearches, CategoryGrid
  search/             SearchBar, SearchResults
  guide/              GuideCard, StepList, SourcesList, SourceTypeBadge,
                       CommonMistakes, ExpertAdvice
  ui/                 CategoryIcon, CustomCursor, Breadcrumbs
  pwa/                InstallPrompt
lib/
  types.ts            Types for content this app curates itself (not DB-backed)
  data.ts             Curated homepage "popular searches" + search placeholder data
  supabase/           Supabase clients + database types (see above)
  queries/            Typed Supabase query functions for categories/guides
supabase/migrations/  SQL migrations, source of truth for the schema and content
public/icons/         PWA icon set (placeholder mark — swap once visual identity is final)
```

## Design tokens

All color/font tokens live in `app/globals.css` under `:root` and are exposed
to Tailwind via `@theme inline`. See that file for the full palette — this is
a first pass, open to revision once you've seen it live.

## PWA notes

- Manifest: `app/manifest.ts` (served at `/manifest.webmanifest`)
- Service worker: `app/sw.ts` compiled to `public/sw.js` on every build (not committed to Git, see `.gitignore`)
- Disabled in local dev (`next.config.ts`) so hot-reload isn't fighting a stale cache. Test PWA behavior with `npm run build && npm run start`, or on a Vercel preview deploy.
