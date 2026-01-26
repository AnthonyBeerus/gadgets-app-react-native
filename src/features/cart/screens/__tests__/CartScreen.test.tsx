
import React from 'react';
import { render } from '@testing-library/react-native';
import CartScreen from '../CartScreen';
import { FlashList } from '@shopify/flash-list';

// Mock dependencies
jest.mock('../../../../shared/components/layout/AnimatedHeaderLayout', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        AnimatedHeaderLayout: ({ children }: any) => <View testID="animated-header-layout">{children}</View>
    }
});

jest.mock('../../../../store/cart-store', () => ({
    useCartStore: () => ({
        items: [{ id: '1', name: 'Product 1', price: 100, quantity: 1, image: 'http://e.com/1.jpg' }],
        removeItem: jest.fn(),
        incrementItem: jest.fn(),
        decrementItem: jest.fn(),
        getTotalPrice: () => 100,
        resetCart: jest.fn()
    })
}));

jest.mock('../../hooks/use-checkout', () => ({
    useCheckout: () => ({
        checkout: jest.fn(),
        isProcessing: false
    })
}));

jest.mock('../../../../shared/providers/auth-provider', () => ({
    useAuth: () => ({ session: { user: { id: '1' } } })
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn() })
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

describe('CartScreen Performance', () => {
    it('renders FlashList for cart items', () => {
        const { UNSAFE_getByType } = render(<CartScreen />);
        try {
            const list = UNSAFE_getByType(FlashList);
            expect(list).toBeTruthy();
        } catch(e) {
            throw new Error('FlashList not found');
        }
    });
});
