-- 0003_functions: ranking, aggregates, search, rate limits, roles (docs/04-database.md §5).
-- Aggregates and counters change only through `security definer` functions that the server calls
-- with the service role; regular users cannot execute them.

-- Wilson lower bound — must stay identical to src/lib/ranking/wilson.ts.
create or replace function wilson_lower_bound(pos int, n int, z double precision default 1.96)
returns double precision
language sql immutable
set search_path = public
as $$
  select case when n = 0 then 0 else
    ((pos::float / n) + z * z / (2 * n)
      - z * sqrt(((pos::float / n) * (1 - (pos::float / n)) + z * z / (4 * n)) / n))
    / (1 + z * z / n)
  end
$$;

-- Recompute a dish's counts, score and typical price (10th–90th percentile of prices paid).
create or replace function refresh_dish_stats(p_dish uuid)
returns void
language sql security definer
set search_path = public
as $$
  update dishes d set
    loved_count = s.loved,
    okay_count = s.okay,
    disliked_count = s.disliked,
    wilson_score = wilson_lower_bound(s.loved, s.loved + s.okay + s.disliked),
    last_experience_at = s.last_at,
    price_min = coalesce(s.pmin, d.price_min),
    price_max = coalesce(s.pmax, d.price_max)
  from (
    select
      count(*) filter (where reaction = 'loved')::int as loved,
      count(*) filter (where reaction = 'okay')::int as okay,
      count(*) filter (where reaction = 'disliked')::int as disliked,
      max(created_at) as last_at,
      percentile_disc(0.1) within group (order by price_paid) as pmin,
      percentile_disc(0.9) within group (order by price_paid) as pmax
    from experiences
    where dish_id = p_dish and status = 'active'
  ) s
  where d.id = p_dish;
$$;

-- Unified search; the query is pre-normalized by src/lib/text (docs/04 §6). The service dedupes by (kind, id).
create or replace function search_all(q_text text, q_key text, lim int default 8)
returns table (kind text, id text, slug text, title text, subtitle text, score real)
language sql stable
set search_path = public, extensions
as $$
  (
    select 'food', f.id::text, f.slug, f.name_bn, null::text,
           greatest(similarity(f.search_text, q_text), similarity(f.search_key, q_key))
    from foods f
    where f.status = 'active' and (f.search_text % q_text or f.search_key % q_key)
    union all
    select 'food', f.id::text, f.slug, f.name_bn, a.alias, similarity(a.search_key, q_key)
    from aliases a
    join foods f on a.entity = 'food' and f.id::text = a.entity_id
    where f.status = 'active' and a.search_key % q_key
    union all
    select 'place', p.id::text, p.slug, p.name_bn, d.name_bn,
           greatest(similarity(p.search_text, q_text), similarity(p.search_key, q_key))
    from places p
    join districts d on d.id = p.district_id
    where p.status = 'active' and (p.search_text % q_text or p.search_key % q_key)
    union all
    select 'district', d.id::text, d.slug, d.name_bn, d.division_bn, similarity(d.search_key, q_key)
    from districts d
    where d.search_key % q_key
  )
  order by score desc
  limit lim
$$;

-- Daily limits: true (and the use is recorded) when allowed.
create or replace function check_rate_limit(p_user uuid, p_action text, p_max int, p_window interval)
returns boolean
language plpgsql security definer
set search_path = public
as $$
declare
  used int;
begin
  select count(*) into used
  from rate_limit_events
  where user_id = p_user and action = p_action and created_at > now() - p_window;
  if used >= p_max then
    return false;
  end if;
  insert into rate_limit_events (user_id, action) values (p_user, p_action);
  return true;
end
$$;

create or replace function is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
$$;

-- Who may run what. Functions are executable by PUBLIC by default; lock down the writers.
revoke execute on function refresh_dish_stats(uuid) from public, anon, authenticated;
revoke execute on function check_rate_limit(uuid, text, int, interval) from public, anon, authenticated;
grant execute on function refresh_dish_stats(uuid) to service_role;
grant execute on function check_rate_limit(uuid, text, int, interval) to service_role;
