begin;

alter table public.shops enable row level security;

drop policy if exists "Public can view shops" on public.shops;
drop policy if exists "Public can view active shops" on public.shops;
drop policy if exists "Owners and Admins can manage shops" on public.shops;
drop policy if exists "Owners and Admins can update shops" on public.shops;
drop policy if exists "Owners and Admins can delete shops" on public.shops;
drop policy if exists "Owners can insert shops" on public.shops;
drop policy if exists "Owners can update shops" on public.shops;
drop policy if exists "Owners can delete shops" on public.shops;

create policy "Public reads active shops"
on public.shops
for select
to anon
using (is_active = true);

create policy "Clerk users read active or owned shops"
on public.shops
for select
to authenticated
using (is_active = true or owner_id = (select private.current_profile_id()));

create policy "Clerk merchants create owned shops"
on public.shops
for insert
to authenticated
with check (
  owner_id = (select private.current_profile_id())
  or (select private.current_muse_role()) = 'OPERATOR'
);

create policy "Clerk merchants update owned shops"
on public.shops
for update
to authenticated
using (
  owner_id = (select private.current_profile_id())
  or (select private.current_muse_role()) = 'OPERATOR'
)
with check (
  owner_id = (select private.current_profile_id())
  or (select private.current_muse_role()) = 'OPERATOR'
);

create policy "Clerk merchants delete owned shops"
on public.shops
for delete
to authenticated
using (
  owner_id = (select private.current_profile_id())
  or (select private.current_muse_role()) = 'OPERATOR'
);

commit;
