
import { POST } from '../index+api';
import { supabase } from '../../../../shared/lib/supabase';
import { generateOrderSlug } from '../../../../shared/utils/utils';

// Mock Supabase & Utils
jest.mock('../../../../shared/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock('../../../../shared/utils/utils', () => ({
    generateOrderSlug: jest.fn().mockReturnValue('mock-slug-123')
}));

describe('POST /api/orders', () => {
    const validOrder = {
        totalPrice: 100,
        paymentIntentId: 'pi_test_123',
        userId: 'user_123',
        items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
        ]
    };

  it('should return 400 if validation fails', async () => {
    const request = {
       json: async () => ({})
    } as Request;

    const response = await POST(request);
    
    expect(response.status).toBe(400);
  });

  it('should create order and items', async () => {
     // Mock Supabase responses
     const insertOrderMock = jest.fn().mockReturnValue({
         data: { id: 1, slug: 'order-123' },
         error: null,
         select: jest.fn().mockReturnValue({
             single: jest.fn().mockResolvedValue({ data: { id: 1, slug: 'order-123' }, error: null })
         })
     });

     const insertItemsMock = jest.fn().mockReturnValue({
         error: null
     });

     (supabase.from as jest.Mock).mockImplementation((table) => {
         if (table === 'order') return { insert: insertOrderMock };
         if (table === 'order_item') return { insert: insertItemsMock };
         return {};
     });

    const request = {
       json: async () => validOrder
    } as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe(1);
    expect(insertOrderMock).toHaveBeenCalledWith(expect.objectContaining({
        total_amount: 100,
        payment_intent_id: 'pi_test_123',
        user_id: 'user_123'
    }));
  });
});
