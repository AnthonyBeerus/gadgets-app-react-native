import { renderHook, act, waitFor } from '@testing-library/react-native';
import { createOrder } from '../api';
import { useAuth } from '../../providers/auth-provider';
import { supabase } from '../../lib/supabase';

// Mock dependencies
jest.mock('../../providers/auth-provider');
jest.mock('../../lib/supabase');
jest.mock('../../utils/utils', () => ({
  generateOrderSlug: jest.fn(() => 'ORDER-MOCK-123'),
}));

// Mock QueryClientProvider wrapper
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('createOrder API', () => {
  const mockUserId = 'user-123';
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: mockUserId } });
    jest.clearAllMocks();
  });

  it('creates a pending order without overriding the database fulfillment token', async () => {
    // Setup stable mocks for the chain
    const mockSingle = jest.fn().mockResolvedValue({ data: { id: 1, slug: 'ORDER-123' }, error: null });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
    // Configure supabase.from to return an object containing our stable mockInsert
    (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

    const { result } = renderHook(() => createOrder(), { wrapper: createWrapper() });
    
    await act(async () => {
      await result.current.mutateAsync({ totalPrice: 100 });
    });

    // Assert on the stable mock
    expect(supabase.from).toHaveBeenCalledWith('order');
    expect(mockInsert).toHaveBeenCalledTimes(1);
    
    const insertedData = mockInsert.mock.calls[0][0];
    
    expect(insertedData).toEqual(expect.objectContaining({
      user: mockUserId,
      totalPrice: 100,
      status: 'Pending',
      stripe_payment_status: 'pending',
    }));
    expect(insertedData).not.toHaveProperty('fulfillment_token');
  });
});
