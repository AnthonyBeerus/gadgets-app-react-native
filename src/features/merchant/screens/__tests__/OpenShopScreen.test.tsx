import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import OpenShopScreen from '../OpenShopScreen';
import { useAuth } from '../../../../shared/providers/auth-provider';
import { useShopStore } from '../../../../store/shop-store';
import { useRouter } from 'expo-router';

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

jest.mock('../../../../store/shop-store', () => ({
  useShopStore: jest.fn(),
}));

jest.mock('../../open-shop-intent', () => ({
  clearOpenShopIntent: jest.fn().mockResolvedValue(undefined),
}));

describe('OpenShopScreen', () => {
  const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
  const createMerchantShop = jest.fn().mockResolvedValue({ shop_id: 9 });
  const switchRole = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useShopStore as jest.Mock).mockReturnValue({
      malls: [{ id: 1, name: 'Molapo Crossing' }],
      loadInitialData: jest.fn(),
    });
    (useAuth as jest.Mock).mockReturnValue({
      session: { user: { id: 'u1' } },
      mounting: false,
      isMerchant: false,
      createMerchantShop,
      switchRole,
    });
  });

  it('creates a shop with mall and enters merchant mode', async () => {
    const { getByPlaceholderText, getByText } = render(<OpenShopScreen />);

    fireEvent.changeText(getByPlaceholderText("e.g. Mama T's Soul Food"), 'Test Kitchen');
    fireEvent.changeText(getByPlaceholderText('Molapo Crossing, Unit B12'), 'Molapo Crossing');
    fireEvent.press(getByText('CREATE SHOP'));

    await waitFor(() => {
      expect(createMerchantShop).toHaveBeenCalledWith(expect.objectContaining({
        shopName: 'Test Kitchen',
        shopLocation: 'Molapo Crossing',
        shopMallId: 1,
      }));
      expect(switchRole).toHaveBeenCalledWith('merchant');
      expect(mockRouter.replace).toHaveBeenCalledWith('/(merchant)');
    });
  });

  it('redirects existing merchants to the merchant dashboard', () => {
    (useAuth as jest.Mock).mockReturnValue({
      session: { user: { id: 'u1' } },
      mounting: false,
      isMerchant: true,
      createMerchantShop,
      switchRole,
    });

    const { getByText } = render(<OpenShopScreen />);
    expect(getByText('redirect:/(merchant)')).toBeTruthy();
  });
});
