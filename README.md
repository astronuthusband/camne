# CAMNE

**Camne nak...? Here's how.**

How to get things done in Malaysia — clear, practical, Malaysian-specific guides.

## Status: Phase 1 complete

This is the Phase 1 build: project setup, PWA shell, design system, homepage,
navigation, search UI, categories, responsive layout, and the desktop custom
cursor. All guide/category content on this branch is **placeholder data** in
`lib/data.ts` — Phase 2 replaces it with real Supabase queries.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Serwist (PWA service worker / precaching)
- Supabase (Postgres, arriving in Phase 2)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Note: `dev` and `build` both run with `--webpack` (not Turbopack). Serwist's
service worker bundling doesn't yet support Turbopack — see `next.config.ts`
for details. Don't remove the `--webpack` flag.

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Homepage
  search/             Search page
  categories/[slug]/  Category listing pages
  guides/[slug]/      Guide detail pages (Phase 1 stub — full template in Phase 3)
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
  data.ts             Placeholder content — replaced by Supabase queries in Phase 2
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
