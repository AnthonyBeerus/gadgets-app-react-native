begin;

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1
    from public.users
    where id = (select auth.uid())
      and type = 'ADMIN'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Authenticated users can upload product images" on storage.objects;
drop policy if exists "Authenticated users can update own product images" on storage.objects;
drop policy if exists "Authenticated users can delete own product images" on storage.objects;

create policy "Public can view product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Authenticated users can update own product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Authenticated users can delete own product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

alter table public.order_item
  add column if not exists price double precision not null default 0;

insert into public.category (
  id,
  name,
  "imageUrl",
  slug,
  description,
  icon_name,
  has_delivery,
  has_collection,
  has_virtual_try_on,
  has_appointment_booking
)
values (
  1,
  'General',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
  'general',
  'Default category for launch-ready merchant products.',
  'storefront',
  true,
  true,
  false,
  false
)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    description = excluded.description,
    icon_name = excluded.icon_name;

select setval(
  pg_get_serial_sequence('public.category', 'id'),
  greatest((select coalesce(max(id), 1) from public.category), 1)
)
where pg_get_serial_sequence('public.category', 'id') is not null;

drop function if exists public.create_merchant_shop(
  text,
  text,
  text,
  bigint,
  integer,
  text,
  text,
  boolean,
  boolean
);

