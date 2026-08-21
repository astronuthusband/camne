# CAMNE

**Camne nak...? Here's how.**

How to get things done in Malaysia — clear, practical, Malaysian-specific guides.

## Status: Phase 8 complete (code side)

Phases 1–7 (setup through public accounts) plus Phase 8's code pieces:
a dynamic `sitemap.xml`, `robots.txt`, and a proper site-URL resolution
(`lib/site-url.ts`) that auto-detects your Vercel deployment URL with
zero configuration, replacing the hardcoded placeholder domain from
Phase 1. Also fixed a real gap while doing this production-readiness
pass: deleting an expert or category didn't revalidate every public
page that referenced them, meaning a deleted expert could keep showing
on the live site until the next full redeploy.

The rest of Phase 8 — actually deploying to Vercel, connecting Supabase
in production, running Lighthouse, testing the installed PWA on a real
phone — happens in your accounts, not in this codebase. See the
deployment walkthrough for that.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Serwist (PWA service worker / precaching)
- Supabase (Postgres, RLS, Auth, full-text search)

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

## Setting up your admin account

There's deliberately no public sign-up form for `/admin` — only you
should ever have credentials. Two manual steps, once:

1. **Supabase Dashboard → Authentication → Users → Add user.** Set your
   email and a real password directly (no confirmation email needed for
   this). This automatically creates a matching row in `public.users`
   with `role = 'user'` (that's the `on_auth_user_created` trigger from
   Phase 2 doing its job).
2. **Promote yourself to admin** — SQL Editor:
   ```sql
   update public.users set role = 'admin' where email = 'you@example.com';
   ```

