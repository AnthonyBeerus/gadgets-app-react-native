
import { GET } from '../index+api';
import { supabase } from '../../../../shared/lib/supabase';

// Mock Supabase
jest.mock('../../../../shared/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('GET /api/products', () => {
  it('should return a list of products', async () => {
    // Mock Supabase response
    const mockProducts = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];

    const selectMock = jest.fn().mockReturnValue({
      data: mockProducts,
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: selectMock,
    });

    // Create a mock request
    const request = {
        url: 'http://localhost/api/products'
    } as Request;

    // Call API
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(supabase.from).toHaveBeenCalledWith('product');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(data).toEqual(mockProducts);
  });

  it('should filter by shop_id if provided', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1', shop_id: 123 }];
    
    // Mock chain: from -> select -> eq
    const eqMock = jest.fn().mockReturnValue({
      data: mockProducts,
      error: null,
    });
    const selectMock = jest.fn().mockReturnValue({
        eq: eqMock
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: selectMock,
    });

    const request = {
       url: 'http://localhost/api/products?shop_id=123'
    } as Request;

    const response = await GET(request);
    await response.json();

    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('shop_id', '123');
  });
});
