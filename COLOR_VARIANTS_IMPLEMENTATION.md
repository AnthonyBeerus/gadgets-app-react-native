# Product Color Variants - Implementation Summary

## Database Changes

### 1. Migration File Created

**File**: `supabase/migrations/20250920000000_add_product_color_variants.sql`

This migration creates the `product_variants` table with the following structure:

- `id` - Primary key
- `product_id` - Foreign key to product table
- `color_name` - Human-readable color name (e.g., "Black", "Navy Blue")
- `color_hex` - Hexadecimal color code (e.g., "#000000", "#001F3F")
- `image_url` - Optional URL for color-specific product image
- `stock_quantity` - Available stock for this color variant
- `is_available` - Boolean flag for availability
- `created_at` / `updated_at` - Timestamps

**Features**:

- Unique constraint on `(product_id, color_name)` to prevent duplicates
- Indexes on `product_id` and `is_available` for performance
- Row Level Security (RLS) enabled with public read access
- Policies for authenticated users to manage variants

### 2. Seed Data Created

**File**: `supabase/seeds/product_color_variants_seed.sql`

This seed file:

- Inserts 9 clothing products across 3 fashion shops (Mr Price, Edgars, Truworths)
- Adds 4-5 color variants for each product
- Total of 41 color variants

**Products Added**:

1. **Mr Price** (shop_id: 5)

   - Classic Cotton T-Shirt (5 colors)
   - Slim Fit Denim Jeans (4 colors)
   - Casual Hoodie (5 colors)

2. **Edgars** (shop_id: 6)

   - Formal Dress Shirt (4 colors)
   - Elegant Blazer (4 colors)
   - Chino Pants (5 colors)

3. **Truworths** (shop_id: 7)
   - Designer Polo Shirt (5 colors)
   - Summer Dress (5 colors)
   - Knit Sweater (5 colors)

### 3. TypeScript Types Updated

**File**: `src/types/database.types.ts`

Added `product_variants` table type definition with Row, Insert, Update interfaces and Relationships.

## How to Apply

### Step 1: Run the Migration

```bash
# Using Supabase CLI
supabase db push

# Or directly in Supabase Studio SQL Editor
# Copy and run: supabase/migrations/20250920000000_add_product_color_variants.sql
```

### Step 2: Run the Seed Data

```bash
# Using Supabase CLI
supabase db seed product_color_variants_seed

# Or directly in Supabase Studio SQL Editor
# Copy and run: supabase/seeds/product_color_variants_seed.sql
```

### Step 3: Update Frontend Code

The product details screen (`src/app/product/[slug].tsx`) already has color variant UI built in. You need to:

1. Update the API to fetch color variants from the database
2. Replace the mock `COLOR_VARIANTS` array with data from `product_variants` table
3. Update the `getProduct` API call to include variants

## Example API Query

```typescript
// In src/api/api.ts or similar
const getProductWithVariants = async (slug: string) => {
  const { data: product } = await supabase
    .from("product")
    .select(
      `
      *,
      category:category(*),
      variants:product_variants(*)
    `
    )
    .eq("slug", slug)
    .single();

  return product;
};
```

## Color Variants Available

Each product has realistic color options:

- T-Shirts: Black, White, Navy Blue, Gray, Red
- Jeans: Dark Blue, Light Blue, Black, Gray
- Hoodies: Black, Gray, Navy, Burgundy, Forest Green
- Dress Shirts: White, Light Blue, Pink, Lavender
- Blazers: Black, Navy, Charcoal, Tan
- Chinos: Khaki, Navy, Black, Olive, Beige
- Polo Shirts: White, Navy, Red, Green, Yellow
- Dresses: Coral, Sky Blue, Mint Green, Yellow, Pink
- Sweaters: Cream, Burgundy, Forest Green, Charcoal, Navy

## Notes

- All color variants include stock quantities (6-30 units per color)
- All variants are marked as available (`is_available = true`)
- Products use high-quality Unsplash images
- Price ranges from $29.99 to $149.99
- All products are assigned to existing fashion shops in the mall
