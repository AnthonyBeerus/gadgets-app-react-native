-- Clerk identity repair for the campaign surface.
--
-- Identity moved to Clerk in 20260809131639, but only public.users and public.shops
-- were migrated to Clerk predicates. Everything on the campaign surface still called
-- auth.uid(), which under a Clerk JWT casts a 'user_2xyz...' subject to uuid and RAISES.
-- Net effect today: a merchant cannot insert a campaign at all.
--
-- Verified against the live schema before writing:
--   * No foreign keys to auth.* exist anywhere. challenge_submissions.user_id and
--     .reviewed_by carry no FK at all, so we add them against public.users here.
--   * public.challenge_submissions is empty (0 rows), so the new FKs need no backfill.

begin;

-- ---------------------------------------------------------------------------
-- Identity helpers
-- ---------------------------------------------------------------------------

-- Was: users.id = auth.uid() and type = 'ADMIN'. Both halves are wrong under Clerk --
-- auth.uid() raises, and the Muse role lives in users.role as 'OPERATOR'.
-- The name is kept so every existing caller inherits the fix.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select coalesce(
    (select role = 'OPERATOR' from public.users where clerk_user_id = auth.jwt() ->> 'sub' limit 1),
    false
  );
$$;

-- Was: s.owner_id = auth.uid().
create or replace function public.can_manage_challenge(p_challenge_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select private.is_admin()
    or exists (
      select 1
      from public.challenges c
      join public.shops s on s.id = c.shop_id
      where c.id = p_challenge_id
        and s.owner_id = (select private.current_profile_id())
    );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;
revoke all on function public.can_manage_challenge(bigint) from public;
grant execute on function public.can_manage_challenge(bigint) to authenticated;

-- ---------------------------------------------------------------------------
-- Referential integrity against public.users (the Clerk profile table)
-- ---------------------------------------------------------------------------

delete from public.challenge_submissions
where user_id not in (select id from public.users);

delete from public.reward_vouchers
where user_id not in (select id from public.users);

delete from public.creator_opportunity_preferences
where user_id not in (select id from public.users);

delete from public.creator_opportunity_events
where user_id not in (select id from public.users);

alter table public.challenge_submissions
  drop constraint if exists challenge_submissions_user_id_fkey,
  drop constraint if exists challenge_submissions_reviewed_by_fkey;
alter table public.challenge_submissions
  add constraint challenge_submissions_user_id_fkey
    foreign key (user_id) references public.users(id) on delete cascade,
  add constraint challenge_submissions_reviewed_by_fkey
    foreign key (reviewed_by) references public.users(id) on delete set null;

alter table public.reward_vouchers
  drop constraint if exists reward_vouchers_user_id_fkey,
  drop constraint if exists reward_vouchers_redeemed_by_fkey;
alter table public.reward_vouchers
  add constraint reward_vouchers_user_id_fkey
    foreign key (user_id) references public.users(id) on delete cascade,
  add constraint reward_vouchers_redeemed_by_fkey
    foreign key (redeemed_by) references public.users(id) on delete set null;

alter table public.creator_opportunity_preferences
  drop constraint if exists creator_opportunity_preferences_user_id_fkey;
alter table public.creator_opportunity_preferences
  add constraint creator_opportunity_preferences_user_id_fkey
    foreign key (user_id) references public.users(id) on delete cascade;

alter table public.creator_opportunity_events
  drop constraint if exists creator_opportunity_events_user_id_fkey;
alter table public.creator_opportunity_events
  add constraint creator_opportunity_events_user_id_fkey
    foreign key (user_id) references public.users(id) on delete cascade;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

-- challenges: split the old FOR ALL policy so anon keeps public read while writes
-- are scoped to the Clerk profile that owns the shop.
drop policy if exists "Shop owners can manage challenges" on public.challenges;
drop policy if exists "Anyone can view challenges" on public.challenges;

create policy "Public read published campaigns" on public.challenges
  for select to anon, authenticated
  using (
    status <> 'draft'
    or exists (
      select 1 from public.shops s
      where s.id = challenges.shop_id
        and s.owner_id = (select private.current_profile_id())
    )
    or private.is_admin()
  );

create policy "Shop owners insert campaigns" on public.challenges
  for insert to authenticated
  with check (
    exists (
      select 1 from public.shops s
      where s.id = challenges.shop_id
        and s.owner_id = (select private.current_profile_id())
    )
  );

create policy "Shop owners update campaigns" on public.challenges
  for update to authenticated
  using (public.can_manage_challenge(id))
  with check (public.can_manage_challenge(id));

create policy "Shop owners delete campaigns" on public.challenges
  for delete to authenticated
  using (public.can_manage_challenge(id));

-- challenge_submissions: own rows, or the merchant who owns the campaign, or admin.
drop policy if exists "Users admins and merchants read relevant submissions" on public.challenge_submissions;
drop policy if exists "Users can update their own submissions" on public.challenge_submissions;
drop policy if exists "Users can delete their own submissions" on public.challenge_submissions;

create policy "Read own or managed submissions" on public.challenge_submissions
  for select to authenticated
  using (
    user_id = (select private.current_profile_id())
    or public.can_manage_challenge(challenge_id)
  );

create policy "Creators update their own submissions" on public.challenge_submissions
  for update to authenticated
  using (user_id = (select private.current_profile_id()))
  with check (user_id = (select private.current_profile_id()));

create policy "Creators delete their own submissions" on public.challenge_submissions
  for delete to authenticated
  using (user_id = (select private.current_profile_id()));

commit;
