-- CAMNE — Migration 0004: Real content for two guides
-- Run this after 0003_seed_data.sql.
--
-- Fills in full content for "renew-malaysian-passport" and
-- "register-ssm" as worked examples of the complete guide template —
-- the other 8 V1 guides stay as shells until you write (or interview
-- an expert for) their real content.
--
-- Sourced from Jabatan Imigresen Malaysia (imi.gov.my) and SSM
-- (ssm.com.my / ezbiz.ssm.com.my) as of August 2026. Fees and
-- procedures are set by those authorities and can change — that's
-- exactly why every guide carries a "last verified" date and links
-- straight to the official source rather than just asserting facts.
--
-- NOTE ON TRUST: while researching this content, several lookalike
-- domains impersonating SSM's real site turned up in search results
-- (e.g. domains styled like "ssm-ezbiz.my" or "myezbiz.com.my" that are
-- NOT ssm.com.my). Only the genuine ssm.com.my domain and its
-- ezbiz.ssm.com.my subdomain are used as sources below — worth keeping
-- in mind for every future guide involving a government portal.

-- ─────────────────────────────────────────────────────────────────────────
-- renew-malaysian-passport
-- ─────────────────────────────────────────────────────────────────────────
update public.guides set
  overview = 'Malaysia introduced a redesigned passport in 2026 with a choice between 5-year and 10-year validity. This guide walks you through renewing an adult Malaysian passport, whether online or at an Immigration counter.',
  who_this_is_for = 'Malaysian citizens aged 18–59 renewing a standard (maroon) passport. Different conditions apply for children, seniors, OKU applicants, and Malaysians applying from overseas — see "Before you start" below.',
  before_you_start = 'You do not need to rush to replace a passport that is still valid — the new 2026 design is being rolled out in phases, and existing passports remain valid until their printed expiry date. A straightforward 5-year renewal for an adult can usually be done online. The 10-year passport, first-time applications, child applications, and lost/damaged replacements currently require an in-person counter visit.',
  what_youll_need = '["MyKad (original)", "Current passport (original)", "MyOnline Passport account, for online renewal only", "Passport fee (see estimated cost)"]'::jsonb,
  estimated_cost_text = 'RM200 (5-year) or RM350 (10-year), adult rate',
  estimated_time_text = 'Same day if submitted before 3pm; often 1–2 hours at UTC counters',
  common_mistakes = '["Assuming the 10-year passport can be applied for online — as of 2026 it is counter-only.", "Not booking a counter appointment first at temujanji.imi.gov.my — walk-ins are accepted, but appointment holders are prioritized, especially on Mondays.", "Traveling internationally with less than 6 months'' passport validity remaining — many countries will refuse entry even on a technically valid passport.", "Forgetting that concession rates (senior, OKU, child, student) are usually applied by a counter officer, not the online system, which may default to the standard adult rate."]'::jsonb,
  last_verified_at = current_date,
  seo_title = 'How to Renew Your Malaysian Passport (2026 Guide)',
  seo_description = 'Step-by-step guide to renewing a Malaysian passport in 2026 — online vs counter, fees for the 5-year and 10-year options, documents needed, and processing time.'
where slug = 'renew-malaysian-passport' and locale = 'en';

delete from public.guide_steps where guide_id = (select id from public.guides where slug = 'renew-malaysian-passport' and locale = 'en');
delete from public.sources where guide_id = (select id from public.guides where slug = 'renew-malaysian-passport' and locale = 'en');

insert into public.guide_steps (guide_id, step_number, title, content, sort_order)
select id, 1, 'Check if you''re eligible to renew online',
  'If you''re an adult renewing a straightforward 5-year passport, use the MyOnline Passport portal (imigresen-online.imi.gov.my). If you want the new 10-year passport, are applying for the first time, are renewing for a child, or your passport is lost or damaged, you''ll need an Immigration counter or UTC instead.',
  1
from public.guides where slug = 'renew-malaysian-passport' and locale = 'en'
union all
select id, 2, 'Book a counter appointment (if applying in person)',
  'Register for a time slot at temujanji.imi.gov.my before you go. Walk-ins are generally accepted, but appointment holders are prioritized, especially at busy branches on Mondays and right after public holidays.',
  2
from public.guides where slug = 'renew-malaysian-passport' and locale = 'en'
union all
select id, 3, 'Bring your documents',
  'Bring your original MyKad and current passport. You don''t need printed photos for most offices — your photo and thumbprints are captured digitally at the counter using the Facial Live Capture system. Minors must be accompanied by at least one parent, with the child''s birth certificate.',
  3
from public.guides where slug = 'renew-malaysian-passport' and locale = 'en'
union all
select id, 4, 'Choose your passport type and pay',
  'Choose between the 5-year and 10-year passport (10-year is counter-only) and pay the applicable fee. If you qualify for a concession rate (child, senior, OKU, student), tell the counter officer — the online system may otherwise charge the standard adult rate.',
  4
from public.guides where slug = 'renew-malaysian-passport' and locale = 'en'
union all
select id, 5, 'Collect your passport',
  'If you apply before 3pm on a working day, your passport is typically ready the same day — sometimes within 1–2 hours at UTC counters. You must collect it in person within 90 days of approval.',
  5