Now sign in at `/admin/login`. Every admin server action independently
re-checks `role = 'admin'` (via `lib/admin/auth.ts`'s `requireAdmin()`),
not just the page layout — so even a bug that let someone reach an admin
page without the layout's check would still have every mutation blocked
by that second check, and by RLS itself as a third layer underneath both.

## Public accounts architecture

The one decision worth understanding here: guide and category pages are
statically generated (see the build output — they show `●`, not `ƒ`).
Checking "is someone logged in" the normal server-side way (reading
`cookies()`) would force every page that does it into dynamic rendering
— and since the root layout wraps every page, putting that check there
would silently lose static generation site-wide.

So the auth-aware pieces are deliberately client components instead:

- `components/layout/AuthNav.tsx` — checks the session client-side after
  the page has already loaded (via `lib/supabase/client.ts`, the browser
  client that sat unused until now), and subscribes to auth state changes
  so login/logout update it without a page reload. There's a brief
  instant where it shows nothing while it figures out the real state —
  same trade-off most static sites make for this.
- `components/guide/BookmarkButton.tsx` — same pattern, plus it writes
  directly to the `bookmarks` table from the browser. That's safe:
  Phase 2's RLS policies (`auth.uid() = user_id`) are what actually
  protect the data, not which layer of the app happens to call Supabase.
- `/bookmarks` itself is the one new page that's genuinely dynamic on
  purpose — its whole job is showing one specific signed-in user's data,
  so per-request rendering with the real cookie-based server client is
  the correct call there, not a compromise.
- `components/guide/FeedbackWidget.tsx` calls a plain Server Action
  (`lib/actions/feedback.ts`) directly — no form, so the two-step
  thumbs-then-optional-comment flow can be controlled with React state,
  same pattern as the admin guide editor's save button.

## SEO & deployment

- `app/sitemap.ts` / `app/robots.ts` — Next.js's native dynamic sitemap
  and robots.txt support. The sitemap pulls live from Supabase (all
  categories, published guides with real `lastmod` dates, experts) — it
  updates itself, nothing to maintain by hand.
- `lib/site-url.ts` — see the comments in that file. Auto-detects your
  Vercel URL with zero config; set `NEXT_PUBLIC_SITE_URL` once you have
  a stable production URL to take manual control.
- `/admin` and `/api/` are excluded from the sitemap and disallowed in
  robots.txt — not a security measure (that's `requireAdmin()` + RLS),
  just no reason to invite crawlers there.

## Admin architecture

- `proxy.ts` (Next 16 renamed this from the old `middleware.ts`
  convention) refreshes the auth session cookie on every `/admin/*`
  request, so it doesn't silently expire mid-session.
- `lib/admin/auth.ts` — `requireAdmin()`, the real gate. Redirects to
  login if there's no session, or if the session isn't `role = 'admin'`.
- `lib/admin/queries.ts` — admin-only read queries, all using
  `lib/supabase/server.ts` (cookie-aware, RLS-respecting), **not**
  `lib/supabase/static.ts`'s public client — the public client is anon
  and would silently hide every draft guide behind the "published only"
  RLS policy.
- `app/admin/(dashboard)/*/actions.ts` — Server Actions for every
  mutation. All use the same cookie-aware client, meaning writes only
  succeed because the signed-in admin's session satisfies RLS's
  `is_admin()` check — not because anything bypasses RLS. The
  service-role client (`lib/supabase/admin.ts`) is still unused by
  design: least-privilege beats convenience here.
- The guide editor (`app/admin/(dashboard)/guides/[id]/edit/GuideEditor.tsx`)
  holds steps/sources/what-you'll-need/common-mistakes as local React
  state and saves everything in one call to `saveGuide()`, which
  replaces the guide's steps and sources with a delete-then-insert —
  same pattern the SQL migrations use, simplest way to handle
  add/remove/reorder without diffing individual rows.

## Adding your first expert

Once you've done a real interview, the easiest path is now
`/admin/experts/new`. If you ever need to do it directly in SQL (e.g.
bulk-importing several at once):

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
immediately, no code changes needed. (This is exactly what `/admin/guides/[id]/edit`'s
expert attribution section does for you now, via a form instead of SQL.)

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
  admin/              Secured admin dashboard (see below)
  login/              Public sign-in (separate from /admin/login)
  signup/             Public account creation
  bookmarks/          Signed-in user's saved guides (dynamic, not SSG)
  api/health/         Supabase connection check (temporary, Phase 2)
  manifest.ts         PWA web app manifest
  sw.ts               Service worker source (compiled by Serwist into public/sw.js)
components/
  layout/             Navbar, Footer, AuthNav (client-side auth state)
  home/               Hero, PopularSearches, CategoryGrid
  search/             SearchBar, SearchResults
  guide/              GuideCard, StepList, SourcesList, SourceTypeBadge,
                       CommonMistakes, ExpertAdvice, BookmarkButton,
                       FeedbackWidget
  ui/                 CategoryIcon, CustomCursor, Breadcrumbs
  pwa/                InstallPrompt
lib/
  types.ts            Types for content this app curates itself (not DB-backed)
  data.ts             Curated homepage "popular searches" list
  supabase/           Supabase clients + database types (see above)
  queries/            Typed Supabase query functions: categories, guides, search, experts
  admin/               requireAdmin() gate + admin-only read queries
  actions/            Server Actions not tied to admin (feedback.ts)
supabase/migrations/  SQL migrations, source of truth for the schema and content
public/icons/         PWA icon set (placeholder mark — swap once visual identity is final)
proxy.ts               Session-refresh proxy (formerly middleware.ts) for /admin/*
```

## Design tokens

All color/font tokens live in `app/globals.css` under `:root` and are exposed
to Tailwind via `@theme inline`. See that file for the full palette — this is
a first pass, open to revision once you've seen it live.

## PWA notes

- Manifest: `app/manifest.ts` (served at `/manifest.webmanifest`)
- Service worker: `app/sw.ts` compiled to `public/sw.js` on every build (not committed to Git, see `.gitignore`)
- Disabled in local dev (`next.config.ts`) so hot-reload isn't fighting a stale cache. Test PWA behavior with `npm run build && npm run start`, or on a Vercel preview deploy.
