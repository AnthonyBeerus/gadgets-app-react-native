begin;

-- Clerk is the identity provider. Public UUIDs remain stable internal foreign keys.
alter table public.users drop constraint if exists users_id_fkey;
alter table public.users alter column id set default gen_random_uuid();
alter table public.users alter column avatar_url drop not null;
alter table public.users add column if not exists clerk_user_id text;
alter table public.users add column if not exists role text not null default 'CREATOR';
alter table public.users drop constraint if exists users_type_check;
alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check
  check (role in ('CREATOR', 'MERCHANT', 'OPERATOR'));
create unique index if not exists users_clerk_user_id_key
  on public.users(clerk_user_id) where clerk_user_id is not null;

create schema if not exists private;

create or replace function private.current_profile_id()
returns uuid
language sql stable security definer
set search_path = public, pg_catalog
as $$
  select id from public.users where clerk_user_id = auth.jwt()->>'sub' limit 1;
$$;

create or replace function private.current_muse_role()
returns text
language sql stable security definer
set search_path = public, pg_catalog
as $$
  select role from public.users where clerk_user_id = auth.jwt()->>'sub' limit 1;
$$;

revoke all on function private.current_profile_id() from public, anon;
revoke all on function private.current_muse_role() from public, anon;
grant execute on function private.current_profile_id() to authenticated;
grant execute on function private.current_muse_role() to authenticated;

create or replace function public.ensure_clerk_profile(
  p_email text,
  p_full_name text default null,
  p_avatar_url text default null
) returns public.users
language plpgsql security definer
set search_path = public, pg_catalog
as $$
declare
  clerk_subject text := auth.jwt()->>'sub';
  profile public.users;
begin
  if clerk_subject is null or clerk_subject = '' then raise exception 'Not authenticated'; end if;
  if p_email is null or btrim(p_email) = '' then raise exception 'A verified email is required'; end if;

  insert into public.users (clerk_user_id, email, avatar_url, full_name, role, type)
  values (clerk_subject, lower(btrim(p_email)), coalesce(p_avatar_url, ''), p_full_name, 'CREATOR', 'USER')
  on conflict (clerk_user_id) where clerk_user_id is not null
  do update set
    email = excluded.email,
    avatar_url = excluded.avatar_url,
    full_name = coalesce(excluded.full_name, users.full_name)
  returning * into profile;
  return profile;
end;
$$;

revoke all on function public.ensure_clerk_profile(text, text, text) from public, anon;
grant execute on function public.ensure_clerk_profile(text, text, text) to authenticated;

drop policy if exists "Clerk users read own profile" on public.users;
create policy "Clerk users read own profile" on public.users
for select to authenticated
using (id = (select private.current_profile_id()));

drop policy if exists "Clerk users update own profile" on public.users;
create policy "Clerk users update own profile" on public.users
for update to authenticated
using (id = (select private.current_profile_id()))
with check (
  id = (select private.current_profile_id())
  and role = (select private.current_muse_role())
);

commit;
