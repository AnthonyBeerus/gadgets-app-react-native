import { supabase } from '../../../shared/lib/supabase';
import Purchases from 'react-native-purchases';

export interface GemTransaction {
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  metadata?: Record<string, any>;
}

/**
 * Add gems to user's balance
 * This calls a Supabase Edge Function which securely interacts with RevenueCat API
 */
export async function addGems(amount: number, reason: string, metadata?: Record<string, any>): Promise<void> {
  // Get RevenueCat user ID
  const customerInfo = await Purchases.getCustomerInfo();
  const userId = customerInfo.originalAppUserId;
  
  if (!userId) {
    throw new Error('Could not get RevenueCat user ID');
  }

  const { data, error } = await supabase.functions.invoke('gems-transaction', {
    body: {
      userId,
      amount,
      type: 'earn',
      reason,
      metadata,
    },
  });

  if (error) {
    console.error('Error adding gems:', error);
    throw error;
  }

  return data;
}

/**
 * Spend gems from user's balance
 * This calls a Supabase Edge Function which securely interacts with RevenueCat API
 */
export async function spendGems(amount: number, reason: string, metadata?: Record<string, any>): Promise<void> {
  // Get RevenueCat user ID
  const customerInfo = await Purchases.getCustomerInfo();
  const userId = customerInfo.originalAppUserId;
  
  if (!userId) {
    throw new Error('Could not get RevenueCat user ID');
  }

  const { data, error } = await supabase.functions.invoke('gems-transaction', {
    body: {
      userId,
      amount: -amount, // Negative for spending
      type: 'spend',
      reason,
      metadata,
    },
  });

  if (error) {
    console.error('Error spending gems:', error);
    throw error;
  }

  return data;
}
