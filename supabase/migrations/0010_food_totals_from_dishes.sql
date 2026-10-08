-- 0010: refresh_dish_stats also keeps the food's own totals (experience_count, loved_count) in step
-- with its dishes, so the food page and search ranking see new experiences straight away.
create or replace function refresh_dish_stats(p_dish uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_food uuid;
begin
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
  where d.id = p_dish
  returning d.food_id into v_food;

  if v_food is not null then
    update foods f set
      experience_count = t.total,
      loved_count = t.loved
    from (
      select
        coalesce(sum(loved_count + okay_count + disliked_count), 0)::int as total,
        coalesce(sum(loved_count), 0)::int as loved
      from dishes
      where food_id = v_food and status = 'active'
    ) t
    where f.id = v_food;
  end if;
end;
$$;

revoke execute on function refresh_dish_stats(uuid) from public, anon, authenticated;
grant execute on function refresh_dish_stats(uuid) to service_role;
