import React from 'react';
import { render } from '@testing-library/react-native';
import MerchantDashboard from '../../../../app/(merchant)/index';
import { useAuth } from '../../../../shared/providers/auth-provider';
import { useRouter } from 'expo-router';
import { getMerchantDashboardStats } from '../../../../shared/api/api';

// Mocks
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../../shared/providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../../shared/api/api', () => ({
  getMerchantDashboardStats: jest.fn(),
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
    (useAuth as jest.Mock).mockReturnValue({
      isMerchant: true,
      user: mockUser,
      merchantShopId: 1,
      createMerchantShop: jest.fn(),
      switchRole: jest.fn(),
    });
  });

  it('renders real zero-state merchant metrics and add-product CTA', async () => {
    const { getByText } = render(<MerchantDashboard />);

    expect(getByText('Pending Orders')).toBeTruthy();
    expect(getByText("Today's Sales")).toBeTruthy();
    expect(getByText('Products')).toBeTruthy();
    expect(getByText('Add Product')).toBeTruthy();
  });
});
