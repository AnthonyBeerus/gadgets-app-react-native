-- Close the anon execute path on the mutating campaign RPCs.
--
-- `revoke all ... from public` does not strip the anon role, because Supabase grants
-- EXECUTE to anon through default privileges on the public schema. Every one of these
-- already refuses an anonymous caller on its own (can_manage_challenge is false without
-- a profile; join/submit raise on a null profile), but a signed-out caller should not be
-- able to reach a SECURITY DEFINER entry point at all.

begin;

revoke execute on function public.publish_campaign(bigint) from anon;
revoke execute on function public.close_campaign(bigint) from anon;
revoke execute on function public.review_campaign_submission(bigint, text, text) from anon;
revoke execute on function public.select_campaign_winners(bigint, bigint[]) from anon;
revoke execute on function public.settle_campaign(bigint) from anon;
revoke execute on function public.join_campaign(bigint) from anon;
revoke execute on function public.submit_campaign_entry(bigint, text[], jsonb, text, text, text) from anon;
revoke execute on function public.get_campaign_results(bigint) from anon;
revoke execute on function public.can_manage_challenge(bigint) from anon;
revoke execute on function public.get_saved_creator_opportunities() from anon;
revoke execute on function public.set_creator_opportunity_preference(bigint, text) from anon;
revoke execute on function public.record_creator_opportunity_event(bigint, text, text) from anon;
revoke execute on function public.redeem_reward_voucher(text) from anon;

-- get_creator_opportunity_feed stays open to anon on purpose: browsing campaigns never
-- requires an account, which is what makes the Discover deck work signed out.

commit;
