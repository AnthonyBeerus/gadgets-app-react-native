export type FulfilmentType = 'collection' | 'delivery';

export type PaymentStatus =
  | 'requires_payment'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'partially_refunded'
  | 'refunded';

export type OrderStatus =
  | 'awaiting_payment'
  | 'paid'
  | 'accepted'
  | 'preparing'
  | 'ready_for_collection'
  | 'out_for_delivery'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type CheckoutTotals = {
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  currency: 'BWP';
};

export function calculateCheckoutTotals(
  items: ReadonlyArray<{ price: number; quantity: number }>,
  fulfilmentType: FulfilmentType,
  deliveryFee: number,
): CheckoutTotals {
  const subtotalMinor = items.reduce(
    (total, item) => total + Math.round(item.price * 100) * item.quantity,
    0,
  );
  const deliveryFeeMinor = fulfilmentType === 'delivery' ? Math.round(deliveryFee * 100) : 0;

  return {
    subtotalMinor,
    deliveryFeeMinor,
    totalMinor: subtotalMinor + deliveryFeeMinor,
    currency: 'BWP',
  };
}

export function isBotswanaPhone(value: string): boolean {
  return /^(?:\+267|267)?[237]\d{7}$/.test(value.replace(/[\s-]/g, ''));
}

export function canShowCollectionQr(order: {
  fulfilmentType: FulfilmentType;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}): boolean {
  return order.fulfilmentType === 'collection'
    && order.orderStatus === 'ready_for_collection'
    && order.paymentStatus === 'succeeded';
}
