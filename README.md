# CAMNE

**Camne nak...? Here's how.**

How to get things done in Malaysia — clear, practical, Malaysian-specific guides.

## Status: Phase 5 complete

Phases 1–4 (setup, PWA, Supabase, live categories/guides, full-text
search) plus Phase 5: expert profile pages at `/experts/[slug]` —
bio, credentials, photo (or an initial-letter fallback), and every
published guide they've contributed to. Guide pages already showed
expert attribution since Phase 3 (`ExpertAdvice`); Phase 5 makes the
expert's name a real link to their profile. No new migration was
needed — the `experts` and `guide_experts` tables and their RLS
policies were already set up in Phase 2.

**No experts are seeded.** CAMNE's expert content is meant to come from
real interviews, so this ships with a working, empty feature rather than
placeholder professional profiles — a fabricated "expert" is a much
worse look for a trust-driven product than an empty section. See "Adding
your first expert" below for the exact SQL once you've done a real
interview, or wait for the Phase 6 admin dashboard.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Serwist (PWA service worker / precaching)
- Supabase (Postgres, RLS, full-text search)

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
  SQL Editor. `0001` core schema, `0002` RLS, `0003` seed data, `0004`
  real content for the passport/SSM guides, `0005` full-text search.
- `lib/supabase/server.ts` — cookie-aware server client, for Server
  Components/Actions that need to know the signed-in user (`auth.uid()`).
  Not used yet — reserved for Phase 7 (bookmarks/auth).
- `lib/supabase/static.ts` — `createPublicClient()`, the client used by
  every current query (categories, guides, search). No cookies, no
  session — safe everywhere including `generateStaticParams` at build
  time. Every RLS policy these tables use only checks
  `status = 'published'` or `is_admin()`, never a specific user.
- `lib/supabase/admin.ts` — service-role client. **Server-only** (enforced
  by the `server-only` package) — bypasses RLS entirely. Reserved for the
  admin dashboard (Phase 6).
- `lib/supabase/database.types.ts` — hand-written types mirroring the
  schema. Note: every table needs a `Relationships: []` field even though
  we don't use embedded relation queries — `@supabase/postgrest-js`
  requires that shape structurally, and omitting it makes every query
  result silently type as `never` with no clear error.
- `lib/queries/categories.ts`, `lib/queries/guides.ts`,
  `lib/queries/search.ts`, `lib/queries/experts.ts` — typed query
  functions, wrapped in React's `cache()` where a page and its
  `generateMetadata` might both ask for the same data in one request.

## Adding your first expert

Once you've done a real interview, add them directly in the Supabase SQL
Editor:

```sql
insert into experts (slug, name, profession, company, bio, credentials)
values (
  'jane-tan',                                    -- URL: /experts/jane-tan
  'Jane Tan',
  'Property Lawyer',
  'Tan & Co',
  'A short bio — background, what they specialize in.',
  '["15 years in conveyancing", "Bar Council member"]'::jsonb
);

-- Then attach them to a guide:
insert into guide_experts (guide_id, expert_id, advice_text, interviewed_at)
select
  (select id from guides where slug = 'buy-my-first-house' and locale = 'en'),
  (select id from experts where slug = 'jane-tan'),
  'The actual quote or paraphrased advice from the interview.',
  '2026-08-17';
```

That's it — the guide page and the expert's profile page both pick it up
immediately, no code changes needed. Phase 6 will wrap this in an admin
UI so you're not hand-writing SQL for every expert.

## Search architecture

`search_guides(search_query, result_limit)` is a Postgres function (RPC),
not a raw table query from the frontend — that's a deliberate seam: when
semantic/AI search eventually gets added, the frontend keeps calling
`supabase.rpc("search_guides", {...})` unchanged, only the function's
internals change. Matching happens in three layers, in order:

1. Full-text search against a `GENERATED ALWAYS AS ... STORED` tsvector
   column (`title`/`overview`/`who_this_is_for`/`before_you_start`/
   `what_youll_need`/`common_mistakes`, weighted so title matches rank
   highest), always in sync with guide content — no reindex step.
2. A small hand-maintained Malay→English keyword bridge (`lib/queries/search.ts`)
   so common Malay search terms find English guide content before real
   Malay guides (`locale = 'ms'`) exist.
3. An ILIKE substring fallback for short/partial queries that full-text
   search's word-based matching misses (e.g. "pas" for "passport").

Every search — including zero-result ones — is logged to
`search_analytics` (query text + result count), fire-and-forget so a
logging failure never breaks the search page itself.

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Homepage — categories fetched live from Supabase
  search/             Search page — real Postgres full-text search
  categories/[slug]/  Category listing pages — live from Supabase
  guides/[slug]/      Full guide template — live from Supabase
  experts/[slug]/     Expert profile pages — live from Supabase
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
  data.ts             Curated homepage "popular searches" list
  supabase/           Supabase clients + database types (see above)
  queries/            Typed Supabase query functions: categories, guides, search, experts
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
