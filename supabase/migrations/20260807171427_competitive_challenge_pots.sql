begin;

-- Competitive pot challenges: multi-tier voucher pots, multi-product entry,
-- engagement scoring, consolation prizes, settle flow.

alter table public.challenges
  add column if not exists contest_mode text not null default 'standard'
    check (contest_mode in ('standard', 'competitive_pot')),
  add column if not exists pot_value numeric(12,2),
  add column if not exists pot_currency text not null default 'BWP',
  add column if not exists pot_splits jsonb not null default '{"1":0.4,"2":0.25,"3":0.15,"4":0.1,"5":0.1}'::jsonb,
  add column if not exists score_rule text not null default 'engagement_quality'
    check (score_rule in ('engagement_quality')),
  add column if not exists consolation_voucher_value numeric(12,2),
  add column if not exists settled_at timestamptz;

alter table public.challenges
  drop constraint if exists challenges_competitive_pot_fields_check;
alter table public.challenges
  add constraint challenges_competitive_pot_fields_check check (
    contest_mode <> 'competitive_pot'
    or (
      pot_value is not null and pot_value > 0
      and consolation_voucher_value is not null and consolation_voucher_value >= 0
    )
  );

create table if not exists public.challenge_qualifying_products (
  challenge_id bigint not null references public.challenges(id) on delete cascade,
  product_id bigint not null references public.product(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (challenge_id, product_id)
);

create index if not exists challenge_qualifying_products_product_idx
  on public.challenge_qualifying_products(product_id);

alter table public.challenge_submissions
  add column if not exists like_count integer not null default 0,
  add column if not exists comment_count integer not null default 0,
  add column if not exists save_count integer not null default 0,
  add column if not exists view_count integer not null default 0,
  add column if not exists score numeric(14,2) not null default 0,
  add column if not exists metrics_captured_at timestamptz,
  add column if not exists final_rank integer;

alter table public.reward_vouchers
  add column if not exists prize_kind text not null default 'standard'
    check (prize_kind in ('standard', 'placement', 'consolation')),
  add column if not exists placement_rank integer;

-- Backfill qualifying products from existing single product_id challenges.
insert into public.challenge_qualifying_products(challenge_id, product_id)
select c.id, c.product_id
from public.challenges c
where c.product_id is not null
on conflict do nothing;

alter table public.challenge_qualifying_products enable row level security;

drop policy if exists "Anyone can read qualifying products" on public.challenge_qualifying_products;
create policy "Anyone can read qualifying products"
on public.challenge_qualifying_products for select to anon, authenticated
using (true);

drop policy if exists "Merchants manage qualifying products" on public.challenge_qualifying_products;
create policy "Merchants manage qualifying products"
on public.challenge_qualifying_products for all to authenticated
using (
  private.is_admin()
  or exists (
    select 1 from public.challenges c
    join public.shops s on s.id = c.shop_id
    where c.id = challenge_qualifying_products.challenge_id
      and s.owner_id = (select auth.uid())
  )
)
with check (
  private.is_admin()
  or exists (
    select 1 from public.challenges c
    join public.shops s on s.id = c.shop_id
    where c.id = challenge_qualifying_products.challenge_id
      and s.owner_id = (select auth.uid())
  )
);

create or replace function public.compute_engagement_score(
  p_likes integer, p_comments integer, p_saves integer
) returns numeric language sql immutable as $$
  select greatest(0, coalesce(p_likes,0))::numeric
       + 3 * greatest(0, coalesce(p_comments,0))::numeric
       + 2 * greatest(0, coalesce(p_saves,0))::numeric;
$$;

create or replace function public.can_manage_challenge(p_challenge_id bigint)
returns boolean language sql stable security definer set search_path = public, pg_catalog as $$
  select private.is_admin()
    or exists (
      select 1 from public.challenges c
      join public.shops s on s.id = c.shop_id
      where c.id = p_challenge_id and s.owner_id = auth.uid()
    );
$$;

create or replace function public.submit_creator_opportunity(
  p_challenge_id bigint,
  p_purchase_proof_id bigint,
  p_platform_account_id bigint,
  p_platform_video_id text,
  p_public_share_url text,
  p_platform_author_open_id text,
  p_post_description text,
  p_post_published_at timestamptz,
  p_verification_status text,
  p_consent_version text
) returns public.challenge_submissions
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare result public.challenge_submissions; current_user_id uuid := auth.uid();
begin
  if current_user_id is null then raise exception 'Not authenticated'; end if;
  if p_verification_status not in ('api_verified', 'manual_verification_required') then raise exception 'Invalid verification status'; end if;
  if p_consent_version is null or trim(p_consent_version) = '' then raise exception 'Consent is required'; end if;
  if not exists (
    select 1
    from public.purchase_proofs pp
    join public.challenges c on c.id = p_challenge_id
    where pp.id = p_purchase_proof_id
      and pp.user_id = current_user_id
      and pp.shop_id = c.shop_id
      and pp.consumed_by_submission_id is null
      and (pp.expires_at is null or pp.expires_at > now())
      and (
        pp.product_id = c.product_id
        or exists (
          select 1 from public.challenge_qualifying_products qp
          where qp.challenge_id = c.id and qp.product_id = pp.product_id
        )
      )
  ) then raise exception 'No valid unused purchase proof for this opportunity'; end if;
  if p_platform_account_id is not null and not exists (
    select 1 from public.creator_platform_accounts a
    where a.id = p_platform_account_id and a.user_id = current_user_id
      and a.platform_open_id = p_platform_author_open_id and a.connection_status = 'connected'
  ) then raise exception 'TikTok account ownership could not be verified'; end if;
  if p_verification_status = 'api_verified' and (p_platform_account_id is null or p_platform_video_id is null) then
    raise exception 'API verified submissions require a connected account and video';
  end if;

  insert into public.challenge_submissions (
    challenge_id, user_id, purchase_proof_id, platform_account_id, platform,
    platform_video_id, public_share_url, platform_author_open_id, post_description,
    post_published_at, verification_status, verified_at, consent_version, consented_at,
    status, content_url, media_type
  ) values (
    p_challenge_id, current_user_id, p_purchase_proof_id, p_platform_account_id, 'tiktok',
    nullif(trim(p_platform_video_id), ''), trim(p_public_share_url), nullif(trim(p_platform_author_open_id), ''),
    nullif(trim(p_post_description), ''), p_post_published_at, p_verification_status,
    case when p_verification_status = 'api_verified' then now() else null end,
    p_consent_version, now(), 'pending', null, 'external'
  ) returning * into result;
  return result;
end;
$$;

create or replace function public.review_creator_submission(
  p_submission_id bigint, p_decision text, p_rejection_reason text default null
) returns jsonb
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare s public.challenge_submissions; c public.challenges; voucher public.reward_vouchers;
begin
  if p_decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
  select * into s from public.challenge_submissions where id = p_submission_id for update;
  if not found then raise exception 'Submission not found'; end if;
  if not public.can_manage_challenge(s.challenge_id) then raise exception 'Merchant or Muse admin access required'; end if;
  if s.status <> 'pending' then
    return jsonb_build_object('submission_id', s.id, 'status', s.status, 'idempotent', true);
  end if;
  if p_decision = 'approved' and s.verification_status not in ('api_verified','manually_verified') then
    raise exception 'Submission must be verified before approval';
  end if;
  select * into c from public.challenges where id = s.challenge_id;
  update public.challenge_submissions set status = p_decision,
    rejection_reason = case when p_decision = 'rejected' then nullif(trim(p_rejection_reason),'') else null end,
    reviewed_by = auth.uid(), reviewed_at = now() where id = s.id;
  if p_decision = 'approved' then
    update public.purchase_proofs set consumed_by_submission_id = s.id where id = s.purchase_proof_id and consumed_by_submission_id is null;
    -- Competitive pots issue vouchers at settle, not on approve.
    if coalesce(c.contest_mode, 'standard') = 'standard' then
      insert into public.reward_vouchers(submission_id, shop_id, user_id, code, value, currency, expires_at, prize_kind)
      values (s.id, c.shop_id, s.user_id, upper(substr(md5(random()::text || clock_timestamp()::text || s.id::text),1,10)),
        c.reward_value, c.reward_currency, now() + make_interval(days => c.voucher_valid_days), 'standard')
      on conflict (submission_id) do nothing returning * into voucher;
    end if;
  end if;
  return jsonb_build_object('submission_id', s.id, 'status', p_decision, 'voucher_id', voucher.id, 'idempotent', false);
end;
$$;

create or replace function public.refresh_submission_metrics(
  p_submission_id bigint,
  p_like_count integer,
  p_comment_count integer,
  p_save_count integer,
  p_view_count integer default 0
) returns public.challenge_submissions
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare s public.challenge_submissions; c public.challenges;
begin
  select * into s from public.challenge_submissions where id = p_submission_id for update;
  if not found then raise exception 'Submission not found'; end if;
  if not public.can_manage_challenge(s.challenge_id) then raise exception 'Merchant or Muse admin access required'; end if;
  select * into c from public.challenges where id = s.challenge_id;
  if c.settled_at is not null then raise exception 'Challenge already settled'; end if;
  if greatest(0, coalesce(p_like_count,0)) > 100000000
     or greatest(0, coalesce(p_comment_count,0)) > 100000000
     or greatest(0, coalesce(p_save_count,0)) > 100000000
     or greatest(0, coalesce(p_view_count,0)) > 1000000000 then
    raise exception 'Metric values out of range';
  end if;

  update public.challenge_submissions set
    like_count = greatest(0, coalesce(p_like_count,0)),
    comment_count = greatest(0, coalesce(p_comment_count,0)),
    save_count = greatest(0, coalesce(p_save_count,0)),
    view_count = greatest(0, coalesce(p_view_count,0)),
    score = public.compute_engagement_score(p_like_count, p_comment_count, p_save_count),
    metrics_captured_at = now()
  where id = s.id
  returning * into s;
  return s;
end;
$$;

create or replace function public.get_challenge_leaderboard(p_challenge_id bigint)
returns table(
  submission_id bigint,
  user_id uuid,
  public_share_url text,
  status text,
  like_count integer,
  comment_count integer,
  save_count integer,
  view_count integer,
  score numeric,
  final_rank integer,
  metrics_captured_at timestamptz
)
language plpgsql stable security definer set search_path = public, pg_catalog
as $$
begin
  if not exists (select 1 from public.challenges where id = p_challenge_id) then
    raise exception 'Challenge not found';
  end if;
  return query
  select
    cs.id,
    cs.user_id,
    cs.public_share_url,
    cs.status,
    cs.like_count,
    cs.comment_count,
    cs.save_count,
    cs.view_count,
    cs.score,
    cs.final_rank,
    cs.metrics_captured_at
  from public.challenge_submissions cs
  where cs.challenge_id = p_challenge_id
    and cs.status = 'approved'
  order by
    coalesce(cs.final_rank, 2147483647) asc,
    cs.score desc,
    cs.reviewed_at asc nulls last,
    cs.id asc;
end;
$$;

create or replace function public.settle_competitive_challenge(p_challenge_id bigint)
returns jsonb
language plpgsql security definer set search_path = public, pg_catalog
as $$
declare
  c public.challenges;
  ranked record;
  place integer := 0;
  split_share numeric;
  prize_value numeric;
  vouchers_issued integer := 0;
  consolations_issued integer := 0;
  code text;
begin
  if not public.can_manage_challenge(p_challenge_id) then
    raise exception 'Merchant or Muse admin access required';
  end if;
  select * into c from public.challenges where id = p_challenge_id for update;
  if not found then raise exception 'Challenge not found'; end if;
  if coalesce(c.contest_mode, 'standard') <> 'competitive_pot' then
    raise exception 'Challenge is not a competitive pot contest';
  end if;
  if c.settled_at is not null then
    return jsonb_build_object('challenge_id', c.id, 'settled', true, 'idempotent', true);
  end if;
  if c.pot_value is null or c.pot_value <= 0 then raise exception 'Pot value required'; end if;

  for ranked in
    select cs.id, cs.user_id
    from public.challenge_submissions cs
    where cs.challenge_id = c.id and cs.status = 'approved'
    order by cs.score desc, cs.reviewed_at asc nulls last, cs.id asc
  loop
    place := place + 1;
    update public.challenge_submissions set final_rank = place where id = ranked.id;

    split_share := null;
    if c.pot_splits ? place::text then
      split_share := (c.pot_splits ->> place::text)::numeric;
    end if;

    if split_share is not null and split_share > 0 then
      prize_value := round(c.pot_value * split_share, 2);
      code := upper(substr(md5(random()::text || clock_timestamp()::text || ranked.id::text || 'p'), 1, 10));
      insert into public.reward_vouchers(
        submission_id, shop_id, user_id, code, value, currency, expires_at, prize_kind, placement_rank
      ) values (
        ranked.id, c.shop_id, ranked.user_id, code, prize_value, coalesce(c.pot_currency, c.reward_currency, 'BWP'),
        now() + make_interval(days => c.voucher_valid_days), 'placement', place
      )
      on conflict (submission_id) do nothing;
      if found then vouchers_issued := vouchers_issued + 1; end if;
    elsif coalesce(c.consolation_voucher_value, 0) > 0 then
      code := upper(substr(md5(random()::text || clock_timestamp()::text || ranked.id::text || 'c'), 1, 10));
      insert into public.reward_vouchers(
        submission_id, shop_id, user_id, code, value, currency, expires_at, prize_kind, placement_rank
      ) values (
        ranked.id, c.shop_id, ranked.user_id, code, c.consolation_voucher_value,
        coalesce(c.pot_currency, c.reward_currency, 'BWP'),
        now() + make_interval(days => c.voucher_valid_days), 'consolation', null
      )
      on conflict (submission_id) do nothing;
      if found then consolations_issued := consolations_issued + 1; end if;
    end if;
  end loop;

  update public.challenges set settled_at = now(), status = 'completed' where id = c.id;

  return jsonb_build_object(
    'challenge_id', c.id,
    'settled', true,
    'idempotent', false,
    'placements', least(place, 5),
    'placement_vouchers', vouchers_issued,
    'consolation_vouchers', consolations_issued
  );
end;
$$;

-- Feed returns contest fields; eligibility checks any qualifying product.
drop function if exists public.get_creator_opportunity_feed(integer, integer, bigint, text);
drop function if exists public.get_saved_creator_opportunities();

create or replace function public.get_creator_opportunity_feed(
  p_cursor integer default 0,
  p_limit integer default 20,
  p_mall_id bigint default null,
  p_seed text default null
) returns table(
  opportunity_id bigint, opportunity_title text, opportunity_description text, requirements text[], deadline text,
  product_id bigint, product_slug text, product_title text, product_description text, hero_image text,
  price double precision, max_quantity bigint, category_id bigint,
  merchant_id bigint, merchant_name text, merchant_location text, mall_id integer,
  has_delivery boolean, has_collection boolean,
  reward_value numeric, reward_currency text, preference_state text,
  eligibility_proof_id bigint, eligibility_consumed boolean, rank_score numeric,
  contest_mode text, pot_value numeric, pot_currency text, pot_splits jsonb,
  consolation_voucher_value numeric, settled_at timestamptz, score_rule text
) language sql stable security invoker set search_path = public, pg_catalog as $$
  with candidates as (
    select
      c.id opportunity_id, c.title opportunity_title, c.description opportunity_description, c.requirements, c.deadline,
      p.id product_id, p.slug product_slug, p.title product_title, p.description product_description,
      p."heroImage" hero_image, p.price, p."maxQuantity" max_quantity, p.category category_id,
      s.id merchant_id, s.name merchant_name, s.location merchant_location, s.mall_id,
      s.has_delivery, s.has_collection, c.reward_value, c.reward_currency,
      pref.state preference_state,
      proof.id eligibility_proof_id, (proof.consumed_by_submission_id is not null) eligibility_consumed,
      (
        case when p_mall_id is not null and s.mall_id=p_mall_id then 100 else 0 end
        + case when exists (
            select 1 from public.purchase_proofs history
            join public.product hp on hp.id=history.product_id
            where history.user_id=(select auth.uid()) and hp.category=p.category
          ) then 40 else 0 end
        + least(30, greatest(0, coalesce(c.pot_value, c.reward_value,0) / greatest(p.price,1) * 30))
        + greatest(0, 20 - extract(epoch from (now()-coalesce(c.created_at,now()))) / 86400)
        + case when c.contest_mode = 'competitive_pot' then 15 else 0 end
      )::numeric rank_score,
      md5(c.id::text || coalesce(p_seed,to_char(current_date,'YYYY-MM-DD'))) daily_order,
      c.contest_mode, c.pot_value, c.pot_currency, c.pot_splits,
      c.consolation_voucher_value, c.settled_at, c.score_rule
    from public.challenges c
    join public.product p on p.id=c.product_id
    join public.shops s on s.id=c.shop_id and s.id=p.shop_id
    left join public.creator_opportunity_preferences pref
      on pref.opportunity_id=c.id and pref.user_id=(select auth.uid())
    left join lateral (
      select pp.id, pp.consumed_by_submission_id
      from public.purchase_proofs pp
      where pp.user_id=(select auth.uid())
        and pp.shop_id=s.id
        and (pp.expires_at is null or pp.expires_at > now())
        and (
          pp.product_id = p.id
          or exists (
            select 1 from public.challenge_qualifying_products qp
            where qp.challenge_id = c.id and qp.product_id = pp.product_id
          )
        )
      order by pp.created_at desc
      limit 1
    ) proof on true
    where c.status='active' and p.is_available is true and p."maxQuantity" > 0 and s.is_active is true
      and (p_mall_id is null or s.mall_id=p_mall_id)
      and coalesce(pref.state <> 'saved', true)
      and not (pref.state='dismissed' and pref.dismissed_until > now())
  )
  select opportunity_id, opportunity_title, opportunity_description, requirements, deadline,
    product_id, product_slug, product_title, product_description, hero_image,
    price, max_quantity, category_id, merchant_id, merchant_name, merchant_location, mall_id,
    has_delivery, has_collection, reward_value, reward_currency, preference_state,
    eligibility_proof_id, eligibility_consumed, rank_score,
    contest_mode, pot_value, pot_currency, pot_splits,
    consolation_voucher_value, settled_at, score_rule
  from candidates order by rank_score desc, daily_order
  offset greatest(0,p_cursor) limit least(50,greatest(1,p_limit));
$$;

create or replace function public.get_saved_creator_opportunities()
returns table(
  opportunity_id bigint, opportunity_title text, opportunity_description text, requirements text[], deadline text,
  product_id bigint, product_slug text, product_title text, product_description text, hero_image text,
  price double precision, max_quantity bigint, category_id bigint,
  merchant_id bigint, merchant_name text, merchant_location text, mall_id integer,
  has_delivery boolean, has_collection boolean,
  reward_value numeric, reward_currency text, preference_state text,
  eligibility_proof_id bigint, eligibility_consumed boolean, rank_score numeric,
  contest_mode text, pot_value numeric, pot_currency text, pot_splits jsonb,
  consolation_voucher_value numeric, settled_at timestamptz, score_rule text
) language sql stable security invoker set search_path = public, pg_catalog as $$
  select
    c.id, c.title, c.description, c.requirements, c.deadline,
    p.id, p.slug, p.title, p.description, p."heroImage", p.price, p."maxQuantity", p.category,
    s.id, s.name, s.location, s.mall_id, s.has_delivery, s.has_collection,
    c.reward_value, c.reward_currency, pref.state,
    proof.id, (proof.consumed_by_submission_id is not null), 0::numeric,
    c.contest_mode, c.pot_value, c.pot_currency, c.pot_splits,
    c.consolation_voucher_value, c.settled_at, c.score_rule
  from public.creator_opportunity_preferences pref
  join public.challenges c on c.id=pref.opportunity_id
  join public.product p on p.id=c.product_id
  join public.shops s on s.id=c.shop_id and s.id=p.shop_id
  left join lateral (
    select pp.id, pp.consumed_by_submission_id
    from public.purchase_proofs pp
    where pp.user_id=(select auth.uid())
      and pp.shop_id=s.id
      and (pp.expires_at is null or pp.expires_at > now())
      and (
        pp.product_id = p.id
        or exists (
          select 1 from public.challenge_qualifying_products qp
          where qp.challenge_id = c.id and qp.product_id = pp.product_id
        )
      )
    order by pp.created_at desc
    limit 1
  ) proof on true
  where pref.user_id=(select auth.uid()) and pref.state='saved'
  order by pref.updated_at desc;
$$;

create or replace function public.set_creator_opportunity_preference(
  p_opportunity_id bigint,
  p_state text
) returns public.creator_opportunity_preferences
language plpgsql security definer set search_path = public, pg_catalog as $$
declare result public.creator_opportunity_preferences; current_user_id uuid := auth.uid();
begin
  if current_user_id is null then raise exception 'Not authenticated'; end if;
  if p_state not in ('saved', 'dismissed') then raise exception 'Invalid preference state'; end if;
  if not exists (
    select 1 from public.challenges c join public.product p on p.id=c.product_id
    where c.id=p_opportunity_id and c.status='active' and p.is_available is true and p."maxQuantity" > 0
  ) then raise exception 'Creator opportunity is unavailable'; end if;

  insert into public.creator_opportunity_preferences(user_id, opportunity_id, state, dismissed_until)
  values (
    current_user_id,
    p_opportunity_id,
    p_state,
    case when p_state='dismissed' then now() + interval '30 days' else null end
  )
  on conflict (user_id, opportunity_id) do update set
    state=excluded.state,
    dismissed_until=excluded.dismissed_until,
    updated_at=now()
  returning * into result;
  return result;
end; $$;

revoke all on function public.refresh_submission_metrics(bigint,integer,integer,integer,integer) from public;
grant execute on function public.refresh_submission_metrics(bigint,integer,integer,integer,integer) to authenticated;
revoke all on function public.get_challenge_leaderboard(bigint) from public;
grant execute on function public.get_challenge_leaderboard(bigint) to anon, authenticated;
revoke all on function public.settle_competitive_challenge(bigint) from public;
grant execute on function public.settle_competitive_challenge(bigint) to authenticated;
revoke all on function public.can_manage_challenge(bigint) from public;
grant execute on function public.can_manage_challenge(bigint) to authenticated;

grant select on public.challenge_qualifying_products to anon, authenticated;
grant select, insert, update, delete on public.challenge_qualifying_products to authenticated;

commit;
