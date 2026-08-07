-- Showcase: allow denser Discover decks (100+ competitive pots).
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
      and coalesce(pref.state is distinct from 'saved', true)
      and coalesce(not (pref.state = 'dismissed' and pref.dismissed_until > now()), true)
  )
  select opportunity_id, opportunity_title, opportunity_description, requirements, deadline,
    product_id, product_slug, product_title, product_description, hero_image,
    price, max_quantity, category_id, merchant_id, merchant_name, merchant_location, mall_id,
    has_delivery, has_collection, reward_value, reward_currency, preference_state,
    eligibility_proof_id, eligibility_consumed, rank_score,
    contest_mode, pot_value, pot_currency, pot_splits,
    consolation_voucher_value, settled_at, score_rule
  from candidates order by rank_score desc, daily_order
  offset greatest(0,p_cursor) limit least(200,greatest(1,p_limit));
$$;
