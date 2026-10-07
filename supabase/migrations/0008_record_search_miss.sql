-- 0008: remember searches that found nothing, so editors can add aliases or content
-- (docs/04-database.md §3 search_misses, roadmap 9.5). Called only by the server (service role).

create or replace function record_search_miss(p_key text, p_text text)
returns void
language sql security definer
set search_path = public
as $$
  insert into search_misses (search_key, sample_query)
  values (left(p_key, 80), left(p_text, 80))
  on conflict (search_key)
  do update set count = search_misses.count + 1, last_seen_at = now();
$$;

revoke execute on function record_search_miss(text, text) from public, anon, authenticated;
grant execute on function record_search_miss(text, text) to service_role;