create function public.create_merchant_shop(
  shop_name text,
  shop_location text,
  shop_description text default null,
  shop_category_id bigint default null,
  shop_mall_id integer default null,
  logo_url text default null,
  image_url text default null,
  enable_delivery boolean default false,
  enable_collection boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  normalized_name text := nullif(trim(shop_name), '');
  normalized_location text := nullif(trim(shop_location), '');
  owned_shop_id bigint;
  provider_row_id bigint;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if normalized_name is null then
    raise exception 'Shop name is required';
  end if;

  if normalized_location is null then
    raise exception 'Shop location is required';
  end if;

  select email
  into current_email
  from auth.users
  where id = current_user_id;

  select id
  into owned_shop_id
  from public.shops
  where owner_id = current_user_id
  order by created_at asc
  limit 1;

  if owned_shop_id is null then
    insert into public.shops (
      name,
      description,
      location,
      email,
      category_id,
      mall_id,
      logo_url,
      image_url,
      owner_id,
      has_online_ordering,
      has_delivery,
      has_collection,
      is_active
    )
    values (
      normalized_name,
      nullif(trim(coalesce(shop_description, '')), ''),
      normalized_location,
      current_email,
      shop_category_id,
      shop_mall_id,
      logo_url,
      image_url,
      current_user_id,
      true,
      enable_delivery,
      enable_collection,
      true
    )
    returning id into owned_shop_id;
  else
    update public.shops
    set name = normalized_name,
        description = nullif(trim(coalesce(shop_description, '')), ''),
        location = normalized_location,
        email = coalesce(current_email, email),
        category_id = shop_category_id,
        mall_id = shop_mall_id,
        logo_url = coalesce(create_merchant_shop.logo_url, shops.logo_url),
        image_url = coalesce(create_merchant_shop.image_url, shops.image_url),
        has_online_ordering = true,
        has_delivery = enable_delivery,
        has_collection = enable_collection,
        is_active = true,
        updated_at = timezone('utc'::text, now())
    where id = owned_shop_id
    returning id into owned_shop_id;
  end if;

  select id
  into provider_row_id
  from public.service_provider
  where user_id = current_user_id
  order by created_at asc
  limit 1;

  if provider_row_id is null then
    insert into public.service_provider (
      name,
      email,
      description,
      shop_id,
      user_id,
      is_active,
      is_verified
    )
    values (
      normalized_name,
      coalesce(current_email, current_user_id::text || '@merchant.local'),
      nullif(trim(coalesce(shop_description, '')), ''),
      owned_shop_id,
      current_user_id,
      true,
      true
    )
    returning id into provider_row_id;
  else
    update public.service_provider
    set name = normalized_name,
        email = coalesce(current_email, email),
        description = nullif(trim(coalesce(shop_description, '')), ''),
        shop_id = owned_shop_id,
        is_active = true,
        is_verified = true
    where id = provider_row_id
    returning id into provider_row_id;
  end if;

  return jsonb_build_object(
    'success', true,
    'shop_id', owned_shop_id,
    'provider_id', provider_row_id
  );
end;
$$;

revoke all on function public.create_merchant_shop(
  text,
  text,
  text,
  bigint,
  integer,
  text,
  text,
  boolean,
  boolean
) from public;
grant execute on function public.create_merchant_shop(
  text,
  text,
  text,
  bigint,
  integer,
  text,
  text,
  boolean,
  boolean
) to authenticated;

create or replace function public.create_dev_merchant()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  return public.create_merchant_shop(
    'My Shop',
    'Online',
    'Self-serve merchant shop',
    null,
    null,
    null,
    null,
    false,
    true
  );
end;
$$;

revoke all on function public.create_dev_merchant() from public;
grant execute on function public.create_dev_merchant() to authenticated;

create or replace function public.get_merchant_dashboard_stats(target_shop_id bigint)
returns table (
  product_count bigint,
  pending_order_count bigint,
  todays_sales double precision
)
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select
    (
      select count(*)
      from public.product p
      where p.shop_id = target_shop_id
    ) as product_count,
    (
      select count(distinct oi."order")
      from public.order_item oi
      join public.product p on p.id = oi.product
      join public."order" o on o.id = oi."order"
      where p.shop_id = target_shop_id
        and o.status = 'Pending'
    ) as pending_order_count,
    (
      select coalesce(sum(oi.price * oi.quantity), 0)::double precision
      from public.order_item oi
      join public.product p on p.id = oi.product
      join public."order" o on o.id = oi."order"
      where p.shop_id = target_shop_id
        and o.stripe_payment_status = 'succeeded'
        and o.created_at >= date_trunc('day', now())
    ) as todays_sales
  where exists (
    select 1
    from public.shops s
    where s.id = target_shop_id
      and (s.owner_id = (select auth.uid()) or private.is_admin())
  );
$$;

revoke all on function public.get_merchant_dashboard_stats(bigint) from public;
grant execute on function public.get_merchant_dashboard_stats(bigint) to authenticated;

create or replace function public.decrement_product_quantity(product_id bigint, quantity bigint)
returns void
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  updated_count integer;
begin
  update public.product
  set "maxQuantity" = "maxQuantity" - quantity
  where id = product_id
    and "maxQuantity" >= quantity;

  get diagnostics updated_count = row_count;

  if updated_count = 0 then
    raise exception 'Insufficient stock for product %', product_id;
  end if;
end;
$$;

revoke all on function public.decrement_product_quantity(bigint, bigint) from public;
grant execute on function public.decrement_product_quantity(bigint, bigint) to authenticated;

drop policy if exists "Authenticated users can manage malls" on public.malls;
drop policy if exists "Admins can manage malls" on public.malls;
create policy "Admins can manage malls"
on public.malls
for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Public can view shops" on public.shops;
drop policy if exists "Owners and Admins can manage shops" on public.shops;
drop policy if exists "Owners and Admins can update shops" on public.shops;
drop policy if exists "Owners and Admins can delete shops" on public.shops;

create policy "Public can view active shops"
on public.shops
for select
to public
using (coalesce(is_active, true));

create policy "Owners can insert shops"
on public.shops
for insert
to authenticated
with check (owner_id = (select auth.uid()) or private.is_admin());

create policy "Owners can update shops"
on public.shops
for update
to authenticated
using (owner_id = (select auth.uid()) or private.is_admin())
with check (owner_id = (select auth.uid()) or private.is_admin());

create policy "Owners can delete shops"
on public.shops
for delete
to authenticated
using (owner_id = (select auth.uid()) or private.is_admin());

drop policy if exists "Public products are viewable by everyone" on public.product;
drop policy if exists "Enable update for auth users" on public.product;
drop policy if exists "Enable insert for admins users only" on public.product;
drop policy if exists "Enable delete for Admins only" on public.product;
drop policy if exists "Shop owners can manage products" on public.product;

create policy "Public can view active shop products"
on public.product
for select
to public
using (
  coalesce(is_available, true)
  and exists (
    select 1
    from public.shops s
    where s.id = product.shop_id
      and coalesce(s.is_active, true)
  )
);

create policy "Shop owners can insert products"
on public.product
for insert
to authenticated
with check (
  exists (
    select 1
    from public.shops s
    where s.id = product.shop_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
);

create policy "Shop owners can update products"
on public.product
for update
to authenticated
using (
  exists (
    select 1
    from public.shops s
    where s.id = product.shop_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
)
with check (
  exists (
    select 1
    from public.shops s
    where s.id = product.shop_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
);

create policy "Shop owners can delete products"
on public.product
for delete
to authenticated
using (
  exists (
    select 1
    from public.shops s
    where s.id = product.shop_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
);

drop policy if exists "Anyone can view product variants" on public.product_variants;
drop policy if exists "Authenticated users can insert variants" on public.product_variants;
drop policy if exists "Authenticated users can update variants" on public.product_variants;
drop policy if exists "Authenticated users can delete variants" on public.product_variants;

create policy "Public can view active product variants"
on public.product_variants
for select
to public
using (
  coalesce(is_available, true)
  and exists (
    select 1
    from public.product p
    join public.shops s on s.id = p.shop_id
    where p.id = product_variants.product_id
      and coalesce(p.is_available, true)
      and coalesce(s.is_active, true)
  )
);

create policy "Shop owners can insert product variants"
on public.product_variants
for insert
to authenticated
with check (
  exists (
    select 1
    from public.product p
    join public.shops s on s.id = p.shop_id
    where p.id = product_variants.product_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
);

create policy "Shop owners can update product variants"
on public.product_variants
for update
to authenticated
using (
  exists (
    select 1
    from public.product p
    join public.shops s on s.id = p.shop_id
    where p.id = product_variants.product_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
)
with check (
  exists (
    select 1
    from public.product p
    join public.shops s on s.id = p.shop_id
    where p.id = product_variants.product_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
);

create policy "Shop owners can delete product variants"
on public.product_variants
for delete
to authenticated
using (
  exists (
    select 1
    from public.product p
    join public.shops s on s.id = p.shop_id
    where p.id = product_variants.product_id
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
);

drop policy if exists "Admins and Providers can update profile" on public.service_provider;
drop policy if exists "Admins can delete providers" on public.service_provider;
drop policy if exists "Admins can insert and delete providers" on public.service_provider;
drop policy if exists "Admins can insert/delete providers" on public.service_provider;
drop policy if exists "Service providers can update their own profile" on public.service_provider;

create policy "Public can view active service providers"
on public.service_provider
for select
to public
using (coalesce(is_active, true));

create policy "Providers can insert own profile"
on public.service_provider
for insert
to authenticated
with check (user_id = (select auth.uid()) or private.is_admin());

create policy "Providers can update own profile"
on public.service_provider
for update
to authenticated
using (user_id = (select auth.uid()) or private.is_admin())
with check (user_id = (select auth.uid()) or private.is_admin());

create policy "Admins can delete service providers"
on public.service_provider
for delete
to authenticated
using (private.is_admin());

drop policy if exists "Users can manage their own orders" on public."order";
create policy "Users can insert own orders"
on public."order"
for insert
to authenticated
with check ("user" = (select auth.uid()));

create policy "Users can view own orders"
on public."order"
for select
to authenticated
using (
  "user" = (select auth.uid())
  or private.is_admin()
);

create policy "Users can update own orders"
on public."order"
for update
to authenticated
using ("user" = (select auth.uid()) or private.is_admin())
with check ("user" = (select auth.uid()) or private.is_admin());

create policy "Users can delete own orders"
on public."order"
for delete
to authenticated
using ("user" = (select auth.uid()) or private.is_admin());

drop policy if exists "Users can manage their own order items" on public.order_item;
create policy "Users can insert own order items"
on public.order_item
for insert
to authenticated
with check (
  exists (
    select 1
    from public."order" o
    where o.id = order_item."order"
      and o."user" = (select auth.uid())
  )
);

create policy "Users and merchants can view relevant order items"
on public.order_item
for select
to authenticated
using (
  exists (
    select 1
    from public."order" o
    where o.id = order_item."order"
      and o."user" = (select auth.uid())
  )
  or exists (
    select 1
    from public.product p
    join public.shops s on s.id = p.shop_id
    where p.id = order_item.product
      and s.owner_id = (select auth.uid())
  )
  or private.is_admin()
);

create policy "Users can update own order items"
on public.order_item
for update
to authenticated
using (
  exists (
    select 1
    from public."order" o
    where o.id = order_item."order"
      and o."user" = (select auth.uid())
  )
  or private.is_admin()
)
with check (
  exists (
    select 1
    from public."order" o
    where o.id = order_item."order"
      and o."user" = (select auth.uid())
  )
  or private.is_admin()
);

create policy "Users can delete own order items"
on public.order_item
for delete
to authenticated
using (
  exists (
    select 1
    from public."order" o
    where o.id = order_item."order"
      and o."user" = (select auth.uid())
  )
  or private.is_admin()
);

commit;
