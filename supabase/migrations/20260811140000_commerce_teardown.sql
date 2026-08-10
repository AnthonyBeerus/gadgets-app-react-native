-- Commerce teardown.
--
-- DESTRUCTIVE. Drops the product/order/service/event surface and the purchase-proof
-- entry gate. Run this LAST -- 20260811130000 must already have replaced the feed RPCs,
-- because the old get_creator_opportunity_feed joins public.product and would 500 the
-- moment that table disappears.
--
-- Take a backup first. `public.product` holds real seed rows (159 at time of writing).

begin;

-- ---------------------------------------------------------------------------
-- Purchase-proof entry gate
-- ---------------------------------------------------------------------------

drop trigger if exists trg_sync_order_purchase_proofs on public."order";
drop function if exists public.sync_order_purchase_proofs();
drop function if exists public.create_merchant_purchase_code(bigint, numeric, text);
drop function if exists public.claim_merchant_purchase_code(text);
drop function if exists public.merge_creator_opportunity_preferences(jsonb);
drop function if exists public.restore_creator_opportunity_preference(bigint);

-- ---------------------------------------------------------------------------
-- Campaign columns that only existed to describe a qualifying purchase
-- ---------------------------------------------------------------------------

alter table public.challenges
  drop column if exists product_id,
  drop column if exists entry_fee,
  drop column if exists score_rule,
  drop column if exists consolation_voucher_value,
  drop column if exists manual_verification_enabled,
  drop column if exists contest_mode,
  drop column if exists type,
  drop column if exists is_premium;

alter table public.challenge_submissions
  drop column if exists purchase_proof_id,
  drop column if exists platform_account_id,
  drop column if exists platform_video_id,
  drop column if exists platform_author_open_id,
  drop column if exists post_description,
  drop column if exists post_published_at,
  drop column if exists verification_status,
  drop column if exists verified_at,
  drop column if exists like_count,
  drop column if exists comment_count,
  drop column if exists save_count,
  drop column if exists view_count,
  drop column if exists score,
  drop column if exists metrics_captured_at;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

drop table if exists public.challenge_qualifying_products cascade;
drop table if exists public.purchase_proofs cascade;
drop table if exists public.merchant_purchase_codes cascade;

-- External social verification: content is uploaded to Muse now.
drop table if exists public.creator_platform_tokens cascade;
drop table if exists public.creator_platform_accounts cascade;
drop table if exists public.creator_oauth_states cascade;

-- Alpha commerce fulfilment
drop table if exists public.stripe_order_events cascade;
drop table if exists public.inventory_reservation_items cascade;
drop table if exists public.inventory_reservations cascade;
drop table if exists public.delivery_orders cascade;
drop table if exists public.order_item cascade;
drop table if exists public."order" cascade;

-- Catalogue
drop table if exists public.product_variants cascade;
drop table if exists public.product cascade;

-- Services, events and bookings: dead since the partner prototype branch.
drop table if exists public.service_review cascade;
drop table if exists public.service_booking cascade;
drop table if exists public.service_availability cascade;
drop table if exists public.service cascade;
drop table if exists public.service_provider cascade;
drop table if exists public.service_category cascade;
drop table if exists public.appointments cascade;
drop table if exists public.ticket_purchases cascade;
drop table if exists public.events cascade;
drop table if exists public.event_venue cascade;

-- Kept deliberately:
--   shops                            campaign ownership + voucher issuer
--   users, malls, category           identity and place
--   challenges, challenge_submissions the campaign primitive
--   reward_vouchers                  the payout rail
--   creator_opportunity_preferences  save/pass on the discovery deck
--   creator_opportunity_events       discovery analytics
--   shop_reviews                     merchant credibility

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

-- storage.objects is guarded by storage.protect_delete(), which rejects direct DELETE
-- and rolls back the whole migration. Empty and remove the product-images bucket
-- through the Storage API (dashboard or supabase-js .remove()), not from SQL.
drop policy if exists "Authenticated users can upload product images" on storage.objects;
drop policy if exists "Authenticated users can update own product images" on storage.objects;
drop policy if exists "Authenticated users can delete own product images" on storage.objects;

commit;
