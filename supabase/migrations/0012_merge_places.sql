-- 0012: merging a duplicate place into the right one (admin, docs/01-product-spec.md §3.13).
-- Dishes, experiences, claims and saved items move to the surviving place; the duplicate is kept as
-- a row with status 'merged' and `merged_into`, so its old links can redirect.
create or replace function merge_places(p_from uuid, p_into uuid)
returns int
language plpgsql security definer
set search_path = public
as $$
declare
  d record;
  target uuid;
  moved int := 0;
begin
  if p_from = p_into then
    raise exception 'A place cannot be merged into itself';
  end if;
  if not exists (select 1 from places where id = p_into and status = 'active') then
    raise exception 'The surviving place must be active';
  end if;
  if not exists (select 1 from places where id = p_from) then
    raise exception 'Unknown place to merge';
  end if;

  for d in select id, food_id from dishes where place_id = p_from loop
    select id into target from dishes where place_id = p_into and food_id = d.food_id;
    if target is null then
      update dishes set place_id = p_into where id = d.id;
    else
      -- One experience per person per dish: where both places already have one from the same
      -- person, the surviving place's stays.
      delete from experiences e
        where e.dish_id = d.id
          and exists (select 1 from experiences k where k.dish_id = target and k.user_id = e.user_id);
      update experiences set dish_id = target where dish_id = d.id;
      -- Claims are unique per (entity, type): keep the survivor's, move the rest.
      delete from claims c
        where c.entity = 'dish' and c.entity_id = d.id
          and exists (
            select 1 from claims k where k.entity = 'dish' and k.entity_id = target and k.type = c.type
          );
      update claims set entity_id = target where entity = 'dish' and entity_id = d.id;
      delete from dishes where id = d.id;
      perform refresh_dish_stats(target);
    end if;
    moved := moved + 1;
  end loop;

  delete from claims c
    where c.entity = 'place' and c.entity_id = p_from
      and exists (
        select 1 from claims k where k.entity = 'place' and k.entity_id = p_into and k.type = c.type
      );
  update claims set entity_id = p_into where entity = 'place' and entity_id = p_from;

  delete from saved_items s
    where s.entity = 'place' and s.entity_id = p_from::text
      and exists (
        select 1 from saved_items k
        where k.user_id = s.user_id and k.entity = 'place' and k.entity_id = p_into::text and k.kind = s.kind
      );
  update saved_items set entity_id = p_into::text where entity = 'place' and entity_id = p_from::text;

  update places set status = 'merged', merged_into = p_into, updated_at = now() where id = p_from;
  return moved;
end;
$$;

revoke execute on function merge_places(uuid, uuid) from public, anon, authenticated;
grant execute on function merge_places(uuid, uuid) to service_role;
