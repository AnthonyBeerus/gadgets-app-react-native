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
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select id from public.users where clerk_user_id = auth.jwt()->>'sub' limit 1;
$$;

create or replace function private.current_muse_role()
returns text
language sql
stable
security definer
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
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  clerk_subject text := auth.jwt()->>'sub';
  profile public.users;
begin
  if clerk_subject is null or clerk_subject = '' then
    raise exception 'Not authenticated';
  end if;
  if p_email is null or btrim(p_email) = '' then
    raise exception 'A verified email is required';
  end if;

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

create table if not exists public.creator_opportunities (
  id uuid primary key default gen_random_uuid(),
  shop_id bigint not null references public.shops(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 90),
  brief text not null check (char_length(brief) between 20 and 2000),
  image_url text,
  accepted_entry_fee_minor integer not null check (accepted_entry_fee_minor >= 0),
  maximum_accepted_entries integer not null check (maximum_accepted_entries between 1 and 10000),
  prize_pot_minor integer not null check (prize_pot_minor > 0),
  prize_splits smallint[] not null default array[40,25,15,10,10],
  currency text not null default 'BWP' check (currency = 'BWP'),
  status text not null default 'DRAFT'
    check (status in ('DRAFT','AWAITING_FUNDING','AWAITING_APPROVAL','LIVE','JUDGING','SETTLED','CANCELLED')),
  stripe_payment_intent_id text unique,
  funded_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz not null,
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_opportunity_splits_check check (
    array_length(prize_splits, 1) = 5
    and prize_splits[1] + prize_splits[2] + prize_splits[3] + prize_splits[4] + prize_splits[5] = 100
  ),
  constraint creator_opportunity_funding_state_check check (
    status in ('DRAFT','AWAITING_FUNDING','CANCELLED')
    or (stripe_payment_intent_id is not null and funded_at is not null)
  )
);

create table if not exists public.creator_opportunity_entries (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.creator_opportunities(id) on delete cascade,
  creator_id uuid not null references public.users(id) on delete cascade,
  public_post_url text not null,
  purchase_proof_reference text,
  disclosure_confirmed_at timestamptz not null,
  rights_confirmed_at timestamptz not null,
  status text not null default 'SUBMITTED'
    check (status in ('SUBMITTED','ACCEPTED','REJECTED','WINNER','PAID')),
  rejection_reason text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.users(id),
  unique (opportunity_id, creator_id, public_post_url)
);

create table if not exists public.creator_opportunity_scores (
  entry_id uuid primary key references public.creator_opportunity_entries(id) on delete cascade,
  brief_compliance smallint not null check (brief_compliance between 0 and 30),
  product_clarity smallint not null check (product_clarity between 0 and 25),
  creativity smallint not null check (creativity between 0 and 25),
  technical_brand_safety smallint not null check (technical_brand_safety between 0 and 20),
  engagement_percentile numeric(5,2) not null check (engagement_percentile between 0 and 100),
  final_score numeric(5,2) not null check (final_score between 0 and 100),
  final_rank integer check (final_rank > 0),
  scored_by uuid not null references public.users(id),
  scored_at timestamptz not null default now()
);

create table if not exists public.creator_payouts (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.creator_opportunity_entries(id),
  creator_id uuid not null references public.users(id),
  kind text not null check (kind in ('ACCEPTED_ENTRY_FEE','RANKED_PRIZE')),
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'BWP' check (currency = 'BWP'),
  provider text not null check (provider in ('STRIPE','ORANGE_MONEY')),
  provider_reference text,
  status text not null default 'PENDING'
    check (status in ('PENDING','PROCESSING','PAID','FAILED','CANCELLED')),
  failure_reason text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  unique (entry_id, kind)
);

alter table public.creator_opportunities enable row level security;
alter table public.creator_opportunity_entries enable row level security;
alter table public.creator_opportunity_scores enable row level security;
alter table public.creator_payouts enable row level security;

create policy "Public reads live creator opportunities" on public.creator_opportunities
for select to anon, authenticated
using (status in ('LIVE','JUDGING','SETTLED'));

create policy "Merchants read own creator opportunities" on public.creator_opportunities
for select to authenticated
using (
  created_by = (select private.current_profile_id())
  or (select private.current_muse_role()) = 'OPERATOR'
);

create policy "Merchants create draft creator opportunities" on public.creator_opportunities
for insert to authenticated
with check (
  created_by = (select private.current_profile_id())
  and (select private.current_muse_role()) = 'MERCHANT'
  and status = 'DRAFT'
  and exists (
    select 1 from public.shops
    where id = shop_id and owner_id = (select private.current_profile_id())
  )
);

create policy "Creators manage own submitted entries" on public.creator_opportunity_entries
for insert to authenticated
with check (
  creator_id = (select private.current_profile_id())
  and status = 'SUBMITTED'
  and exists (
    select 1 from public.creator_opportunities
    where id = opportunity_id and status = 'LIVE' and ends_at > now()
  )
);

create policy "Creators read own entries" on public.creator_opportunity_entries
for select to authenticated
using (
  creator_id = (select private.current_profile_id())
  or (select private.current_muse_role()) = 'OPERATOR'
  or exists (
    select 1 from public.creator_opportunities opportunity
    where opportunity.id = opportunity_id
      and opportunity.created_by = (select private.current_profile_id())
  )
);

create policy "Authorized users read scores" on public.creator_opportunity_scores
for select to authenticated
using (
  exists (
    select 1 from public.creator_opportunity_entries entry
    join public.creator_opportunities opportunity on opportunity.id = entry.opportunity_id
    where entry.id = entry_id
      and (
        entry.creator_id = (select private.current_profile_id())
        or opportunity.created_by = (select private.current_profile_id())
        or (select private.current_muse_role()) = 'OPERATOR'
      )
  )
);

create policy "Creators read own payouts" on public.creator_payouts
for select to authenticated
using (
  creator_id = (select private.current_profile_id())
  or (select private.current_muse_role()) = 'OPERATOR'
);

grant select on public.creator_opportunities to anon, authenticated;
grant insert, update on public.creator_opportunities to authenticated;
grant select, insert on public.creator_opportunity_entries to authenticated;
grant select on public.creator_opportunity_scores to authenticated;
grant select on public.creator_payouts to authenticated;

commit;
