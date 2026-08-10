import React from 'react';
import { render } from '@testing-library/react-native';
import MerchantDashboard from '../../../../app/(merchant)/index';
import { useAuth } from '../../../../shared/providers/auth-provider';
import { useRouter } from 'expo-router';
import { getMerchantDashboardStats, getShopChallenges, getShopProducts } from '../../../../shared/api/api';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Redirect: ({ href }: { href: string }) => {
    const ReactNative = require('react-native');
    return <ReactNative.Text>{`redirect:${href}`}</ReactNative.Text>;
  },
}));

jest.mock('../../../../shared/providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../../shared/api/api', () => ({
  getMerchantDashboardStats: jest.fn(),
  getShopProducts: jest.fn(),
  getShopChallenges: jest.fn(),
}));

describe('MerchantDashboard', () => {
  const mockRouter = { push: jest.fn(), replace: jest.fn() };
  const mockUser = { email: 'merchant@test.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (getMerchantDashboardStats as jest.Mock).mockReturnValue({
      data: {
        product_count: 0,
        pending_order_count: 0,
        todays_sales: 0,
      },
    });
    (getShopProducts as jest.Mock).mockReturnValue({ data: [] });
    (getShopChallenges as jest.Mock).mockReturnValue({ data: [] });
    (useAuth as jest.Mock).mockReturnValue({
      isMerchant: true,
      user: mockUser,
      merchantShopId: 1,
      createMerchantShop: jest.fn(),
      switchRole: jest.fn(),
    });
  });

  it('leads with work counters and the orders queue', () => {
    const { getByText } = render(<MerchantDashboard />);

    expect(getByText('Needs you now')).toBeTruthy();
    expect(getByText('New orders')).toBeTruthy();
    expect(getByText('No new orders')).toBeTruthy();
    expect(getByText('Add product')).toBeTruthy();
  });

  it('offers campaign funding when there is no active pot', () => {
    (getShopProducts as jest.Mock).mockReturnValue({
      data: [{ id: 1, is_available: true, maxQuantity: 10 }],
    });
    (getMerchantDashboardStats as jest.Mock).mockReturnValue({
      data: { product_count: 1, pending_order_count: 0, todays_sales: 0 },
    });

    const { getByText } = render(<MerchantDashboard />);
    expect(getByText('No funded campaign')).toBeTruthy();
    expect(getByText('Fund a campaign')).toBeTruthy();
  });

  it('redirects non-merchants to open-shop', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isMerchant: false,
      user: mockUser,
      merchantShopId: null,
      createMerchantShop: jest.fn(),
      switchRole: jest.fn(),
    });

    const { getByText } = render(<MerchantDashboard />);
    expect(getByText('redirect:/open-shop')).toBeTruthy();
  });
});
