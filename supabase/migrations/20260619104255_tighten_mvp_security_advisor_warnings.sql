begin;

drop policy if exists "Public can view product images" on storage.objects;

revoke execute on function public.create_dev_merchant() from public, anon;
revoke execute on function public.create_merchant_shop(
  text,
  text,
  text,
  bigint,
  integer,
  text,
  text,
  boolean,
  boolean
) from public, anon;
revoke execute on function public.decrement_product_quantity(bigint, bigint) from public, anon;
revoke execute on function public.get_merchant_dashboard_stats(bigint) from public, anon;

grant execute on function public.create_dev_merchant() to authenticated;
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
grant execute on function public.decrement_product_quantity(bigint, bigint) to authenticated;
grant execute on function public.get_merchant_dashboard_stats(bigint) to authenticated;

commit;
