-- 0006: mark curated launch content so it can be removed later with one command.
--
-- Rows created by the project (not by users) carry is_seed = true. Users can never set the flag
-- (trigger below), so `select purge_seed_data();` removes only our content and never user content.
-- Districts are reference data (not flagged) and always stay.

alter table foods add column is_seed boolean not null default false;
alter table places add column is_seed boolean not null default false;
alter table dishes add column is_seed boolean not null default false;
alter table regional_fame add column is_seed boolean not null default false;

create index foods_seed on foods (id) where is_seed;
create index places_seed on places (id) where is_seed;
create index dishes_seed on dishes (id) where is_seed;

-- Only the server (service role) or a direct database session may set or change the flag.
create or replace function protect_seed_flag()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated')
     and ((tg_op = 'INSERT' and new.is_seed)
          or (tg_op = 'UPDATE' and new.is_seed is distinct from old.is_seed)) then
    raise exception 'is_seed can only be set by the server';
  end if;
  return new;
end
$$;

create trigger foods_protect_seed before insert or update on foods
  for each row execute function protect_seed_flag();
create trigger places_protect_seed before insert or update on places
  for each row execute function protect_seed_flag();
create trigger dishes_protect_seed before insert or update on dishes
  for each row execute function protect_seed_flag();
create trigger regional_fame_protect_seed before insert or update on regional_fame
  for each row execute function protect_seed_flag();

-- Remove the project's curated content.
--   select purge_seed_data();        -- keeps what real users already built on (default)
--   select purge_seed_data(false);   -- removes ALL flagged rows, including their experiences
-- "Built on" = a seed dish with experiences, or a seed row someone saved; its place and food stay too.
-- Returns what was removed. Run it from the Supabase SQL editor (project owner) or the service role.
create or replace function purge_seed_data(p_keep_used boolean default true)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  n_fame int;
  n_dishes int;
  n_places int;
  n_foods int;
begin
  delete from regional_fame where is_seed;
  get diagnostics n_fame = row_count;

  delete from dishes d
  where d.is_seed
    and (not p_keep_used
         or (not exists (select 1 from experiences e where e.dish_id = d.id)
             and not exists (select 1 from saved_items s where s.entity = 'dish' and s.entity_id = d.id::text)));
  get diagnostics n_dishes = row_count;

  delete from places p
  where p.is_seed
    and not exists (select 1 from dishes d where d.place_id = p.id)
    and (not p_keep_used
         or not exists (select 1 from saved_items s where s.entity = 'place' and s.entity_id = p.id::text));
  get diagnostics n_places = row_count;

  delete from foods f
  where f.is_seed
    and not exists (select 1 from dishes d where d.food_id = f.id)
    and not exists (select 1 from regional_fame rf where rf.food_id = f.id)
    and (not p_keep_used
         or not exists (select 1 from saved_items s where s.entity = 'food' and s.entity_id = f.id::text));
  get diagnostics n_foods = row_count;

  -- Leftovers that pointed at removed rows (these tables have no foreign keys to them).
  delete from aliases a
  where a.entity = 'food' and not exists (select 1 from foods f where f.id::text = a.entity_id);
  delete from claims c
  where (c.entity = 'place' and not exists (select 1 from places p where p.id = c.entity_id))
     or (c.entity = 'dish' and not exists (select 1 from dishes d where d.id = c.entity_id));

  update districts d
  set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');

  return jsonb_build_object(
    'regional_fame', n_fame, 'dishes', n_dishes, 'places', n_places, 'foods', n_foods
  );
end
$$;

revoke execute on function purge_seed_data(boolean) from public, anon, authenticated;
grant execute on function purge_seed_data(boolean) to service_role;
