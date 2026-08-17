-- CAMNE — Migration 0005: Search
-- Run this after 0004_guide_content_passport_ssm.sql.
--
-- Adds Postgres full-text search to guides, exposed through a single RPC
-- function (search_guides) rather than a raw .textSearch() call from the
-- frontend. That's a deliberate seam: when semantic/AI search eventually
-- gets added, the frontend keeps calling supabase.rpc("search_guides",
-- {...}) unchanged — only this function's internals need to change.
--
-- search_vector is a GENERATED column, so it's always in sync with the
-- guide's actual content — no separate "reindex" step to remember to run.
-- Generated columns can't reference other tables or use subqueries, so
-- guide_tags isn't included here; title/overview/who/before-you-start/
-- what-you'll-need/common-mistakes covers everything meaningful for now.
--
-- NOTE ON LOCALE: to_tsvector('english', ...) is hardcoded because every
-- guide is currently locale = 'en'. When Malay guides are added (using
-- the translation_group_id pattern from migration 0001), a Malay row's
-- search_vector should use to_tsvector('simple', ...) instead (Postgres
-- doesn't ship a Malay text search dictionary) — that'll need this
-- generated column to become locale-aware, which is exactly the kind of
-- change the guides.locale column was added in Phase 2 to make possible
-- without restructuring anything else.

alter table public.guides
  add column search_vector tsvector
  generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(overview, '') || ' ' ||
      coalesce(who_this_is_for, '') || ' ' ||
      coalesce(before_you_start, '') || ' ' ||
      coalesce(what_youll_need::text, '') || ' ' ||
      coalesce(common_mistakes::text, '')
    )
  ) stored;

create index guides_search_vector_idx on public.guides using gin (search_vector);

-- Runs with the caller's own privileges (no security definer) — RLS on
-- guides/categories still applies, and the explicit status = 'published'
-- filter below is a second, redundant layer of the same rule. Belt and
-- braces costs nothing here.
create or replace function public.search_guides(search_query text, result_limit int default 20)
returns table (
  slug text,
  title text,
  estimated_cost_text text,
  estimated_time_text text,
  category_slug text,
  category_name text,
  rank real
)
language sql
stable
as $$
  select
    g.slug,
    g.title,
    g.estimated_cost_text,
    g.estimated_time_text,
    c.slug as category_slug,
    c.name as category_name,
    ts_rank(g.search_vector, websearch_to_tsquery('english', search_query)) as rank
  from public.guides g
  join public.categories c on c.id = g.category_id
  where g.status = 'published'
    and g.search_vector @@ websearch_to_tsquery('english', search_query)
  order by rank desc
  limit result_limit;
$$;

-- Postgres grants EXECUTE to PUBLIC by default on new functions, so this
-- is likely redundant — but explicit beats implicit for anything
-- security-adjacent, and it costs nothing to state directly.
grant execute on function public.search_guides(text, int) to anon, authenticated;
