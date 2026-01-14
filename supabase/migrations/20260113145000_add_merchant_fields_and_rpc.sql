-- Add user_id column to service_provider for linking to auth.users
ALTER TABLE public.service_provider
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create a Secure RPC function to create a Dev Merchant environment
-- This creates a Dummy Shop and a Dummy Provider linked to the calling user.
CREATE OR REPLACE FUNCTION create_dev_merchant()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_shop_id BIGINT;
  new_provider_id BIGINT;
  current_user_id UUID;
BEGIN
  -- 1. Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 2. Check for existing link
  IF EXISTS (SELECT 1 FROM public.service_provider WHERE user_id = current_user_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'User already has a merchant account'
    );
  END IF;

  -- 3. Create Dev Shop
  INSERT INTO public.shops (
    name,
    location,
    description,
    is_active,
    has_online_ordering,
    has_delivery,
    has_collection
  ) VALUES (
    'Dev Shop',
    'Test Location',
    'A temporary shop for testing merchant mode.',
    true,
    true,
    true,
    true
  ) RETURNING id INTO new_shop_id;

  -- 4. Create Dev Provider linked to User and Shop
  INSERT INTO public.service_provider (
    name,
    email,
    shop_id,
    user_id,
    is_active,
    is_verified,
    description,
    phone
  ) VALUES (
    'Dev Merchant',
    'dev@merchant.test',
    new_shop_id,
    current_user_id,
    true,
    true,
    'This is a test merchant account.',
    '000-000-0000'
  ) RETURNING id INTO new_provider_id;

  RETURN jsonb_build_object(
    'success', true,
    'provider_id', new_provider_id,
    'shop_id', new_shop_id
  );
END;
$$;
