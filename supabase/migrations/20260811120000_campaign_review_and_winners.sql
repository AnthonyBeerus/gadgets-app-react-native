-- Merchant campaign lifecycle: publish, review, pick winners, settle.
--
-- Replaces the engagement-ranked settle path with explicit merchant judgement.
-- The 40/25/15/10/10 pot split and the reward_vouchers payout rail are unchanged --
-- only the input to the ranking changes, from `likes + 3*comments + 2*saves` to the
-- order the merchant chose.

begin;

-- ---------------------------------------------------------------------------
-- Retire the purchase-proof / TikTok-metrics era
-- ---------------------------------------------------------------------------

-- Signatures verified against pg_proc before writing; a wrong arg list makes
-- `drop function if exists` a silent no-op and leaves the old RPC callable.
drop function if exists public.review_creator_submission(bigint, text, text);
drop function if exists public.mark_submission_manually_verified(bigint);
drop function if exists public.submit_creator_opportunity(
  bigint, bigint, bigint, text, text, text, text, timestamptz, text, text
);
drop function if exists public.refresh_submission_metrics(bigint, integer, integer, integer, integer);
drop function if exists public.get_challenge_leaderboard(bigint);
drop function if exists public.settle_competitive_challenge(bigint);
drop function if exists public.compute_engagement_score(integer, integer, integer);

-- ---------------------------------------------------------------------------
-- publish / close
-- ---------------------------------------------------------------------------

create or replace function public.publish_campaign(p_challenge_id bigint)
returns public.challenges
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare c public.challenges; split_total numeric;
begin
  if not public.can_manage_challenge(p_challenge_id) then
    raise exception 'Merchant or Muse admin access required';
  end if;

  select * into c from public.challenges where id = p_challenge_id for update;
  if not found then raise exception 'Campaign not found'; end if;
  if c.status = 'published' then return c; end if;
  if c.status <> 'draft' then
    raise exception 'Only a draft campaign can be published (this one is %)', c.status;
  end if;

  if coalesce(trim(c.title), '') = '' then raise exception 'Campaign needs a title'; end if;
  if coalesce(trim(c.description), '') = '' then raise exception 'Campaign needs a brief'; end if;
  if c.deadline is null or c.deadline <= now() then
    raise exception 'Campaign deadline must be in the future';
  end if;
  if c.pot_value is null or c.pot_value <= 0 then
    raise exception 'Campaign needs a funded prize pot';
  end if;
  if coalesce(array_length(c.brand_asset_paths, 1), 0) = 0 then
    raise exception 'Add at least one brand asset so creators know what to make';
  end if;

  select sum(value::numeric) into split_total
  from jsonb_each_text(c.pot_splits);
  if split_total is null or round(split_total, 4) <> 1.0 then
    raise exception 'Prize splits must total 100%% (got %)', coalesce(split_total, 0) * 100;
  end if;

  update public.challenges
  set status = 'published', published_at = now(), updated_at = now()
  where id = c.id
  returning * into c;

  return c;
end;
$$;

create or replace function public.close_campaign(p_challenge_id bigint)
returns public.challenges
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare c public.challenges;
begin
  if not public.can_manage_challenge(p_challenge_id) then
    raise exception 'Merchant or Muse admin access required';
  end if;

  select * into c from public.challenges where id = p_challenge_id for update;
  if not found then raise exception 'Campaign not found'; end if;
  if c.status = 'closed' then return c; end if;
  if c.status <> 'published' then
    raise exception 'Only a published campaign can be closed (this one is %)', c.status;
  end if;

  update public.challenges
  set status = 'closed', closed_at = now(), updated_at = now()
  where id = c.id
  returning * into c;

  return c;
end;
$$;

-- ---------------------------------------------------------------------------
-- review
-- ---------------------------------------------------------------------------

