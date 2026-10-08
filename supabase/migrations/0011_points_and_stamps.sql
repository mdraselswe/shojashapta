-- 0011: food passport and points (docs/01-product-spec.md §3.11b).
-- Points are a score, never spent. Every award is one row, unique per person, kind and thing, so
-- the same action can never pay twice; revoking an entity (hidden content) takes its points back.

alter table profiles add column points_total int not null default 0 check (points_total >= 0);

create table point_events (
  id bigserial primary key,
  user_id uuid not null references profiles on delete cascade,
  -- experience | place_create | discoverer | claim_vote | edit_accepted
  kind text not null,
  -- what the points were for (place, experience, claim, edit_suggestion) and its id
  entity text not null,
  entity_id text not null,
  points int not null check (points > 0),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, kind, entity_id)
);
create index point_events_entity_idx on point_events (entity, entity_id) where revoked_at is null;

-- One stamp per district a person has eaten in ("visit"), plus "discoverer" for being the first to
-- add a place for a district's famous food.
create table district_stamps (
  user_id uuid not null references profiles on delete cascade,
  district_id smallint not null references districts,
  kind text not null default 'visit' check (kind in ('visit', 'discoverer')),
  food_id uuid references foods,
  created_at timestamptz not null default now(),
  primary key (user_id, district_id, kind)
);

alter table point_events enable row level security;
create policy "own read" on point_events for select using (user_id = auth.uid() or is_admin());

alter table district_stamps enable row level security;
create policy "own read" on district_stamps for select using (user_id = auth.uid() or is_admin());

-- Returns the points awarded: p_points the first time, 0 for a repeat.
create or replace function award_points(
  p_user uuid, p_kind text, p_entity text, p_entity_id text, p_points int
)
returns int
language plpgsql security definer
set search_path = public
as $$
begin
  insert into point_events (user_id, kind, entity, entity_id, points)
  values (p_user, p_kind, p_entity, p_entity_id, p_points)
  on conflict (user_id, kind, entity_id) do nothing;
  if not found then
    return 0;
  end if;
  update profiles set points_total = points_total + p_points where id = p_user;
  return p_points;
end;
$$;

-- Takes back everything awarded for one entity (content that was hidden or removed).
create or replace function revoke_points(p_entity text, p_entity_id text)
returns int
language sql security definer
set search_path = public
as $$
  with revoked as (
    update point_events set revoked_at = now()
    where entity = p_entity and entity_id = p_entity_id and revoked_at is null
    returning user_id, points
  ),
  sums as (
    select user_id, sum(points)::int as taken from revoked group by user_id
  ),
  applied as (
    update profiles p set points_total = greatest(0, p.points_total - s.taken)
    from sums s where p.id = s.user_id
    returning 1
  )
  select coalesce((select sum(taken) from sums), 0)::int;
$$;

-- True when the stamp is new for this person.
create or replace function unlock_stamp(p_user uuid, p_district smallint, p_kind text, p_food uuid)
returns boolean
language plpgsql security definer
set search_path = public
as $$
begin
  insert into district_stamps (user_id, district_id, kind, food_id)
  values (p_user, p_district, p_kind, p_food)
  on conflict (user_id, district_id, kind) do nothing;
  return found;
end;
$$;

revoke execute on function award_points(uuid, text, text, text, int) from public, anon, authenticated;
revoke execute on function revoke_points(text, text) from public, anon, authenticated;
revoke execute on function unlock_stamp(uuid, smallint, text, uuid) from public, anon, authenticated;
grant execute on function award_points(uuid, text, text, text, int) to service_role;
grant execute on function revoke_points(text, text) to service_role;
grant execute on function unlock_stamp(uuid, smallint, text, uuid) to service_role;
