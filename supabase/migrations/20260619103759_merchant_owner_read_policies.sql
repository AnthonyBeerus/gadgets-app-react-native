begin;

drop policy if exists "Shop owners can view own products" on public.product;
create policy "Shop owners can view own products"
on public.product
for select
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

drop policy if exists "Shop owners can view own product variants" on public.product_variants;
create policy "Shop owners can view own product variants"
on public.product_variants
for select
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

commit;
