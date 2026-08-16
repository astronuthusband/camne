-- CAMNE — Migration 0001: Core schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).
--
-- Design notes on the three Phase 0 adjustments you asked for:
--
-- 1. sources.source_type — a plain check-constrained text column
--    ('official' | 'expert' | 'reference'), so the UI can visually
--    distinguish source types without guessing from the label text.
--
-- 2. guides.featured_image_url — for future guide cards, Open Graph
--    previews, and social sharing.
--
-- 3. Bilingual-ready content — guides carry `locale` and
--    `translation_group_id`. A Malay version of a guide is a *separate
--    row* with the same translation_group_id and locale = 'ms'. This
--    keeps guide_steps/sources/guide_experts joins simple (they still
--    just join on guide_id), avoids a maze of per-field translation
--    tables, and means adding Malay later is an INSERT, not a schema
--    change. `categories` stays untranslated for now (8 fixed rows,
--    English only) — adding a `category_translations` table later is
--    an additive migration, not a rebuild, so this doesn't box us in.

create extension if not exists pgcrypto;

-- Shared helper: keep `updated_at` current on every row update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────────────────────────────────
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.categories is
  'Fixed set of top-level sections (Government, Business, Property, ...). English only for now — see migration header note.';

-- ─────────────────────────────────────────────────────────────────────────
-- guides
-- ─────────────────────────────────────────────────────────────────────────
create table public.guides (
  id uuid primary key default gen_random_uuid(),
  translation_group_id uuid not null default gen_random_uuid(),
  locale text not null default 'en' check (locale in ('en', 'ms')),
  slug text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  overview text,
  who_this_is_for text,
  before_you_start text,
  what_youll_need jsonb not null default '[]'::jsonb,
  estimated_cost_text text,
  estimated_time_text text,
  common_mistakes jsonb not null default '[]'::jsonb,
  featured_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  last_verified_at date,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (translation_group_id, locale),
  unique (slug, locale)
);

comment on table public.guides is
  'One row per guide per language. Rows sharing translation_group_id are the same guide in different locales.';
comment on column public.guides.what_youll_need is
  'JSON array of strings, e.g. ["IC", "RM200 in cash"].';
comment on column public.guides.common_mistakes is
  'JSON array of strings.';

create index guides_category_id_idx on public.guides(category_id);
create index guides_status_idx on public.guides(status);
create index guides_locale_idx on public.guides(locale);

create trigger guides_set_updated_at
  before update on public.guides
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- guide_steps
-- ─────────────────────────────────────────────────────────────────────────
create table public.guide_steps (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  step_number int not null,
  title text not null,
  content text not null,
  sort_order int not null default 0
);

create index guide_steps_guide_id_idx on public.guide_steps(guide_id);

-- ─────────────────────────────────────────────────────────────────────────
-- sources
-- ─────────────────────────────────────────────────────────────────────────
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  source_type text not null default 'reference'
    check (source_type in ('official', 'expert', 'reference')),
  label text not null,
  url text not null,
  sort_order int not null default 0
);

comment on column public.sources.source_type is
  'official = government/authoritative link, expert = attributed to a named professional, reference = general supporting link.';

create index sources_guide_id_idx on public.sources(guide_id);

-- ─────────────────────────────────────────────────────────────────────────
-- experts
-- ─────────────────────────────────────────────────────────────────────────
create table public.experts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  photo_url text,
  profession text,
  company text,
  bio text,
  credentials jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- guide_experts (join table)
-- ─────────────────────────────────────────────────────────────────────────
create table public.guide_experts (
  guide_id uuid not null references public.guides(id) on delete cascade,
  expert_id uuid not null references public.experts(id) on delete cascade,
  advice_text text,
  interviewed_at date,
  primary key (guide_id, expert_id)
);

-- ─────────────────────────────────────────────────────────────────────────
-- guide_tags
-- ─────────────────────────────────────────────────────────────────────────
create table public.guide_tags (
  guide_id uuid not null references public.guides(id) on delete cascade,
  tag text not null,
  primary key (guide_id, tag)
);

-- ─────────────────────────────────────────────────────────────────────────
-- users (profile row, one-to-one with auth.users — populated by trigger
-- in migration 0002 once Supabase Auth is in use, from Phase 7 onward)
-- ─────────────────────────────────────────────────────────────────────────
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- bookmarks
-- ─────────────────────────────────────────────────────────────────────────
create table public.bookmarks (
  user_id uuid not null references public.users(id) on delete cascade,
  guide_id uuid not null references public.guides(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, guide_id)
);

-- ─────────────────────────────────────────────────────────────────────────
-- feedback
-- ─────────────────────────────────────────────────────────────────────────
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  helpful boolean not null,
  comment text,
  created_at timestamptz not null default now()
);

create index feedback_guide_id_idx on public.feedback(guide_id);

-- ─────────────────────────────────────────────────────────────────────────
-- search_analytics
-- ─────────────────────────────────────────────────────────────────────────
create table public.search_analytics (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  result_count int not null default 0,
  clicked_guide_id uuid references public.guides(id) on delete set null,
  created_at timestamptz not null default now()
);
