# Deploy Supabase Edge Function for Gem Transactions

This guide will help you deploy the Supabase Edge Function that handles gem transactions securely.

## Prerequisites

1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`

## Set Environment Variables

You need to set your RevenueCat Secret Key as an environment variable:

```bash
supabase secrets set REVENUECAT_SECRET_KEY=your_revenuecat_secret_key_here
```

## Deploy the Function

```bash
supabase functions deploy gems-transaction
```

## Test the Function

You can test the function locally before deploying:

```bash
# Start the local Supabase stack
supabase start

# Serve the function locally  
supabase functions serve gems-transaction --env-file ./supabase/.env.local

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/gems-transaction' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"userId":"test-user-id","amount":100,"type":"earn","reason":"Test reward"}'
```

## Notes

- The function validates that the userId from the request matches the authenticated user
- Transaction amounts are sent directly to RevenueCat's API
- Make sure your RevenueCat Secret Key has the necessary permissions (Customer Configuration, Customer Purchases Configuration)
