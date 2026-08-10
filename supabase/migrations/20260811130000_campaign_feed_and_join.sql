-- Creator campaign flow: browse, join, submit, track.
--
-- The old feed joined public.product and lateraled onto purchase_proofs because entry
-- required buying a qualifying SKU. Entry is now open, so both go away -- which also
-- unblocks the commerce teardown, since the feed was the last campaign-side reader of
-- the product tables.

begin;

-- ---------------------------------------------------------------------------
-- Feed
-- ---------------------------------------------------------------------------

drop function if exists public.get_creator_opportunity_feed(integer, integer, bigint, text);
drop function if exists public.get_saved_creator_opportunities();
drop function if exists public.get_creator_opportunity_results(bigint);
drop function if exists public.set_creator_opportunity_preference(bigint, text);
drop function if exists public.record_creator_opportunity_event(bigint, text, text);

create or replace function public.get_creator_opportunity_feed(
  p_cursor integer default 0,
  p_limit integer default 20,
  p_mall_id bigint default null,
  p_seed text default null
) returns table (
  id bigint,
  title text,
  description text,
  brand_name text,
  brand_logo_url text,
  image_url text,
  brand_asset_paths text[],
  category text,
  campaign_goal text,
  content_format text,
  deliverable_count integer,
  video_min_seconds integer,
  video_max_seconds integer,
  requirements text[],
  talking_points text[],
  dos text[],
  donts text[],
  usage_rights text,
  revisions_allowed integer,
  review_sla_days integer,
  deadline timestamptz,
  pot_value numeric,
  pot_currency text,
  pot_splits jsonb,
  shop_id bigint,
  status text,
  participants_count bigint,
  has_joined boolean,
  my_submission_status text,
  preference_state text
)
language sql stable security definer set search_path = public, pg_catalog
as $$
  with me as (select private.current_profile_id() as profile_id)
  select
    c.id, c.title, c.description, c.brand_name, c.brand_logo_url, c.image_url,
    c.brand_asset_paths, c.category, c.campaign_goal, c.content_format,
    c.deliverable_count, c.video_min_seconds, c.video_max_seconds,
    c.requirements, c.talking_points, c.dos, c.donts,
    c.usage_rights, c.revisions_allowed, c.review_sla_days,
    c.deadline, c.pot_value, c.pot_currency, c.pot_splits,
    c.shop_id, c.status,
    coalesce(entries.total, 0) as participants_count,
    mine.id is not null as has_joined,
    mine.status as my_submission_status,
    pref.state as preference_state
  from public.challenges c
  join public.shops s on s.id = c.shop_id
  cross join me
  left join lateral (
    select count(*) as total
    from public.challenge_submissions cs
    where cs.challenge_id = c.id and cs.status <> 'draft'
  ) entries on true
  left join lateral (
    select cs.id, cs.status
    from public.challenge_submissions cs
    where cs.challenge_id = c.id and cs.user_id = me.profile_id
    limit 1
  ) mine on true
  left join lateral (
    select p.state
    from public.creator_opportunity_preferences p
    where p.opportunity_id = c.id and p.user_id = me.profile_id
    limit 1
  ) pref on true
  where c.status = 'published'
    and c.deadline > now()
    and (p_mall_id is null or s.mall_id = p_mall_id)
    and coalesce(pref.state, '') <> 'dismissed'
  order by
    -- Stable per-session shuffle so the deck is not identical on every open, while
    -- staying deterministic within a session for cursor paging.
    case when p_seed is null then 0 else ('x' || substr(md5(p_seed || c.id::text), 1, 8))::bit(32)::bigint end,
    c.deadline asc,
    c.id asc
  offset greatest(coalesce(p_cursor, 0), 0)
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

create or replace function public.get_saved_creator_opportunities()
returns setof public.challenges
language sql stable security definer set search_path = public, pg_catalog
as $$
  select c.*
  from public.challenges c
  join public.creator_opportunity_preferences p on p.opportunity_id = c.id
  where p.user_id = (select private.current_profile_id())
    and p.state = 'saved'
    and c.status = 'published'
  order by c.deadline asc;
$$;

create or replace function public.set_creator_opportunity_preference(
  p_opportunity_id bigint,
  p_state text
) returns void
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare me uuid := private.current_profile_id();
begin
  if me is null then raise exception 'Sign in to save campaigns'; end if;
  if p_state not in ('saved','dismissed') then
    raise exception 'Preference must be saved or dismissed';
  end if;
  if not exists (select 1 from public.challenges where id = p_opportunity_id) then
    raise exception 'Campaign not found';
  end if;

  insert into public.creator_opportunity_preferences(user_id, opportunity_id, state)
  values (me, p_opportunity_id, p_state)
  on conflict (user_id, opportunity_id) do update set state = excluded.state;
end;
$$;

create or replace function public.record_creator_opportunity_event(
  p_opportunity_id bigint,
  p_event_type text,
  p_source text
) returns void
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare me uuid := private.current_profile_id();
begin
  if me is null then return; end if;
  insert into public.creator_opportunity_events(user_id, opportunity_id, event_type, source)
  values (me, p_opportunity_id, p_event_type, p_source);
end;
$$;

-- ---------------------------------------------------------------------------
-- Join and submit
-- ---------------------------------------------------------------------------

