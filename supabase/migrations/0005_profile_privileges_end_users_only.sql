-- 0005: the profile privilege guard (0004) only restricts end-user requests.
-- It also blocked direct database sessions (Supabase SQL editor, migrations, seed scripts), which
-- carry no user JWT. Admins acting through the app and the service role were already allowed.

create or replace function protect_profile_privileges()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.is_banned is distinct from old.is_banned)
     and coalesce(auth.role(), '') in ('anon', 'authenticated')
     and not is_admin() then
    raise exception 'role and is_banned can only be changed by an admin';
  end if;
  return new;
end
$$;