-- No verification_status gate: that was a TikTok API concept and submissions are now
-- uploaded assets. Mints no vouchers either -- payout happens at winner selection, so
-- approving is purely a quality/rights judgement.
create or replace function public.review_campaign_submission(
  p_submission_id bigint,
  p_decision text,
  p_note text default null
) returns public.challenge_submissions
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare s public.challenge_submissions; c public.challenges;
begin
  if p_decision not in ('approved','rejected','revision_requested') then
    raise exception 'Decision must be approved, rejected or revision_requested';
  end if;

  select * into s from public.challenge_submissions where id = p_submission_id for update;
  if not found then raise exception 'Submission not found'; end if;

  if not public.can_manage_challenge(s.challenge_id) then
    raise exception 'Merchant or Muse admin access required';
  end if;

  if s.status not in ('submitted','under_review') then
    raise exception 'Only a submitted entry can be reviewed (this one is %)', s.status;
  end if;

  select * into c from public.challenges where id = s.challenge_id;

  if p_decision = 'revision_requested' then
    if s.revision_count >= c.revisions_allowed then
      raise exception 'This campaign allows % revision(s) and the creator has used them', c.revisions_allowed;
    end if;
    if coalesce(trim(p_note), '') = '' then
      raise exception 'Tell the creator what to change';
    end if;
  end if;

  update public.challenge_submissions
  set status = p_decision,
      merchant_note = nullif(trim(p_note), ''),
      rejection_reason = case when p_decision = 'rejected' then nullif(trim(p_note), '') else null end,
      reviewed_by = (select private.current_profile_id()),
      reviewed_at = now()
  where id = s.id
  returning * into s;

  return s;
end;
$$;

-- ---------------------------------------------------------------------------
-- winners
-- ---------------------------------------------------------------------------

-- Only the ranks that actually have a winner share the pot. Paying a raw 40/25/15 to
-- three winners would silently strand 20% of merchant-funded money, so the occupied
-- splits are renormalised to 1.0 first. src/features/campaigns/domain/winner-selection.ts
-- mirrors this exactly so the preview the merchant confirms is what gets paid.
create or replace function public.campaign_prize_for_rank(
  p_pot_value numeric,
  p_pot_splits jsonb,
  p_rank integer,
  p_winner_count integer
) returns numeric
language sql immutable set search_path = public, pg_catalog
as $$
  select round(
    p_pot_value
      * coalesce((p_pot_splits ->> p_rank::text)::numeric, 0)
      / nullif((
          select sum(coalesce((p_pot_splits ->> gs::text)::numeric, 0))
          from generate_series(1, p_winner_count) gs
        ), 0),
    2
  );
$$;

create or replace function public.select_campaign_winners(
  p_challenge_id bigint,
  p_ranked_submission_ids bigint[]
) returns jsonb
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare
  c public.challenges;
  n integer := coalesce(array_length(p_ranked_submission_ids, 1), 0);
  eligible integer;
  preview jsonb;
begin
  if not public.can_manage_challenge(p_challenge_id) then
    raise exception 'Merchant or Muse admin access required';
  end if;

  select * into c from public.challenges where id = p_challenge_id for update;
  if not found then raise exception 'Campaign not found'; end if;
  if c.status <> 'closed' then
    raise exception 'Close the campaign before picking winners (this one is %)', c.status;
  end if;

  if n < 1 or n > 5 then raise exception 'Pick between 1 and 5 winners'; end if;
  if n <> (select count(distinct x) from unnest(p_ranked_submission_ids) as x) then
    raise exception 'A submission cannot win two places';
  end if;

  select count(*) into eligible
  from public.challenge_submissions
  where id = any(p_ranked_submission_ids)
    and challenge_id = c.id
    and status = 'approved';
  if eligible <> n then
    raise exception 'Every winner must be an approved entry on this campaign';
  end if;

  -- Reassign from scratch so re-picking is idempotent rather than additive.
  update public.challenge_submissions
  set final_rank = null
  where challenge_id = c.id and final_rank is not null;

  update public.challenge_submissions cs
  set final_rank = ranked.rank
  from (
    select id, ordinality::integer as rank
    from unnest(p_ranked_submission_ids) with ordinality as t(id, ordinality)
  ) ranked
  where cs.id = ranked.id;

  select jsonb_agg(
    jsonb_build_object(
      'rank', cs.final_rank,
      'submission_id', cs.id,
      'user_id', cs.user_id,
      'prize_value', public.campaign_prize_for_rank(c.pot_value, c.pot_splits, cs.final_rank, n),
      'currency', c.pot_currency
    ) order by cs.final_rank
  ) into preview
  from public.challenge_submissions cs
  where cs.challenge_id = c.id and cs.final_rank is not null;

  return jsonb_build_object(
    'challenge_id', c.id,
    'pot_value', c.pot_value,
    'currency', c.pot_currency,
    'winners', coalesce(preview, '[]'::jsonb)
  );