-- Open join. The draft submission row IS the "joined" record, which is what makes
-- status tracking work without a separate participants table.
create or replace function public.join_campaign(p_challenge_id bigint)
returns public.challenge_submissions
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare me uuid := private.current_profile_id(); c public.challenges; s public.challenge_submissions;
begin
  if me is null then raise exception 'Sign in to join this campaign'; end if;

  select * into c from public.challenges where id = p_challenge_id;
  if not found then raise exception 'Campaign not found'; end if;
  if c.status <> 'published' then raise exception 'This campaign is not accepting entries'; end if;
  if c.deadline <= now() then raise exception 'This campaign has closed'; end if;

  insert into public.challenge_submissions(challenge_id, user_id, status)
  values (c.id, me, 'draft')
  on conflict (challenge_id, user_id) do nothing;

  select * into s from public.challenge_submissions
  where challenge_id = c.id and user_id = me;

  return s;
end;
$$;

create or replace function public.submit_campaign_entry(
  p_challenge_id bigint,
  p_asset_paths text[],
  p_asset_meta jsonb default '[]'::jsonb,
  p_caption text default null,
  p_public_share_url text default null,
  p_consent_version text default null
) returns public.challenge_submissions
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare
  me uuid := private.current_profile_id();
  c public.challenges;
  s public.challenge_submissions;
  path text;
  expected_prefix text;
  supplied integer := coalesce(array_length(p_asset_paths, 1), 0);
begin
  if me is null then raise exception 'Sign in to submit'; end if;

  select * into c from public.challenges where id = p_challenge_id;
  if not found then raise exception 'Campaign not found'; end if;
  if c.status <> 'published' then raise exception 'This campaign is not accepting entries'; end if;
  if c.deadline <= now() then raise exception 'This campaign has closed'; end if;

  if supplied < c.deliverable_count then
    raise exception 'This campaign asks for % file(s); you attached %', c.deliverable_count, supplied;
  end if;

  -- Storage RLS already stops a creator uploading outside their own folder, but the
  -- submission row is a separate write -- without this, a creator could claim a path
  -- someone else uploaded. Every path must exist and live under {challenge}/{me}/.
  expected_prefix := p_challenge_id::text || '/' || me::text || '/';
  foreach path in array p_asset_paths loop
    if position(expected_prefix in path) <> 1 then
      raise exception 'Asset % does not belong to this entry', path;
    end if;
    if not exists (
      select 1 from storage.objects
      where bucket_id = 'challenge-submissions' and name = path
    ) then
      raise exception 'Asset % was not uploaded', path;
    end if;
  end loop;

  select * into s from public.challenge_submissions
  where challenge_id = c.id and user_id = me for update;

  if not found then
    insert into public.challenge_submissions(challenge_id, user_id, status)
    values (c.id, me, 'draft')
    returning * into s;
  end if;

  if s.status not in ('draft','revision_requested') then
    raise exception 'Your entry is already % and cannot be resubmitted', s.status;
  end if;

  update public.challenge_submissions
  set asset_paths = p_asset_paths,
      asset_meta = coalesce(p_asset_meta, '[]'::jsonb),
      thumbnail_path = p_asset_paths[1],
      media_type = case when coalesce(p_asset_meta -> 0 ->> 'mime', '') like 'video/%' then 'video' else 'image' end,
      caption = nullif(trim(p_caption), ''),
      public_share_url = nullif(trim(p_public_share_url), ''),
      consent_version = p_consent_version,
      consented_at = case when p_consent_version is not null then now() else consented_at end,
      status = 'submitted',
      submitted_at = now(),
      revision_count = case when s.status = 'revision_requested' then s.revision_count + 1 else s.revision_count end,
      merchant_note = null,
      rejection_reason = null
  where id = s.id
  returning * into s;

  return s;
end;
$$;

-- ---------------------------------------------------------------------------
-- Merchant-facing results summary
-- ---------------------------------------------------------------------------

create or replace function public.get_campaign_results(p_challenge_id bigint)
returns jsonb
language sql stable security definer set search_path = public, pg_catalog
as $$
  select jsonb_build_object(
    'challenge_id', p_challenge_id,
    'entries', count(*) filter (where status <> 'draft'),
    'submitted', count(*) filter (where status in ('submitted','under_review')),
    'revision_requested', count(*) filter (where status = 'revision_requested'),
    'approved', count(*) filter (where status = 'approved'),
    'rejected', count(*) filter (where status = 'rejected'),
    'winners', count(*) filter (where final_rank is not null)
  )
  from public.challenge_submissions
  where challenge_id = p_challenge_id
    and public.can_manage_challenge(p_challenge_id);
$$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant execute on function public.get_creator_opportunity_feed(integer, integer, bigint, text) to anon, authenticated;
grant execute on function public.get_saved_creator_opportunities() to authenticated;
grant execute on function public.set_creator_opportunity_preference(bigint, text) to authenticated;
grant execute on function public.record_creator_opportunity_event(bigint, text, text) to authenticated;

revoke all on function public.join_campaign(bigint) from public;
revoke all on function public.submit_campaign_entry(bigint, text[], jsonb, text, text, text) from public;
revoke all on function public.get_campaign_results(bigint) from public;
grant execute on function public.join_campaign(bigint) to authenticated;
grant execute on function public.submit_campaign_entry(bigint, text[], jsonb, text, text, text) to authenticated;
grant execute on function public.get_campaign_results(bigint) to authenticated;

commit;
