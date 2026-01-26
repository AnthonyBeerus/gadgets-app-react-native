
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import { Tables } from '../../../shared/types/database.types';

export const useProducts = (shopId?: number) => {
  return useQuery({
    queryKey: ['products', shopId],
    queryFn: async () => {
      let path = '/products';
      if (shopId) {
        path += `?shop_id=${shopId}`;
      }
      return apiClient.get<Tables<'product'>[]>(path);
    },
  });
};
