// @ts-nocheck - This is a Deno runtime file for Supabase Edge Functions
// The TypeScript errors are expected in a Node.js environment but will work in Deno

// Supabase Edge Function: gems-transaction
// Deploy to: supabase/functions/gems-transaction/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const REVENUECAT_SECRET_KEY = Deno.env.get('REVENUECAT_SECRET_KEY')!
const REVENUECAT_PROJECT_ID = Deno.env.get('REVENUECAT_PROJECT_ID')!
const REVENUECAT_API_URL = 'https://api.revenuecat.com/v2'

interface GemTransactionRequest {
  userId: string
  amount: number
  type: 'earn' | 'spend'
  reason: string
  metadata?: Record<string, any>
}

serve(async (req) => {
  try {
    // Validate request
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const { userId, amount, type, reason, metadata }: GemTransactionRequest = await req.json()

    // Validate inputs
    if (!userId || !amount || !type || !reason) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }),{
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verify user authentication with Supabase (but don't compare IDs since userId is RevenueCat ID)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid Supabase session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Note: userId is the RevenueCat App User ID, not the Supabase user ID
    // We just verify the user has a valid Supabase session

    // Call RevenueCat API to adjust virtual currency
    // Format according to docs: {"adjustments": {"GEM": 100}}
    const adjustments = {
      GEM: amount  // Positive for add, negative for spend
    }

    const apiUrl = `${REVENUECAT_API_URL}/projects/${REVENUECAT_PROJECT_ID}/customers/${userId}/virtual_currencies/transactions`
    
    console.log('Calling RevenueCat API:', apiUrl)
    console.log('Adjustments:', adjustments)

    const rcResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adjustments
      }),
    })

    const rcData = await rcResponse.json()

    if (!rcResponse.ok) {
      console.error('RevenueCat API error:', rcData)
      return new Response(JSON.stringify({ error: 'Transaction failed', details: rcData }), {
        status: rcResponse.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, data: rcData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing gem transaction:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json'},
    })
  }
})
