-- Database behaviour: RLS, privileges and SQL functions (docs/04-database.md §5, §7).
-- Runs in CI against the DEV project after migrations: `supabase test db --linked`.
-- Everything happens inside one transaction that is rolled back, so DEV data is never changed.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(24);

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

-- Banned user ------------------------------------------------------------------------------
reset role;
update profiles set is_banned = true where id = '00000000-0000-4000-8000-0000000000b2';
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

select * from finish();
rollback;
