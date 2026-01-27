
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import { Tables } from '../../../shared/types/database.types';

export const useProducts = (shopId?: number) => {
  return useQuery({
    queryKey: ['products', shopId],
    queryFn: async () => {
      let path = '/api/products';
      if (shopId) {
        path += `?shop_id=${shopId}`;
      }
      try {
        const response = await apiClient.get<Tables<'product'>[]>(path);
        console.log('useProducts response length:', response?.length);
        return response;
      } catch (e) {
        console.error('useProducts error:', e);
        throw e;
      }
    },
  });
};
