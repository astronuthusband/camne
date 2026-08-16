-- CAMNE — Migration 0002: Row Level Security
-- Run this after 0001_core_schema.sql.
--
-- How RLS works, in one paragraph: by default, once RLS is enabled on a
-- table, EVERY query is denied unless a policy explicitly allows it —
-- including your own queries from the app. We write one policy per
-- (table, operation) pair. `using` controls which existing rows a
-- SELECT/UPDATE/DELETE can see; `with check` controls what an
-- INSERT/UPDATE is allowed to write. The anon key (used by the public
-- website) and the authenticated role both go through these policies.
-- The service-role key (used only server-side, e.g. the future admin
-- dashboard's server actions) bypasses RLS entirely — never expose it
-- to the browser.

-- ─────────────────────────────────────────────────────────────────────────
-- Helper: is_admin()
-- security definer + fixed search_path so it can read `users` (which
-- itself has RLS) without recursing into that table's own policies.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- Auth trigger: create a public.users profile row whenever someone signs
-- up via Supabase Auth. Not wired into the app UI until Phase 7, but the
-- schema is ready now.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- Enable RLS everywhere
-- ─────────────────────────────────────────────────────────────────────────
alter table public.categories enable row level security;
alter table public.guides enable row level security;
alter table public.guide_steps enable row level security;
alter table public.sources enable row level security;
alter table public.experts enable row level security;
alter table public.guide_experts enable row level security;
alter table public.guide_tags enable row level security;
alter table public.users enable row level security;
alter table public.bookmarks enable row level security;
alter table public.feedback enable row level security;
alter table public.search_analytics enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- categories — public read; admin write
-- ─────────────────────────────────────────────────────────────────────────
create policy "categories are publicly readable"
  on public.categories for select
  using (true);

create policy "admins can manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- guides — public can read PUBLISHED guides only; admins see/manage all
-- ─────────────────────────────────────────────────────────────────────────
create policy "published guides are publicly readable"
  on public.guides for select
  using (status = 'published' or public.is_admin());

create policy "admins can manage guides"
  on public.guides for insert
  with check (public.is_admin());

create policy "admins can update guides"
  on public.guides for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete guides"
  on public.guides for delete
  using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- guide_steps / sources / guide_experts / guide_tags — readable only if
-- the parent guide is published (or you're an admin); admin write.
-- ─────────────────────────────────────────────────────────────────────────
create policy "steps readable if parent guide is published"
  on public.guide_steps for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.guides g
      where g.id = guide_id and g.status = 'published'
    )
  );

create policy "admins can manage steps"
  on public.guide_steps for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "sources readable if parent guide is published"
  on public.sources for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.guides g
      where g.id = guide_id and g.status = 'published'
    )
  );

create policy "admins can manage sources"
  on public.sources for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "guide_experts readable if parent guide is published"
  on public.guide_experts for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.guides g
      where g.id = guide_id and g.status = 'published'
    )
  );

create policy "admins can manage guide_experts"
  on public.guide_experts for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "guide_tags readable if parent guide is published"
  on public.guide_tags for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.guides g
      where g.id = guide_id and g.status = 'published'
    )
  );

create policy "admins can manage guide_tags"
  on public.guide_tags for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- experts — publicly readable; admin write
-- ─────────────────────────────────────────────────────────────────────────
create policy "experts are publicly readable"
  on public.experts for select
  using (true);

create policy "admins can manage experts"
  on public.experts for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- users — you can read/update your own row; admins can read all
-- ─────────────────────────────────────────────────────────────────────────
create policy "users can read their own profile"
  on public.users for select
  using (auth.uid() = id or public.is_admin());

create policy "users can update their own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────
-- bookmarks — only your own
-- ─────────────────────────────────────────────────────────────────────────
create policy "users can read their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "users can add their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "users can remove their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- feedback — anyone (incl. anonymous) can submit; only admins can read
-- back, since comments may be candid and shouldn't be publicly listable
-- ─────────────────────────────────────────────────────────────────────────
create policy "anyone can submit feedback"
  on public.feedback for insert
  with check (true);

create policy "admins can read feedback"
  on public.feedback for select
  using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- search_analytics — anyone can log a search; only admins can read
-- ─────────────────────────────────────────────────────────────────────────
create policy "anyone can log a search"
  on public.search_analytics for insert
  with check (true);

create policy "admins can read search analytics"
  on public.search_analytics for select
  using (public.is_admin());
