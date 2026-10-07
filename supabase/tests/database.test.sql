-- Database behaviour: RLS, privileges and SQL functions (docs/04-database.md §5, §7).
-- Runs in CI against the DEV project after migrations: `supabase test db --linked`.
-- Everything happens inside one transaction that is rolled back, so DEV data is never changed.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(37);

-- Fixtures (as the migration owner, RLS bypassed) -------------------------------------------
insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-0000000000a1', 'rls-a@test.invalid'),
  ('00000000-0000-4000-8000-0000000000b2', 'rls-b@test.invalid');
insert into districts (id, slug, name_bn, name_en, division_bn, division_en, search_key)
  values (900, 'rls-test-district', 'টেস্ট জেলা', 'Test District', 'টেস্ট', 'Test', 'test');
insert into profiles (id, display_name, home_district_id) values
  ('00000000-0000-4000-8000-0000000000a1', 'A', 900),
  ('00000000-0000-4000-8000-0000000000b2', 'B', 900);
insert into foods (id, slug, name_bn, status, search_text, search_key) values
  ('00000000-0000-4000-8000-00000000f001', 'rls-test-doi', 'টেস্ট দই', 'active', 'টেস্ট দই', 'test dai'),
  ('00000000-0000-4000-8000-00000000f002', 'rls-test-hidden', 'লুকানো', 'hidden', '', '');
insert into places (id, slug, name_bn, district_id) values
  ('00000000-0000-4000-8000-00000000c001', 'rls-test-place', 'টেস্ট দোকান', 900);
insert into dishes (id, place_id, food_id) values
  ('00000000-0000-4000-8000-00000000d001', '00000000-0000-4000-8000-00000000c001', '00000000-0000-4000-8000-00000000f001');

-- Functions ---------------------------------------------------------------------------------
select ok(abs(wilson_lower_bound(3, 3) - 0.4385) < 0.0001, 'wilson 3/3 matches lib/ranking/wilson.ts');
select ok(abs(wilson_lower_bound(950, 1000) - 0.9347) < 0.0001, 'wilson 950/1000 matches lib');
select is(wilson_lower_bound(0, 0), 0::double precision, 'wilson with no experiences is 0');
select ok(
  exists (select 1 from search_all('টেস্ট দই', 'test dai') where slug = 'rls-test-doi'),
  'search_all finds an active food'
);
select ok(
  not exists (select 1 from search_all('লুকানো', '') where slug = 'rls-test-hidden'),
  'search_all skips hidden foods'
);

-- Anonymous visitor -------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select is((select count(*)::int from foods where slug like 'rls-test-%'), 1, 'anon reads only active foods');
select is((select count(*)::int from places where slug = 'rls-test-place'), 1, 'anon reads active places');
select is((select count(*)::int from profiles), 0, 'anon cannot read profiles directly');
select ok((select count(*) from public_profiles) >= 2, 'anon reads names via public_profiles');
select throws_ok(
  $$ insert into foods (slug, name_bn) values ('rls-anon-food', 'x') $$,
  '42501', null, 'anon cannot add a food'
);
select is_empty(
  $$ update dishes set loved_count = 999 where id = '00000000-0000-4000-8000-00000000d001' returning id $$,
  'anon cannot change dish counters'
);
select throws_ok(
  $$ select refresh_dish_stats('00000000-0000-4000-8000-00000000d001') $$,
  '42501', null, 'anon cannot run refresh_dish_stats'
);

-- Signed-in user A ----------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true);

select lives_ok(
  $$ insert into experiences (user_id, dish_id, reaction)
     values ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-00000000d001', 'loved') $$,
  'user adds their own experience'
);
select throws_ok(
  $$ insert into experiences (user_id, dish_id, reaction)
     values ('00000000-0000-4000-8000-0000000000b2', '00000000-0000-4000-8000-00000000d001', 'okay') $$,
  '42501', null, 'user cannot add an experience as someone else'
);
select throws_ok(
  $$ insert into experiences (user_id, dish_id, reaction)
     values ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-00000000d001', 'okay') $$,
  '23505', null, 'one experience per user per dish'
);
select throws_ok(
  $$ insert into dishes (place_id, food_id, loved_count)
     values ('00000000-0000-4000-8000-00000000c001', '00000000-0000-4000-8000-00000000f002', 50) $$,
  '42501', null, 'a new dish cannot start with counts'
);
select throws_ok(
  $$ insert into claims (entity, entity_id, type, value, created_by, status)
     values ('place', '00000000-0000-4000-8000-00000000c001', 'availability', '{}',
             '00000000-0000-4000-8000-0000000000a1', 'confirmed') $$,
  '42501', null, 'a new claim cannot start confirmed'
);
select lives_ok(
  $$ update profiles set display_name = 'নতুন নাম' where id = '00000000-0000-4000-8000-0000000000a1' $$,
  'user renames themselves'
);
select throws_ok(
  $$ update profiles set role = 'admin' where id = '00000000-0000-4000-8000-0000000000a1' $$,
  'P0001', null, 'user cannot make themselves admin'
);
select is_empty(
  $$ update profiles set display_name = 'hacked' where id = '00000000-0000-4000-8000-0000000000b2' returning id $$,
  'user cannot edit another profile'
);
select lives_ok(
  $$ insert into saved_items (user_id, entity, entity_id)
     values ('00000000-0000-4000-8000-0000000000a1', 'food', '00000000-0000-4000-8000-00000000f001') $$,
  'user saves a food'
);

