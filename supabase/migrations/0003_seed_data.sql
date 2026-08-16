-- CAMNE — Migration 0003: Seed data
-- Run this after 0002_rls_policies.sql.
--
-- Seeds the 8 categories and the 10 V1 guides from the Phase 0 spec, as
-- published "shells" (title, category, cost/time text, slug). Full
-- step-by-step content, sources, and expert advice get written in
-- Phase 3 — this just proves the schema, RLS, and connection work
-- end-to-end, and gives real rows for the app to render against.

insert into public.categories (slug, name, description, icon, sort_order) values
  ('government', 'Government', 'Documents, licences, and government services.', 'government', 1),
  ('business', 'Business', 'Starting and running a business in Malaysia.', 'business', 2),
  ('property', 'Property', 'Renting, buying, and owning property.', 'property', 3),
  ('cars', 'Cars', 'Buying, selling, and maintaining a car.', 'cars', 4),
  ('money', 'Money', 'Tax, EPF, insurance, and personal finance.', 'money', 5),
  ('education', 'Education', 'University, scholarships, and courses.', 'education', 6),
  ('home', 'Home', 'Renovation, contractors, and utilities.', 'home', 7),
  ('everyday', 'Everyday', 'Practical life tasks and common problems.', 'everyday', 8);

insert into public.guides
  (slug, category_id, title, estimated_cost_text, estimated_time_text, status, last_verified_at)
values
  ('renew-malaysian-passport', (select id from public.categories where slug = 'government'),
    'Camne nak renew passport?', 'RM200', '15–30 minutes at the counter', 'published', current_date),

  ('replace-mykad', (select id from public.categories where slug = 'government'),
    'Camne nak replace MyKad?', 'RM10 (first replacement)', 'Same day', 'published', current_date),

  ('renew-driving-licence', (select id from public.categories where slug = 'government'),
    'Camne nak renew driving licence?', 'RM30–RM90 depending on term', '15 minutes', 'published', current_date),

  ('renew-road-tax', (select id from public.categories where slug = 'government'),
    'Camne nak renew road tax?', 'Varies by vehicle', '10–15 minutes online', 'published', current_date),

  ('register-ssm', (select id from public.categories where slug = 'business'),
    'Camne nak register SSM?', 'RM60 (sole proprietor)', 'Same day online', 'published', current_date),

  ('start-a-business', (select id from public.categories where slug = 'business'),
    'Camne nak start a business?', 'Varies', '1–2 weeks', 'published', current_date),

  ('rent-a-house', (select id from public.categories where slug = 'property'),
    'Camne nak rent a house?', 'Deposit + 1 month rent typical', '1–3 weeks', 'published', current_date),

  ('buy-my-first-house', (select id from public.categories where slug = 'property'),
    'Camne nak buy my first house?', 'Varies — legal fees + stamp duty', 'Weeks to months', 'published', current_date),

  ('buy-a-second-hand-car', (select id from public.categories where slug = 'cars'),
    'Camne nak buy a second-hand car?', 'Varies', '1–2 weeks', 'published', current_date),

  ('file-income-tax', (select id from public.categories where slug = 'money'),
    'Camne nak file income tax?', 'Free (e-Filing)', '30–60 minutes', 'published', current_date);
