import type { CartAttribution } from '../../../store/cart-store';
import type { CheckoutTotals, FulfilmentType } from '../domain/commerce';

export type CheckoutItemRequest = { productId: number; quantity: number };

export type CreateCheckoutRequest = {
  action: 'create';
  items: CheckoutItemRequest[];
  attribution: CartAttribution | null;
  idempotencyKey: string;
  customerEmail: string;
  fulfilment: {
    type: FulfilmentType;
    phone: string;
    address?: string;
    notes?: string;
  };
};

export type CreateCheckoutResponse = CheckoutTotals & {
  paymentIntent: string;
  publicKey: string;
  ephemeralKey: string;
  customer: string;
  orderId: number;
  reservationExpiresAt: string;
  paymentStatus: 'requires_payment' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'partially_refunded' | 'refunded';
};
