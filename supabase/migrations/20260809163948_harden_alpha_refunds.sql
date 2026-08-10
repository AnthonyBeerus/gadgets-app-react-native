begin;

create or replace function public.apply_order_payment_event(
  p_event_id text,
  p_event_type text,
  p_payment_intent_id text
) returns bigint
language plpgsql security definer
set search_path = public, pg_catalog
as $$
declare
  target_order public."order";
  reservation public.inventory_reservations;
begin
  insert into public.stripe_order_events(event_id,event_type,payment_intent_id)
  values (p_event_id,p_event_type,p_payment_intent_id)
  on conflict do nothing;
  if not found then return null; end if;

  select * into target_order from public."order" where stripe_payment_intent_id = p_payment_intent_id for update;
  if not found then return null; end if;
  select * into reservation from public.inventory_reservations where order_id = target_order.id for update;

  if p_event_type = 'payment_intent.succeeded' then
    if target_order.payment_status <> 'succeeded' then
      update public.product p set "maxQuantity" = greatest(0, p."maxQuantity" - ri.quantity)
      from public.inventory_reservation_items ri
      where ri.reservation_id = reservation.id and p.id = ri.product_id;
      update public.inventory_reservations set status='committed',updated_at=now() where id=reservation.id;
      update public."order" set payment_status='succeeded',order_status='paid',status='Paid',stripe_payment_status='succeeded' where id=target_order.id;
      insert into public.purchase_proofs(user_id,shop_id,product_id,source,order_id,amount,currency)
      select target_order."user",p.shop_id,oi.product,'order',target_order.id,oi.price * oi.quantity,'BWP'
      from public.order_item oi join public.product p on p.id=oi.product
      where oi."order"=target_order.id
        and exists (select 1 from public.challenges c where c.product_id=oi.product and c.shop_id=p.shop_id and c.status='active')
      on conflict (order_id,product_id) do nothing;
    end if;
  elsif p_event_type in ('payment_intent.payment_failed','payment_intent.canceled') then
    update public.inventory_reservations set status='released',updated_at=now() where id=reservation.id and status='active';
    update public."order" set payment_status=case when p_event_type='payment_intent.canceled' then 'cancelled' else 'failed' end,
      order_status=case when p_event_type='payment_intent.canceled' then 'cancelled' else order_status end,
      stripe_payment_status=case when p_event_type='payment_intent.canceled' then 'cancelled' else 'failed' end
      where id=target_order.id;
  elsif p_event_type = 'charge.refunded' then
    if reservation.status = 'committed' then
      update public.product p set "maxQuantity" = p."maxQuantity" + ri.quantity
      from public.inventory_reservation_items ri
      where ri.reservation_id = reservation.id and p.id = ri.product_id;
      update public.inventory_reservations set status='released',updated_at=now() where id=reservation.id;
    end if;
    update public."order" set payment_status='refunded',
      order_status=case when target_order.order_status='rejected' then 'rejected' else 'cancelled' end,
      status=case when target_order.order_status='rejected' then 'Rejected' else 'Cancelled' end,
      stripe_payment_status='refunded',refunded_at=now()
    where id=target_order.id;
    update public.purchase_proofs set revoked_at=now(),revocation_reason='order_refunded'
    where order_id=target_order.id and consumed_by_submission_id is null;
  end if;
  return target_order.id;
end;
$$;
revoke all on function public.apply_order_payment_event(text,text,text) from public, anon, authenticated;
grant execute on function public.apply_order_payment_event(text,text,text) to service_role;

commit;
