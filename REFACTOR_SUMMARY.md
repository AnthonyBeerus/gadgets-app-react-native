# Color Variants Refactor Summary

## Overview

Refactored the color variants system from a separate `product_variants` table to a **JSONB column** in the `product` table, and updated the UI to display variant images instead of color circles.

---

## Database Changes

### Migration: `20250921000000_refactor_to_jsonb_variants.sql`

**Actions:**

1. **Dropped** the old `product_variants` table
2. **Added** `color_variants` JSONB column to `product` table
3. **Added** check constraint to ensure `color_variants` is always an array
4. **Created** GIN index on `color_variants` for efficient JSONB querying

**JSONB Structure:**

```json
[
  {
    "color_name": "Black",
    "color_hex": "#000000",
    "image_url": "https://...",
    "stock_quantity": 25,
    "is_available": true
  }
]
```

### Seed Data: `product_variants_jsonb_seed.sql`

**Products Added (9 total):**

#### Mr Price (Shop)

1. Classic Cotton T-Shirt - 5 colors
2. Slim Fit Denim Jeans - 4 colors
3. Casual Hoodie - 5 colors

#### Edgars (Shop)

4. Formal Dress Shirt - 4 colors
5. Elegant Blazer - 4 colors
6. Chino Pants - 5 colors

#### Truworths (Shop)

7. Designer Polo Shirt - 5 colors
8. Summer Dress - 5 colors
9. Knit Sweater - 5 colors

**Total:** 41 color variants across 9 products

---

## TypeScript Changes

### `src/types/database.types.ts`

**Added:**

```typescript
export type ColorVariant = {
  color_name: string;
  color_hex: string;
  image_url: string;
  stock_quantity: number;
  is_available: boolean;
};
```

**Updated product type:**

- Added `color_variants: ColorVariant[]` to Row, Insert, and Update types

---

## API Changes

### `src/api/api.ts`

**Simplified:**

- Removed join query to `product_variants` table
- Now fetches `color_variants` directly from product row as JSONB
- Query: `SELECT * FROM product WHERE slug = ...`

---

## UI Changes

### `src/app/product/[slug].tsx`

**Component Updates:**

1. **State Management:**

   - Changed: `colorVariants = product?.color_variants || []` (from `product?.product_variants`)
   - Added: `currentHeroImage` computed from selected color variant

2. **Hero Image:**

   - Now dynamically updates based on selected color variant
   - Uses `currentHeroImage` instead of static `product.heroImage`

3. **Color Selection UI - MAJOR REDESIGN:**

**Before:** Color circles with hex background

```tsx
<View style={styles.colorCircle} backgroundColor={variant.color_hex} />
```

**After:** Image boxes showing actual product photos

```tsx
<Image source={{ uri: variant.image_url }} style={styles.variantImage} />
```

**New Features:**

- 80x80px image boxes with rounded corners
- Horizontal scroll for multiple variants
- Purple border on selected variant
- Checkmark icon overlay on selected image
- Stock quantity display below images
- Filters to show only available variants

**Styling:**

```typescript
variantImageBox: 80x80px, rounded, bordered
selectedVariantBox: purple border (3px)
variantImage: cover full box
variantCheckMark: top-right overlay with checkmark icon
```

---

## Benefits of JSONB Approach

### Advantages:

1. ✅ **Simpler Architecture** - No table joins required
2. ✅ **Atomic Updates** - All variants update together with product
3. ✅ **Single Source of Truth** - Product and variants in one row
4. ✅ **Faster Queries** - No JOIN overhead for product fetching
5. ✅ **Cleaner API** - Less complex query logic

### Trade-offs:

1. ⚠️ **Stock Updates** - Must read/modify/write entire JSON array
2. ⚠️ **Querying** - Finding "all products with Black color" requires JSONB operators
3. ⚠️ **Concurrency** - Multiple color stock updates lock same product row

---

## How to Apply

### Step 1: Run Migration

```bash
# In Supabase SQL Editor
Run: supabase/migrations/20250921000000_refactor_to_jsonb_variants.sql
```

### Step 2: Run Seed Data

```bash
# In Supabase SQL Editor
Run: supabase/seeds/product_variants_jsonb_seed.sql
```

### Step 3: Test

1. Navigate to a clothing product (e.g., `/product/classic-cotton-tshirt`)
2. Verify variant images appear in boxes below product details
3. Click different variant images - hero image should change
4. Verify stock quantity displays correctly
5. Check selected border and checkmark appear

---

## Files Modified

### Created:

- `supabase/migrations/20250921000000_refactor_to_jsonb_variants.sql`
- `supabase/seeds/product_variants_jsonb_seed.sql`

### Updated:

- `src/types/database.types.ts` - Added ColorVariant type, updated product types
- `src/api/api.ts` - Simplified product query (removed join)
- `src/app/product/[slug].tsx` - Redesigned color selection UI with image boxes

### Obsolete (can be removed):

- `supabase/migrations/20250920000000_add_product_color_variants.sql` (old table approach)
- `supabase/seeds/product_color_variants_seed.sql` (old insert statements)

---

## UI Preview

**Before:**

```
[●] [●] [●] [●]  <- Color circles
 Black White Navy Red
```

**After:**

```
[📷] [📷] [📷] [📷]  <- Product images
   ✓
25 in stock
```

---

## Future Enhancements

1. **Add Size Variants** - Extend JSONB to include size dimension
2. **Variant-Specific Pricing** - Add price field to color variants
3. **Low Stock Alerts** - Visual indicator when stock < 5
4. **Image Zoom** - Pinch-to-zoom on variant images
5. **Variant Filtering** - Filter products by available colors on listing pages

---

## Notes

- JSONB is production-ready in PostgreSQL and Supabase
- GIN index ensures efficient querying of JSONB contents
- Works seamlessly with Supabase RLS policies
- Compatible with existing shop-product relationship (shop_id BIGINT foreign key)
