# CAMNE

**Camne nak...? Here's how.**

How to get things done in Malaysia — clear, practical, Malaysian-specific guides.

## Status: Phase 2 complete

Phase 1 (project setup, PWA shell, design system, homepage, nav, search UI,
categories) plus Phase 2 (Supabase schema, Row Level Security, seed data,
and the app's database connection code). Guide pages still render the
Phase 1 stub template — Phase 3 replaces `lib/data.ts` with real Supabase
queries and builds out the full guide content template.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Serwist (PWA service worker / precaching)
- Supabase (Postgres, RLS, Auth — schema is live; app isn't querying it yet, that's Phase 3)

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
  `0003` seeds categories and the 10 V1 guides (as shells — full content
  comes in Phase 3).
- `lib/supabase/client.ts` — browser client, for `"use client"` components.
- `lib/supabase/server.ts` — server client, for Server Components/Actions.
  Respects RLS and the signed-in user's session.
- `lib/supabase/admin.ts` — service-role client. **Server-only** (enforced
  by the `server-only` package) — bypasses RLS entirely, never expose to
  the browser. Reserved for the admin dashboard (Phase 6).
- `lib/supabase/database.types.ts` — hand-written types mirroring the
  schema. Update this alongside any future migration, or regenerate with
  the Supabase CLI once you have it installed.

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Homepage
  search/             Search page
  categories/[slug]/  Category listing pages
  guides/[slug]/      Guide detail pages (Phase 1 stub — full template in Phase 3)
  api/health/         Supabase connection check (temporary, Phase 2)
  manifest.ts         PWA web app manifest
  sw.ts               Service worker source (compiled by Serwist into public/sw.js)
components/
  layout/             Navbar, Footer
  home/               Hero, PopularSearches, CategoryGrid
  search/             SearchBar, SearchResults
  guide/              GuideCard
  ui/                 CategoryIcon, CustomCursor
  pwa/                InstallPrompt
lib/
  types.ts            Shared TypeScript types (mirror the Phase 0 DB schema)
  data.ts             Placeholder content — replaced by Supabase queries in Phase 3
  supabase/           Supabase clients + database types (see above)
supabase/migrations/  SQL migrations, source of truth for the schema
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
