# 🏢 Malls Feature Implementation Guide

## Overview

This implementation adds a **Malls** table to support multiple shopping locations and marketplaces, starting with:

1. **Molapo Crossing** - The physical mall (default/featured)
2. **Indie Marketplace** - Online sellers and independent vendors

## 📋 Implementation Steps

### Step 1: Run the Migration

```bash
# Connect to your Supabase project and run:
supabase/migrations/20250923000000_add_malls_table.sql
```

This migration will:

- ✅ Create the `malls` table
- ✅ Add `mall_id` column to `shops` table
- ✅ Insert Molapo Crossing (id: 1) as the first mall
- ✅ Insert Indie Marketplace (id: 2) as the online marketplace
- ✅ Update all existing shops to belong to Molapo Crossing (mall_id = 1)
- ✅ Add database indexes for performance
- ✅ Set up RLS policies for security

### Step 2: Regenerate Database Types

After running the migration, regenerate your TypeScript types:

```bash
# Generate new types from Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

This will add the `malls` table type and update the `shops` table type with `mall_id`.

### Step 3: Restart the Development Server

```bash
npx expo start --clear
```

## 🎯 What's Been Added

### Database Schema

**New `malls` Table:**

```sql
- id (primary key)
- name (text)
- slug (unique text)
- description (text)
- location (text)
- image_url (text)
- hero_image (text)
- opening_hours (jsonb)
- contact_phone (text)
- contact_email (text)
- latitude (decimal)
- longitude (decimal)
- is_physical (boolean) - true for physical malls, false for online marketplaces
- is_featured (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

**Updated `shops` Table:**

- Added `mall_id` column (foreign key to malls.id)

### API Functions Added (src/api/shops.ts)

**Mall Functions:**

- `getMalls()` - Get all malls with shop counts
- `getMallById(mallId)` - Get specific mall by ID
- `getMallBySlug(slug)` - Get mall by slug
- `getFeaturedMalls()` - Get featured malls only
- `getShopsByMall(mallId)` - Get all shops for a specific mall

**Updated Functions:**

- `getShops()` - Now includes mall information in response

### UI Changes (src/components/shops-screen.tsx)

**New Mall Selector:**

- Horizontal scrollable mall cards at the top
- "All Locations" option to show shops from all malls
- Visual indicators for:
  - Physical malls (storefront icon)
  - Online marketplaces (globe icon)
  - Featured malls (star badge)
- Purple highlighting for selected mall
- Auto-updates shop list when mall is selected

**Dynamic Header:**

- Shows selected mall name and location
- Updates shop count based on current filter
- Defaults to "All Shops" when no mall is selected

**Filter Coordination:**

- Selecting a mall clears category and feature filters
- Selecting a category or feature clears mall filter
- Search works across all malls

## 🎨 User Experience

### Default View

- Shows "Molapo Crossing" by default (mall_id = 1)
- Displays all physical mall shops

### Indie Marketplace View

- Select "Indie Marketplace" to view online sellers
- Different visual treatment (globe icon vs storefront)
- Shows 24/7 availability

### All Locations View

- Select "All Locations" to browse shops from all malls
- Great for discovery and comparison

## 📊 Data Structure

### Molapo Crossing (Mall ID: 1)

```json
{
  "name": "Molapo Crossing",
  "location": "Gaborone, Botswana",
  "is_physical": true,
  "is_featured": true,
  "opening_hours": {
    "monday": "09:00 - 21:00",
    "friday": "09:00 - 22:00",
    "sunday": "10:00 - 20:00"
  }
}
```

### Indie Marketplace (Mall ID: 2)

```json
{
  "name": "Indie Marketplace",
  "location": "Online - Nationwide",
  "is_physical": false,
  "is_featured": true,
  "opening_hours": {
    "monday": "24/7",
    "tuesday": "24/7",
    ...
  }
}
```

## 🚀 Future Expansion

Easily add more malls:

```sql
INSERT INTO malls (name, slug, description, location, is_physical, is_featured)
VALUES
  ('Riverwalk Mall', 'riverwalk-mall', 'Description...', 'Gaborone', true, true),
  ('Game City', 'game-city', 'Description...', 'Gaborone', true, false);
```

Then assign shops:

```sql
UPDATE shops SET mall_id = 3 WHERE name IN ('Shop A', 'Shop B');
```

## 🔍 Testing Checklist

- [ ] Run migration successfully
- [ ] Regenerate database types
- [ ] Verify all existing shops have mall_id = 1
- [ ] Test mall selector UI (switch between malls)
- [ ] Verify shop filtering by mall works
- [ ] Test "All Locations" view
- [ ] Verify featured mall badges show correctly
- [ ] Test physical vs online mall icons
- [ ] Verify search works across all malls
- [ ] Test category filters clear mall selection
- [ ] Verify header updates with selected mall
- [ ] Test shop count updates correctly

## 🎯 Benefits

✅ **Scalability** - Easy to add new malls or marketplaces
✅ **Organization** - Clear separation between physical and online shops
✅ **User Experience** - Location-based filtering and discovery
✅ **Business Growth** - Support for multiple revenue streams
✅ **Data Integrity** - Proper relationships between malls and shops
✅ **Future Ready** - Foundation for delivery zones, mall-specific promotions, etc.

## 📝 Notes

- All existing shops are automatically assigned to Molapo Crossing (mall_id = 1)
- The UI defaults to showing Molapo Crossing on first load
- Indie Marketplace is ready for new sellers to be added
- Mall opening hours are stored as JSONB for flexibility
- RLS policies ensure data security

## 🆘 Troubleshooting

**TypeScript errors about "malls" table:**

- Run the migration first
- Regenerate database types
- Restart the dev server

**Shops not showing:**

- Check that shops have mall_id set
- Verify RLS policies are correct
- Check console for API errors

**Mall selector not appearing:**

- Ensure malls are inserted in database
- Check getMalls() API function
- Verify component is receiving mall data

---

Ready to transform your app into a multi-location marketplace! 🏢💜✨
