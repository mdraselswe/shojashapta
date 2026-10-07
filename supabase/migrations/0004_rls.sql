-- 0004_rls: Row Level Security on every table (docs/04-database.md §7, docs/09-security-and-limits.md).
-- Anyone may read active content; writes need a signed-in, non-banned user and only touch their own
-- rows; counters and statuses change only through security-definer functions (0003).
-- The service role (server, src/infrastructure) bypasses RLS.

-- Helper: signed in and not banned.
create or replace function is_active_user()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select auth.uid() is not null
     and not exists (select 1 from profiles where id = auth.uid() and is_banned)
$$;

-- Reference data: public read, admin write --------------------------------------------------------
alter table districts enable row level security;
create policy "public read" on districts for select using (true);
create policy "admin write" on districts for all using (is_admin()) with check (is_admin());

alter table areas enable row level security;
create policy "public read" on areas for select using (true);
create policy "admin write" on areas for all using (is_admin()) with check (is_admin());

alter table regional_fame enable row level security;
create policy "public read" on regional_fame for select using (true);
create policy "admin write" on regional_fame for all using (is_admin()) with check (is_admin());

alter table aliases enable row level security;
create policy "public read" on aliases for select using (true);
create policy "admin write" on aliases for all using (is_admin()) with check (is_admin());

-- Profiles: own row only; others' names/avatars through the public_profiles view -----------------
alter table profiles enable row level security;
create policy "own read" on profiles for select using (id = auth.uid() or is_admin());
create policy "own insert" on profiles for insert with check (id = auth.uid() and role = 'user' and not is_banned);
create policy "own update" on profiles for update using (id = auth.uid() or is_admin());

-- Users may edit their name/avatar/home district, never their role or ban flag.
create or replace function protect_profile_privileges()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.is_banned is distinct from old.is_banned)
     and coalesce(auth.role(), '') <> 'service_role'
     and not is_admin() then
    raise exception 'role and is_banned can only be changed by an admin';
  end if;
  return new;
end
$$;
create trigger profiles_protect_privileges
  before update on profiles
  for each row execute function protect_profile_privileges();

create view public_profiles as
  select id, display_name, avatar_url from profiles;
grant select on public_profiles to anon, authenticated;

-- Catalog: public read of active rows; signed-in users add; admins edit ------------------------
alter table foods enable row level security;
create policy "public read active" on foods for select using (status = 'active' or is_admin());
create policy "auth insert" on foods for insert
  with check (is_active_user() and created_by = auth.uid() and status = 'active'
              and experience_count = 0 and loved_count = 0);
create policy "admin update" on foods for update using (is_admin());

alter table places enable row level security;
create policy "public read active" on places for select using (status = 'active' or is_admin());
create policy "auth insert" on places for insert
  with check (is_active_user() and created_by = auth.uid() and status = 'active' and merged_into is null);
create policy "admin update" on places for update using (is_admin());

alter table dishes enable row level security;
create policy "public read active" on dishes for select using (status = 'active' or is_admin());
-- A dish is created on its first experience; it must start with empty aggregates.
create policy "auth insert" on dishes for insert
  with check (is_active_user() and status = 'active'
              and loved_count = 0 and okay_count = 0 and disliked_count = 0 and wilson_score = 0);
create policy "admin update" on dishes for update using (is_admin());

-- Experiences (docs/04 §7) -------------------------------------------------------------------
alter table experiences enable row level security;
create policy "public read" on experiences for select
  using (status = 'active' or user_id = auth.uid() or is_admin());
create policy "own insert" on experiences for insert
  with check (user_id = auth.uid() and is_active_user() and status = 'active');
create policy "own update" on experiences for update
  using (user_id = auth.uid()) with check (user_id = auth.uid() and status = 'active');
create policy "own delete" on experiences for delete using (user_id = auth.uid() or is_admin());

-- Claims: public read; created empty; status and counts only via the service --------------------
alter table claims enable row level security;
create policy "public read" on claims for select using (true);
create policy "auth insert" on claims for insert
  with check (is_active_user() and created_by = auth.uid() and status = 'unverified'
              and correct_count = 0 and partial_count = 0 and wrong_count = 0
              and last_confirmed_at is null and expires_at is null);
create policy "admin update" on claims for update using (is_admin());

alter table claim_votes enable row level security;
create policy "own read" on claim_votes for select using (user_id = auth.uid() or is_admin());
create policy "own insert" on claim_votes for insert with check (user_id = auth.uid() and is_active_user());
create policy "own update" on claim_votes for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Media ---------------------------------------------------------------------------------------
alter table media enable row level security;
create policy "public read active" on media for select
  using (status = 'active' or owner_id = auth.uid() or is_admin());
create policy "own insert" on media for insert
  with check (owner_id = auth.uid() and is_active_user() and status = 'active');
create policy "own or admin update" on media for update using (owner_id = auth.uid() or is_admin());

-- Moderation inputs: insert own; read own; admins review --------------------------------------
alter table edit_suggestions enable row level security;
create policy "own or admin read" on edit_suggestions for select using (user_id = auth.uid() or is_admin());
create policy "own insert" on edit_suggestions for insert
  with check (user_id = auth.uid() and is_active_user() and status = 'open'
              and reviewed_by is null and reviewed_at is null);
create policy "admin update" on edit_suggestions for update using (is_admin());

alter table reports enable row level security;
create policy "own or admin read" on reports for select using (user_id = auth.uid() or is_admin());
create policy "own insert" on reports for insert
  with check (user_id = auth.uid() and is_active_user() and status = 'open');
create policy "admin update" on reports for update using (is_admin());

-- Private lists --------------------------------------------------------------------------------
alter table saved_items enable row level security;
create policy "own read" on saved_items for select using (user_id = auth.uid());
create policy "own insert" on saved_items for insert with check (user_id = auth.uid() and is_active_user());
create policy "own delete" on saved_items for delete using (user_id = auth.uid());

-- Server-only tables: RLS on, no policies → only the service role reaches them -------------------
alter table search_misses enable row level security;

alter table rate_limit_events enable row level security;
create policy "own read" on rate_limit_events for select using (user_id = auth.uid());
