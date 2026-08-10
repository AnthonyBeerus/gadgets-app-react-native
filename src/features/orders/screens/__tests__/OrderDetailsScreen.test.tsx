import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import OrderDetailsScreen from '../OrderDetailsScreen';
import { getMyOrder } from '../../../../shared/api/api';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ slug: 'test-order-123' }),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  Stack: { Screen: () => null },
}));
jest.mock('@tanstack/react-query', () => ({ useQueryClient: () => ({ invalidateQueries: jest.fn() }) }));
jest.mock('../../../../shared/api/api', () => ({ getMyOrder: jest.fn(), performOrderAction: jest.fn() }));

const order = {
  id: 1,
  status: 'ready_for_collection',
  order_status: 'ready_for_collection',
  payment_status: 'succeeded',
  stripe_payment_status: 'succeeded',
  totalPrice: 100,
  total_minor: 10000,
  subtotal_minor: 10000,
  delivery_fee_minor: 0,
  currency: 'BWP',
  fulfilment_type: 'collection',
  fulfillment_token: 'token-123',
  order_items: [],
  delivery_orders: [],
  shops: { id: 37, name: 'Muse Alpha Shop' },
  slug: 'test-order-123',
  created_at: new Date().toISOString(),
};

function renderScreen() {
  return render(
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 320, height: 640 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
      <OrderDetailsScreen />
    </SafeAreaProvider>,
  );
}

describe('buyer fulfilment details', () => {
  it('shows a collection QR only after paid and ready', () => {
    (getMyOrder as jest.Mock).mockReturnValue({ data: order, isLoading: false, error: null, refetch: jest.fn() });
    const screen = renderScreen();
    expect(screen.getByText('Show this at the counter')).toBeTruthy();
    expect(screen.getByText('Or read the code aloud.')).toBeTruthy();
    expect(screen.queryByText('Scan to Collect')).toBeNull();
    expect(screen.queryByText(/Delete Order/)).toBeNull();
  });

  it('never shows a collection QR for delivery', () => {
    (getMyOrder as jest.Mock).mockReturnValue({ data: { ...order, fulfilment_type: 'delivery', order_status: 'out_for_delivery' }, isLoading: false, error: null, refetch: jest.fn() });
    expect(renderScreen().queryByText('READY TO COLLECT')).toBeNull();
  });
});