-- User B sees none of A's private rows -----------------------------------------------------
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000b2","role":"authenticated"}', true);
select is((select count(*)::int from saved_items), 0, 'saved lists are private');

-- Direct database session (SQL editor, seed): no JWT, may manage privileges ------------------------
reset role;
select set_config('request.jwt.claims', '', true);
select lives_ok(
  $$ update profiles set is_banned = true where id = '00000000-0000-4000-8000-0000000000b2' $$,
  'a direct database session can ban a user'
);

-- Banned user ------------------------------------------------------------------------------
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000b2","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$ insert into reports (entity, entity_id, reason, user_id)
     values ('food', 'x', 'spam', '00000000-0000-4000-8000-0000000000b2') $$,
  '42501', null, 'banned users cannot write'
);

-- Server (service role) maintains aggregates --------------------------------------------------
reset role;
set local role service_role;
select lives_ok(
  $$ select refresh_dish_stats('00000000-0000-4000-8000-00000000d001') $$,
  'service role refreshes dish stats'
);


-- Curated launch content (migrations 0006–0007) ------------------------------------------------
reset role;
select is((select count(*)::int from districts where id < 900), 64, 'all 64 districts are seeded');
select ok(
  exists (select 1 from foods where slug = 'doi' and is_seed)
  and exists (select 1 from places where slug = 'haji-biryani-dhaka' and is_seed),
  'launch content carries the is_seed flag'
);
select ok(
  exists (select 1 from search_all('kacchi', 'kaci') where slug = 'kacchi')
  and exists (select 1 from search_all('কাচি', 'kaci') where slug = 'kacchi')
  and exists (select 1 from search_all('doi', 'dai') where slug = 'doi')
  and exists (select 1 from search_all('bogra', 'bagra') where slug = 'bogura'),
  'search_all finds kacchi / কাচি / doi / bogra from the seed'
);

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true);
select throws_ok(
  $$ insert into foods (slug, name_bn, created_by, is_seed)
     values ('rls-user-seed-food', 'x', '00000000-0000-4000-8000-0000000000a1', true) $$,
  'P0001', null, 'users cannot flag their own rows as seed content'
);
select throws_ok(
  $$ select purge_seed_data() $$,
  '42501', null, 'users cannot run purge_seed_data'
);
reset role;

-- A real person rated one seed dish; purging must keep what they built on.
insert into experiences (user_id, dish_id, reaction)
select '00000000-0000-4000-8000-0000000000a1', d.id, 'loved'
from dishes d join places p on p.id = d.place_id
where p.slug = 'haji-biryani-dhaka';

set local role service_role;
select lives_ok($$ select purge_seed_data() $$, 'service role purges seed content');
select ok(
  not exists (select 1 from places where slug = 'fakruddin-biryani-dhaka')
  and not exists (select 1 from regional_fame where is_seed),
  'unused seed places and the famous-for list are gone'
);
select ok(
  exists (select 1 from places where slug = 'haji-biryani-dhaka')
  and exists (select 1 from foods where slug = 'kacchi'),
  'a seed place with a real experience, and its food, are kept'
);
select ok(
  exists (select 1 from places where slug = 'rls-test-place')
  and (select count(*)::int from districts where id < 900) = 64,
  'user-made rows and districts are never purged'
);
select lives_ok($$ select purge_seed_data(false) $$, 'purge_seed_data(false) removes everything flagged');
select ok(
  not exists (select 1 from foods where is_seed)
  and not exists (select 1 from places where is_seed)
  and not exists (select 1 from dishes where is_seed),
  'no seed rows remain'
);
select ok(
  not exists (select 1 from aliases a where a.entity = 'food' and not exists (select 1 from foods f where f.id::text = a.entity_id)),
  'aliases of removed foods are cleaned up'
);

select * from finish();
rollback;
