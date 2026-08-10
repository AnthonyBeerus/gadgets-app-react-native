-- Campaign media storage.
--
-- Fixes a live exposure first. 20260730120000 tried to drop the permissive submission
-- policies, but it used the names "Anyone can view challenge submissions" /
-- "Authenticated users can upload challenge submissions" while 20260618121254 had
-- actually created them as "Public read challenge submission media" /
-- "Authenticated upload challenge submission media". Both DROPs were no-ops.
-- Flipping buckets.public = false only removed the CDN path -- the FOR SELECT TO public
-- policy still lets anon read every submission object through the storage API, and the
-- INSERT policy lets any authenticated user write anywhere in the bucket.
--
-- Path conventions (relied on by the policies below):
--   challenge-submissions : {challengeId}/{profileId}/{uuid}.{ext}
--   campaign-assets       : {shopId}/{challengeId}/{uuid}.{ext}

begin;

-- ---------------------------------------------------------------------------
-- challenge-submissions: creator uploads, readable by the creator and the merchant
-- ---------------------------------------------------------------------------

drop policy if exists "Public read challenge submission media" on storage.objects;
drop policy if exists "Authenticated upload challenge submission media" on storage.objects;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'challenge-submissions',
  'challenge-submissions',
  false,
  209715200, -- 200MB
  array['video/mp4','video/quicktime','image/jpeg','image/png','image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Creators upload their own submission media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'challenge-submissions'
    and (storage.foldername(name))[2] = (select private.current_profile_id())::text
  );

create policy "Creators and reviewing merchants read submission media" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'challenge-submissions'
    and (
      (storage.foldername(name))[2] = (select private.current_profile_id())::text
      or public.can_manage_challenge(((storage.foldername(name))[1])::bigint)
    )
  );

create policy "Creators update their own submission media" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'challenge-submissions'
    and (storage.foldername(name))[2] = (select private.current_profile_id())::text
  )
  with check (
    bucket_id = 'challenge-submissions'
    and (storage.foldername(name))[2] = (select private.current_profile_id())::text
  );

create policy "Creators delete their own submission media" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'challenge-submissions'
    and (storage.foldername(name))[2] = (select private.current_profile_id())::text
  );

-- ---------------------------------------------------------------------------
-- campaign-assets: merchant brand material, public read
-- ---------------------------------------------------------------------------
-- Public because creators browse briefs before signing in, and the whole point of a
-- brand asset is to be seen. Writes stay scoped to the shop owner.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'campaign-assets',
  'campaign-assets',
  true,
  52428800, -- 50MB
  array['image/jpeg','image/png','image/webp','image/svg+xml','video/mp4','application/pdf']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read campaign assets" on storage.objects;
drop policy if exists "Shop owners write campaign assets" on storage.objects;
drop policy if exists "Shop owners update campaign assets" on storage.objects;
drop policy if exists "Shop owners delete campaign assets" on storage.objects;

create policy "Public read campaign assets" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'campaign-assets');

create policy "Shop owners write campaign assets" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'campaign-assets'
    and exists (
      select 1 from public.shops s
      where s.id = ((storage.foldername(name))[1])::bigint
        and s.owner_id = (select private.current_profile_id())
    )
  );

create policy "Shop owners update campaign assets" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'campaign-assets'
    and exists (
      select 1 from public.shops s
      where s.id = ((storage.foldername(name))[1])::bigint
        and s.owner_id = (select private.current_profile_id())
    )
  )
  with check (
    bucket_id = 'campaign-assets'
    and exists (
      select 1 from public.shops s
      where s.id = ((storage.foldername(name))[1])::bigint
        and s.owner_id = (select private.current_profile_id())
    )
  );

create policy "Shop owners delete campaign assets" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'campaign-assets'
    and exists (
      select 1 from public.shops s
      where s.id = ((storage.foldername(name))[1])::bigint
        and s.owner_id = (select private.current_profile_id())
    )
  );

commit;
