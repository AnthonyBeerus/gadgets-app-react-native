# Manual Setup Instructions for Appointment Booking

Since the Supabase CLI is having issues, follow these steps manually in your Supabase Dashboard:

## Step 1: Apply Migration (Add shop_id to service_provider)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste this SQL:

```sql
-- Add shop_id column to service_provider table
ALTER TABLE service_provider
ADD COLUMN IF NOT EXISTS shop_id bigint;

-- Add foreign key constraint
ALTER TABLE service_provider
ADD CONSTRAINT service_provider_shop_id_fkey
FOREIGN KEY (shop_id)
REFERENCES shops(id)
ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_service_provider_shop_id
ON service_provider(shop_id);

-- Add comment
COMMENT ON COLUMN service_provider.shop_id IS 'Link to the shop this provider belongs to';
```

4. Click **Run** to execute

## Step 2: Run Seed Data

1. Still in **SQL Editor**, create another new query
2. Copy the **entire contents** of `supabase/seeds/shop_appointments_seed.sql`
3. Paste into the SQL Editor
4. Click **Run** to execute

## Step 3: Verify Data Was Created

Run this query to check if services were created:

```sql
-- Check service categories
SELECT * FROM service_category;

-- Check service providers with shop_id
SELECT id, name, shop_id FROM service_provider WHERE shop_id IS NOT NULL;

-- Check services by shop
SELECT
  s.name as service_name,
  sp.name as provider_name,
  sp.shop_id,
  sh.name as shop_name
FROM service s
JOIN service_provider sp ON s.provider_id = sp.id
JOIN shops sh ON sp.shop_id = sh.id
ORDER BY sh.name, s.name;
```

## Step 4: Regenerate TypeScript Types

Back in your terminal, run:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

## Step 5: Test in App

1. Restart your Expo app: `npm start`
2. Open a shop that should have appointments (e.g., "Nails by Thato", "Braids by Mpho")
3. Click "Book Appointment"
4. Verify services appear

## Troubleshooting

If services still don't show:

1. **Check shop has appointment booking enabled:**

```sql
SELECT id, name, has_appointment_booking
FROM shops
WHERE has_appointment_booking = true;
```

2. **Check which shops have services:**

```sql
SELECT DISTINCT sh.id, sh.name, COUNT(s.id) as service_count
FROM shops sh
JOIN service_provider sp ON sp.shop_id = sh.id
JOIN service s ON s.provider_id = sp.id
GROUP BY sh.id, sh.name
ORDER BY sh.name;
```

3. **Enable appointment booking for specific shops** (if needed):

```sql
-- For beauty/hair shops in main mall
UPDATE shops
SET has_appointment_booking = true
WHERE id IN (79, 80, 81, 77, 83, 84, 85, 86, 87, 88, 89, 90);

-- For indie marketplace beauty shops
UPDATE shops
SET has_appointment_booking = true
WHERE id IN (198, 199, 200, 201, 202, 203, 204);
```
