import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert, TextInput } from 'react-native';
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

describe('OpenShopScreen', () => {
  const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn() };
  const createMerchantShop = jest.fn().mockResolvedValue({ shop_id: 9 });
  const switchRole = jest.fn();
  const refreshProfile = jest.fn().mockResolvedValue({ role: 'MERCHANT' });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.canGoBack.mockReturnValue(true);
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useShopStore as unknown as jest.Mock).mockReturnValue({
      malls: [{ id: 1, name: 'Molapo Crossing' }],
      loadInitialData: jest.fn(),
    });
    (useAuth as jest.Mock).mockReturnValue({
      session: { user: { id: 'u1' } },
      isSignedIn: true,
      mounting: false,
      profileError: null,
      isMerchant: false,
      activeRole: 'shopper',
      createMerchantShop,
      switchRole,
      refreshProfile,
    });
  });

  it('creates a shop with mall and enters merchant mode', async () => {
    const { UNSAFE_getAllByType, getByText } = render(<OpenShopScreen />);

    const fields = UNSAFE_getAllByType(TextInput);
    fireEvent.changeText(fields[0], 'Test Kitchen');
    fireEvent.changeText(fields[1], 'Molapo Crossing');
    fireEvent.press(getByText('Continue'));
    fireEvent.press(getByText('Continue'));
    fireEvent.press(getByText('Open shop'));

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
      isSignedIn: true,
      mounting: false,
      profileError: null,
      isMerchant: true,
      activeRole: 'merchant',
      createMerchantShop,
      switchRole,
      refreshProfile,
    });

    const { getByText } = render(<OpenShopScreen />);
    expect(getByText('redirect:/(merchant)')).toBeTruthy();
  });

  it('preserves the open-shop destination when an anonymous visitor signs in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      session: null,
      isSignedIn: false,
      mounting: false,
      profileError: null,
      isMerchant: false,
      activeRole: 'shopper',
      createMerchantShop,
      switchRole,
      refreshProfile,
    });

    const { getByText } = render(<OpenShopScreen />);
    expect(getByText('redirect:/auth?returnTo=%2Fopen-shop')).toBeTruthy();
  });

  it('shows a recoverable account error instead of redirecting or rendering blank', () => {
    (useAuth as jest.Mock).mockReturnValue({
      session: null,
      isSignedIn: true,
      mounting: false,
      profileError: 'No suitable key was found to decode the JWT',
      isMerchant: false,
      activeRole: 'shopper',
      createMerchantShop,
      switchRole,
      refreshProfile,
    });

    const { getByText } = render(<OpenShopScreen />);
    expect(getByText('We could not prepare your Muse account')).toBeTruthy();
    fireEvent.press(getByText('Try again'));
    expect(refreshProfile).toHaveBeenCalled();
  });

  it('returns to Shops when Open a Shop is the first route in the navigator', () => {
    mockRouter.canGoBack.mockReturnValue(false);
    const { getByLabelText } = render(<OpenShopScreen />);

    fireEvent.press(getByLabelText('Go back'));

    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/(shop)/marketplace');
  });
});
