begin;

alter table public.users add column if not exists full_name text;
alter table public.users add column if not exists bio text;
alter table public.users add column if not exists phone_number text;
alter table public.users add column if not exists stripe_account_id text;

create or replace function public.ensure_clerk_profile(
  p_email text,
  p_full_name text default null,
  p_avatar_url text default null
) returns public.users
language plpgsql security definer
set search_path = public, pg_catalog
as $$
declare
  clerk_subject text := auth.jwt()->>'sub';
  normalized_email text := lower(btrim(p_email));
  profile public.users;
begin
  if clerk_subject is null or clerk_subject = '' then
    raise exception 'Not authenticated';
  end if;
  if normalized_email is null or normalized_email = '' then
    raise exception 'A verified email is required';
  end if;

  update public.users
  set email = normalized_email,
      avatar_url = coalesce(p_avatar_url, avatar_url, ''),
      full_name = coalesce(nullif(btrim(p_full_name), ''), full_name)
  where clerk_user_id = clerk_subject
  returning * into profile;

  if profile.id is null then
    insert into public.users (clerk_user_id, email, avatar_url, full_name, role, type)
    values (
      clerk_subject,
      normalized_email,
      coalesce(p_avatar_url, ''),
      nullif(btrim(p_full_name), ''),
      'CREATOR',
      'USER'
    )
    on conflict (email) do update
    set clerk_user_id = excluded.clerk_user_id,
        avatar_url = coalesce(excluded.avatar_url, users.avatar_url, ''),
        full_name = coalesce(excluded.full_name, users.full_name)
    returning * into profile;
  end if;

  return profile;
end;
$$;

revoke all on function public.ensure_clerk_profile(text, text, text) from public, anon;
grant execute on function public.ensure_clerk_profile(text, text, text) to authenticated;

create or replace function public.create_merchant_shop(
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
set search_path = public, private, pg_catalog
as $$
declare
  current_user_id uuid := private.current_profile_id();
  current_email text;
  normalized_name text := nullif(btrim(shop_name), '');
  normalized_location text := nullif(btrim(shop_location), '');
  owned_shop_id bigint;
  existing_provider_id bigint;
begin
  if current_user_id is null then
    raise exception 'Muse profile unavailable. Sign out, sign in, and try again.';
  end if;

  if normalized_name is null then
    raise exception 'Shop name is required';
  end if;

  if normalized_location is null then
    raise exception 'Shop location is required';
  end if;

  if shop_mall_id is not null and not exists (
    select 1 from public.malls where id = shop_mall_id
  ) then
    raise exception 'Selected mall is unavailable';
  end if;

  select email into current_email
  from public.users
  where id = current_user_id;

  select id into owned_shop_id
  from public.shops
  where owner_id = current_user_id
  order by created_at asc
  limit 1
  for update;

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
    ) values (
      normalized_name,
      nullif(btrim(coalesce(shop_description, '')), ''),
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
    ) returning id into owned_shop_id;
  else
    update public.shops
    set name = normalized_name,
        description = nullif(btrim(coalesce(shop_description, '')), ''),
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
    where id = owned_shop_id;
  end if;

  update public.users
  set role = 'MERCHANT'
  where id = current_user_id;

  select id into existing_provider_id
  from public.service_provider
  where shop_id = owned_shop_id
  order by created_at asc
  limit 1;

  return jsonb_build_object(
    'success', true,
    'shop_id', owned_shop_id,
    'provider_id', existing_provider_id
  );
end;
$$;

revoke all on function public.create_merchant_shop(
  text, text, text, bigint, integer, text, text, boolean, boolean
) from public, anon;
grant execute on function public.create_merchant_shop(
  text, text, text, bigint, integer, text, text, boolean, boolean
) to authenticated;

commit;