from public.guides where slug = 'renew-malaysian-passport' and locale = 'en';

insert into public.sources (guide_id, source_type, label, url, sort_order)
select id, 'official', 'Jabatan Imigresen Malaysia (Immigration Department)', 'https://www.imi.gov.my/index.php/en/', 1
from public.guides where slug = 'renew-malaysian-passport' and locale = 'en'
union all
select id, 'reference', 'The Star — 10-year Malaysian passport introduced at RM350', 'https://www.thestar.com.my/news/nation/2026/06/04/10-year-malaysian-passport-introduced-at-rm350', 2
from public.guides where slug = 'renew-malaysian-passport' and locale = 'en';

-- ─────────────────────────────────────────────────────────────────────────
-- register-ssm
-- ─────────────────────────────────────────────────────────────────────────
update public.guides set
  overview = 'Registering a sole proprietorship with SSM (Suruhanjaya Syarikat Malaysia, the Companies Commission of Malaysia) is the fastest and cheapest way to legally start a business in Malaysia — most people are done within an hour.',
  who_this_is_for = 'Malaysian citizens or permanent residents, aged 18 and above, starting a sole proprietorship or partnership under their own name or a trade name. Foreigners, and anyone who specifically wants a separate legal entity with limited liability, should look into registering a Sdn Bhd instead — that''s a different process, not covered in this guide.',
  before_you_start = 'Operating a business in Malaysia without registering it is an offence under the Registration of Businesses Act 1956, with fines of up to RM50,000. Decide first whether you''ll register under your own personal name (cheaper, faster) or a trade name (needs an extra name-approval step).',
  what_youll_need = '["MyKad (original and copy)", "Up to 3 proposed business names, in order of preference, if using a trade name", "Any relevant permit or licence for regulated business types (e.g. childcare, tuition centres, food premises)", "Registration fee (see estimated cost)"]'::jsonb,
  estimated_cost_text = 'RM30/year (personal name) or RM60/year (trade name)',
  estimated_time_text = 'Certificate issued within 1 hour to 1 working day',
  common_mistakes = '["Registering under a trade name without submitting Form PNA.42 with backup name choices — if your first choice is rejected, having 2–3 alternatives ready avoids a second trip.", "Forgetting that sole proprietorship registration must be renewed every year — SSM can deregister a lapsed business automatically.", "Not realizing a sole proprietorship has no legal separation from you personally — your personal assets aren''t protected from business debts. Ask about a Sdn Bhd instead if that matters to you.", "Starting to trade before the certificate is actually issued — you''re technically still unregistered until it''s in hand."]'::jsonb,
  last_verified_at = current_date,
  seo_title = 'How to Register a Business with SSM in Malaysia (2026)',
  seo_description = 'Step-by-step guide to registering a sole proprietorship with SSM in Malaysia — fees, documents, personal vs trade name, and how long it takes.'
where slug = 'register-ssm' and locale = 'en';

delete from public.guide_steps where guide_id = (select id from public.guides where slug = 'register-ssm' and locale = 'en');
delete from public.sources where guide_id = (select id from public.guides where slug = 'register-ssm' and locale = 'en');

insert into public.guide_steps (guide_id, step_number, title, content, sort_order)
select id, 1, 'Decide: personal name or trade name',
  'Registering under your own name (exactly as it appears on your MyKad) is faster and cheaper. A trade name (like "Sunshine Bakery") needs an extra approval step and a slightly higher fee, but reads better on invoices and signage.',
  1
from public.guides where slug = 'register-ssm' and locale = 'en'
union all
select id, 2, 'Reserve your trade name, if using one',
  'If registering under a trade name, submit Form PNA.42 with up to three name choices in order of preference, in case your first pick is already taken or rejected.',
  2
from public.guides where slug = 'register-ssm' and locale = 'en'
union all
select id, 3, 'Submit your application',
  'Apply online through SSM''s ezBiz portal (ezbiz.ssm.com.my), or in person at any SSM branch. You''ll need your MyKad and, for regulated business types (like a nursery or tuition centre), any relevant permit or approval letter from the relevant ministry.',
  3
from public.guides where slug = 'register-ssm' and locale = 'en'
union all
select id, 4, 'Pay the registration fee',
  'Pay RM30/year for a personal name, or RM60/year for a trade name. Fees are set by SSM and reviewed periodically — check the current rate on SSM''s portal before you pay.',
  4
from public.guides where slug = 'register-ssm' and locale = 'en'
union all
select id, 5, 'Receive your Business Registration Certificate',
  'Your certificate is typically issued within an hour of payment, and always within one working day. You can now open a business bank account and sign contracts — remember to renew annually.',
  5
from public.guides where slug = 'register-ssm' and locale = 'en';

insert into public.sources (guide_id, source_type, label, url, sort_order)
select id, 'official', 'SSM EzBiz — Online Business Registration', 'https://ezbiz.ssm.com.my/', 1
from public.guides where slug = 'register-ssm' and locale = 'en'
union all
select id, 'official', 'SSM — New Business Registration Guideline (PDF)', 'https://www.ssm.com.my/Documents/Ezbiz%20Online%20User%20Guideline/GUIDELINE-FOR-REGISTRATION-OF-NEW-BUSINESS.pdf', 2
from public.guides where slug = 'register-ssm' and locale = 'en';
