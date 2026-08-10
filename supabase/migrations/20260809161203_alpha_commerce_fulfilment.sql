begin;

alter table public."order"
  add column if not exists shop_id bigint references public.shops(id),
  add column if not exists checkout_idempotency_key uuid,
  add column if not exists payment_status text not null default 'requires_payment',
  add column if not exists order_status text not null default 'awaiting_payment',
  add column if not exists subtotal_minor integer not null default 0,
  add column if not exists delivery_fee_minor integer not null default 0,
  add column if not exists total_minor integer not null default 0,
  add column if not exists currency text not null default 'BWP',
  add column if not exists fulfilment_type text,
  add column if not exists reservation_expires_at timestamptz,
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_reason text,
  add column if not exists refunded_at timestamptz;

create unique index if not exists order_checkout_idempotency_key_idx
  on public."order"("user", checkout_idempotency_key)
  where checkout_idempotency_key is not null;
create unique index if not exists order_stripe_payment_intent_unique_idx
  on public."order"(stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
create index if not exists order_shop_status_idx on public."order"(shop_id, order_status, created_at desc);

create table if not exists public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id bigint not null unique references public."order"(id) on delete cascade,
  status text not null default 'active' check (status in ('active','committed','released')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_reservation_items (
  reservation_id uuid not null references public.inventory_reservations(id) on delete cascade,
  product_id bigint not null references public.product(id),
  quantity integer not null check (quantity > 0),
  primary key (reservation_id, product_id)
);

create table if not exists public.stripe_order_events (
  event_id text primary key,
  event_type text not null,
  payment_intent_id text,
  processed_at timestamptz not null default now()
);

alter table public.inventory_reservations enable row level security;
alter table public.inventory_reservation_items enable row level security;
alter table public.stripe_order_events enable row level security;
revoke all on public.inventory_reservations, public.inventory_reservation_items, public.stripe_order_events from public, anon, authenticated;

alter table public.purchase_proofs add column if not exists revoked_at timestamptz;
alter table public.purchase_proofs add column if not exists revocation_reason text;
alter table public.purchase_proofs drop constraint if exists purchase_proofs_user_id_fkey;
alter table public.purchase_proofs
  add constraint purchase_proofs_user_id_fkey foreign key (user_id) references public.users(id) on delete cascade;

create or replace function public.current_muse_profile()
returns public.users
language sql stable security definer
set search_path = public, pg_catalog
as $$
  select * from public.users where clerk_user_id = auth.jwt()->>'sub' limit 1;
$$;
revoke all on function public.current_muse_profile() from public, anon;
grant execute on function public.current_muse_profile() to authenticated;

drop policy if exists "Users can insert own orders" on public."order";
drop policy if exists "Users can view own orders" on public."order";
drop policy if exists "Users can update own orders" on public."order";
drop policy if exists "Users can delete own orders" on public."order";
create policy "Clerk buyers and merchants view relevant orders" on public."order"
for select to authenticated using (
  "user" = (select private.current_profile_id())
  or exists (
    select 1 from public.shops s
    where s.id = "order".shop_id and s.owner_id = (select private.current_profile_id())
  )
  or (select private.current_muse_role()) = 'OPERATOR'
);

drop policy if exists "Users can insert own order items" on public.order_item;
drop policy if exists "Users and merchants can view relevant order items" on public.order_item;
drop policy if exists "Users can update own order items" on public.order_item;
drop policy if exists "Users can delete own order items" on public.order_item;
create policy "Clerk buyers and merchants view relevant order items" on public.order_item
for select to authenticated using (
  exists (
    select 1 from public."order" o
    left join public.shops s on s.id = o.shop_id
    where o.id = order_item."order"
      and (o."user" = (select private.current_profile_id())
        or s.owner_id = (select private.current_profile_id())
        or (select private.current_muse_role()) = 'OPERATOR')
  )
);

drop policy if exists "Shop owners can view delivery orders" on public.delivery_orders;
create policy "Clerk buyers and merchants view fulfilment" on public.delivery_orders
for select to authenticated using (
  exists (
    select 1 from public."order" o
    left join public.shops s on s.id = o.shop_id
    where o.id = delivery_orders.order_id
      and (o."user" = (select private.current_profile_id())
        or s.owner_id = (select private.current_profile_id())
        or (select private.current_muse_role()) = 'OPERATOR')
  )
);

drop policy if exists "Users read own purchase proofs" on public.purchase_proofs;
create policy "Clerk users read relevant purchase proofs" on public.purchase_proofs
for select to authenticated using (
  user_id = (select private.current_profile_id())
  or exists (select 1 from public.shops s where s.id = purchase_proofs.shop_id and s.owner_id = (select private.current_profile_id()))
  or (select private.current_muse_role()) = 'OPERATOR'
);

create or replace function public.reserve_checkout_order(
  p_user_id uuid,
  p_items jsonb,
  p_fulfilment jsonb,
  p_attribution jsonb,
  p_idempotency_key uuid
) returns jsonb
language plpgsql security definer
set search_path = public, pg_catalog
as $$
declare
  existing_order public."order";
  created_order public."order";
  target_shop public.shops;
  reservation_id uuid;
  item jsonb;
  product_row public.product;
  requested_quantity integer;
  product_shop_id bigint;
  reserved_quantity bigint;
  subtotal integer := 0;
  fee integer := 0;
  method text := p_fulfilment->>'type';
  expires timestamptz := now() + interval '15 minutes';
begin
  if p_user_id is null then raise exception 'Profile is required'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'Bag is empty'; end if;
  if method not in ('collection','delivery') then raise exception 'Invalid fulfilment method'; end if;
  if coalesce(p_fulfilment->>'phone','') !~ '^(\+267|267)?[237][0-9]{7}$' then raise exception 'Invalid Botswana phone number'; end if;
  if method = 'delivery' and char_length(btrim(coalesce(p_fulfilment->>'address',''))) < 8 then raise exception 'Delivery address is required'; end if;

  select * into existing_order from public."order"
  where "user" = p_user_id and checkout_idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object(
      'orderId', existing_order.id,
      'subtotalMinor', existing_order.subtotal_minor,
      'deliveryFeeMinor', existing_order.delivery_fee_minor,
      'totalMinor', existing_order.total_minor,
      'currency', existing_order.currency,
      'reservationExpiresAt', existing_order.reservation_expires_at,
      'paymentIntentId', existing_order.stripe_payment_intent_id
    );
  end if;

  update public.inventory_reservations set status = 'released', updated_at = now()
  where status = 'active' and expires_at <= now();

  for item in select * from jsonb_array_elements(p_items)
  loop
    requested_quantity := (item->>'quantity')::integer;
    if requested_quantity < 1 or (item->>'productId')::bigint < 1 then raise exception 'Invalid bag item'; end if;
    select * into product_row from public.product
      where id = (item->>'productId')::bigint and is_available = true for update;
    if not found or product_row.shop_id is null then raise exception 'A product is unavailable'; end if;
    if product_shop_id is null then product_shop_id := product_row.shop_id; end if;
    if product_shop_id <> product_row.shop_id then raise exception 'Orders must contain products from one business'; end if;
    select coalesce(sum(ri.quantity),0) into reserved_quantity
      from public.inventory_reservation_items ri
      join public.inventory_reservations r on r.id = ri.reservation_id
      where ri.product_id = product_row.id and r.status = 'active' and r.expires_at > now();
    if product_row."maxQuantity" - reserved_quantity < requested_quantity then raise exception '% is out of stock', product_row.title; end if;
    subtotal := subtotal + round(product_row.price::numeric * 100)::integer * requested_quantity;
  end loop;

  select * into target_shop from public.shops where id = product_shop_id and is_active = true;
  if not found then raise exception 'Business is unavailable'; end if;
  if method = 'delivery' and not coalesce(target_shop.has_delivery,false) then raise exception 'Delivery is unavailable'; end if;
  if method = 'collection' and not coalesce(target_shop.has_collection,false) then raise exception 'Collection is unavailable'; end if;
  if subtotal < round(coalesce(target_shop.minimum_order_amount,0) * 100) then raise exception 'Minimum order not met'; end if;
  if method = 'delivery' then fee := round(coalesce(target_shop.delivery_fee,0) * 100); end if;

  insert into public."order"(
    "user", slug, status, "totalPrice", shop_id, checkout_idempotency_key,
    payment_status, order_status, subtotal_minor, delivery_fee_minor, total_minor,
    currency, fulfilment_type, reservation_expires_at, stripe_payment_status,
    discovery_source, opportunity_id
  ) values (
    p_user_id, gen_random_uuid()::text, 'Payment Pending', (subtotal + fee)::numeric / 100,
    product_shop_id, p_idempotency_key, 'requires_payment', 'awaiting_payment', subtotal,
    fee, subtotal + fee, 'BWP', method, expires, 'pending',
    case when p_attribution->>'source' in ('discover','saved','marketplace','merchant') then p_attribution->>'source' else null end,
    case when coalesce(p_attribution->>'opportunityId','') ~ '^[0-9]+$' then (p_attribution->>'opportunityId')::bigint else null end
  ) returning * into created_order;

  insert into public.delivery_orders(order_id, shop_id, delivery_type, delivery_address, delivery_phone, delivery_notes, delivery_fee, status)
  values (created_order.id, product_shop_id, method,
    case when method = 'delivery' then btrim(p_fulfilment->>'address') else null end,
    p_fulfilment->>'phone', nullif(btrim(p_fulfilment->>'notes'),''), fee::numeric / 100, 'pending');

  insert into public.inventory_reservations(order_id, expires_at)
  values (created_order.id, expires) returning id into reservation_id;

  for item in select * from jsonb_array_elements(p_items)
  loop
    select * into product_row from public.product where id = (item->>'productId')::bigint;
    requested_quantity := (item->>'quantity')::integer;
    insert into public.order_item("order", product, quantity, price)
    values (created_order.id, product_row.id, requested_quantity, product_row.price);
    insert into public.inventory_reservation_items(reservation_id, product_id, quantity)
    values (reservation_id, product_row.id, requested_quantity);
  end loop;

  return jsonb_build_object(
    'orderId', created_order.id,
    'subtotalMinor', subtotal,
    'deliveryFeeMinor', fee,
    'totalMinor', subtotal + fee,
    'currency', 'BWP',
    'reservationExpiresAt', expires,
    'paymentIntentId', null
  );
end;
$$;
revoke all on function public.reserve_checkout_order(uuid,jsonb,jsonb,jsonb,uuid) from public, anon, authenticated;
grant execute on function public.reserve_checkout_order(uuid,jsonb,jsonb,jsonb,uuid) to service_role;

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
    update public."order" set payment_status='refunded',order_status='cancelled',stripe_payment_status='refunded',refunded_at=now() where id=target_order.id;
    update public.purchase_proofs set revoked_at=now(),revocation_reason='order_refunded' where order_id=target_order.id and consumed_by_submission_id is null;
  end if;
  return target_order.id;
end;
$$;
revoke all on function public.apply_order_payment_event(text,text,text) from public, anon, authenticated;
grant execute on function public.apply_order_payment_event(text,text,text) to service_role;

-- The old trigger issued proofs for every product. Webhook processing now issues only qualifying proofs.
drop trigger if exists trg_sync_order_purchase_proofs on public."order";

-- Controlled, clearly labelled Alpha Preview commerce data.
do $$
declare
  alpha_category bigint;
  alpha_shop bigint;
  qualifying_product bigint;
  alpha_challenge bigint;
begin
  select id into alpha_category from public.category order by id limit 1;
  if alpha_category is null then
    insert into public.category(name,slug) values ('Alpha Preview','alpha-preview') returning id into alpha_category;
  end if;

  select id into alpha_shop from public.shops where name='Muse Alpha Shop' order by id limit 1;
  if alpha_shop is null then
    insert into public.shops(name,category_id,description,location,phone,email,image_url,has_online_ordering,has_delivery,has_collection,delivery_fee,minimum_order_amount,estimated_delivery_time,is_featured,is_active)
    values ('Muse Alpha Shop',alpha_category,'Controlled Stripe sandbox shop for demonstrating Muse purchasing and creator-commerce flows. No real merchant or money is represented.','Molapo Alpha Preview','+267 71 000 000','alpha@muse.co.bw','https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',true,true,true,25,50,'45–60 minutes',true,true)
    returning id into alpha_shop;
  else
    update public.shops set has_online_ordering=true,has_delivery=true,has_collection=true,delivery_fee=25,minimum_order_amount=50,is_active=true where id=alpha_shop;
  end if;

  insert into public.product(title,slug,"imagesUrl",price,"heroImage",category,"maxQuantity",shop_id,description,brand,is_available)
  values
    ('Muse Creator Starter Kit','muse-alpha-creator-starter-kit',array['https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80'],149,'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80',alpha_category,20,alpha_shop,'A controlled sandbox item that unlocks an illustrative creator brief after webhook-confirmed payment.','Muse Alpha',true),
    ('Local Content Light','muse-alpha-content-light',array['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80'],89,'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',alpha_category,12,alpha_shop,'Compact light for testing collection and delivery purchasing flows.','Muse Alpha',true),
    ('Digital Economy Tote','muse-alpha-digital-economy-tote',array['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80'],65,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',alpha_category,30,alpha_shop,'Alpha Preview merchandise used only with Stripe sandbox money.','Muse Alpha',true)
  on conflict (slug) do update set shop_id=excluded.shop_id,is_available=true,"maxQuantity"=greatest(public.product."maxQuantity",excluded."maxQuantity") ;

  select id into qualifying_product from public.product where slug='muse-alpha-creator-starter-kit';
  if not exists (select 1 from public.challenges where product_id=qualifying_product and shop_id=alpha_shop and title='Show Botswana Creating') then
    insert into public.challenges(title,description,image_url,brand_name,requirements,reward,reward_value,reward_currency,deadline,status,type,product_id,shop_id,contest_mode,pot_value,pot_currency,consolation_voucher_value)
    values ('Show Botswana Creating','Create a short public social post showing how local shopping can fund local creative work. Alpha Preview brief only.','https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80','Muse Alpha Shop',array['Publish a public vertical video','Show the qualifying product','Disclose the Muse Alpha brief'],'Accepted-entry cash payout plus ranked prize pot',75,'BWP',now()+interval '90 days','active','content',qualifying_product,alpha_shop,'competitive_pot',1000,'BWP',0);
  end if;
  select id into alpha_challenge from public.challenges where product_id=qualifying_product and shop_id=alpha_shop and title='Show Botswana Creating' order by id limit 1;
  insert into public.challenge_qualifying_products(challenge_id,product_id)
  values (alpha_challenge,qualifying_product) on conflict do nothing;
end;
$$;

grant select on public."order", public.order_item, public.delivery_orders, public.purchase_proofs to authenticated;

commit;