end;
$$;

create or replace function public.settle_campaign(p_challenge_id bigint)
returns jsonb
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare
  c public.challenges;
  w record;
  prize_value numeric;
  code text;
  issued integer := 0;
  winner_count integer;
begin
  if not public.can_manage_challenge(p_challenge_id) then
    raise exception 'Merchant or Muse admin access required';
  end if;

  select * into c from public.challenges where id = p_challenge_id for update;
  if not found then raise exception 'Campaign not found'; end if;
  if c.settled_at is not null then
    return jsonb_build_object('challenge_id', c.id, 'settled', true, 'idempotent', true);
  end if;
  if c.status <> 'closed' then
    raise exception 'Close the campaign before settling (this one is %)', c.status;
  end if;
  select count(*) into winner_count
  from public.challenge_submissions
  where challenge_id = c.id and final_rank is not null;

  if winner_count = 0 then
    raise exception 'Pick winners before settling';
  end if;

  for w in
    select id, user_id, final_rank
    from public.challenge_submissions
    where challenge_id = c.id and final_rank is not null
    order by final_rank
  loop
    prize_value := public.campaign_prize_for_rank(c.pot_value, c.pot_splits, w.final_rank, winner_count);
    continue when prize_value is null or prize_value <= 0;

    code := upper(substr(md5(random()::text || clock_timestamp()::text || w.id::text), 1, 10));

    insert into public.reward_vouchers(
      submission_id, shop_id, user_id, code, value, currency, expires_at, prize_kind, placement_rank
    )
    values (
      w.id, c.shop_id, w.user_id, code, prize_value, c.pot_currency,
      now() + make_interval(days => c.voucher_valid_days), 'placement', w.final_rank
    )
    on conflict (submission_id) do nothing;

    if found then issued := issued + 1; end if;
  end loop;

  update public.challenges
  set status = 'settled', settled_at = now(), updated_at = now()
  where id = c.id;

  return jsonb_build_object(
    'challenge_id', c.id,
    'settled', true,
    'idempotent', false,
    'vouchers_issued', issued
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

revoke all on function public.campaign_prize_for_rank(numeric, jsonb, integer, integer) from public;
grant execute on function public.campaign_prize_for_rank(numeric, jsonb, integer, integer) to authenticated;

revoke all on function public.publish_campaign(bigint) from public;
revoke all on function public.close_campaign(bigint) from public;
revoke all on function public.review_campaign_submission(bigint, text, text) from public;
revoke all on function public.select_campaign_winners(bigint, bigint[]) from public;
revoke all on function public.settle_campaign(bigint) from public;

grant execute on function public.publish_campaign(bigint) to authenticated;
grant execute on function public.close_campaign(bigint) to authenticated;
grant execute on function public.review_campaign_submission(bigint, text, text) to authenticated;
grant execute on function public.select_campaign_winners(bigint, bigint[]) to authenticated;
grant execute on function public.settle_campaign(bigint) to authenticated;

commit;
