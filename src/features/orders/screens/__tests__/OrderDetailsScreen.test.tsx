import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrderDetailsScreen from '../OrderDetailsScreen';
import { useLocalSearchParams, useRouter, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../shared/providers/auth-provider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocks
jest.mock('expo-router', () => ({

  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
  Stack: {
    Screen: jest.fn(() => null),
  },
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(() => ({ invalidateQueries: jest.fn() })),
}));

jest.mock('../../../../shared/providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../../shared/api/api', () => ({
  getMyOrder: jest.fn(),
}));

describe('OrderDetailsScreen Scanner Integration', () => {
  const mockRouter = { push: jest.fn() };
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue({ slug: 'test-order-123' });
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user_123' } });
  });

  it('should render Scan to Collect button for pending orders and navigate on press', () => {
    // Mock Pending Order Data via getMyOrder
    (require('../../../../shared/api/api').getMyOrder as jest.Mock).mockReturnValue({
      data: {
        id: 1,
        status: 'pending', // Pending orders should be collectable
        totalPrice: 100,
        order_items: [],
        slug: 'test-order-123',
        created_at: new Date().toISOString(),
      },
      isLoading: false,
      error: null,
    });


    const { getByText } = render(
      <SafeAreaProvider initialMetrics={{
        frame: { x: 0, y: 0, width: 320, height: 640 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
        <OrderDetailsScreen />
      </SafeAreaProvider>
    );
    
    // RED: This button should not exist yet
    const scanButton = getByText('Scan to Collect');
    expect(scanButton).toBeTruthy();

    fireEvent.press(scanButton);
    // Should navigate to scanner with special mode or just scanner
    expect(router.push).toHaveBeenCalledWith('/scan-order'); 
  });
});
