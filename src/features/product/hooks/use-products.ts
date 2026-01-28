import { useQuery } from '@tanstack/react-query';
import { getShopProducts } from '../../../shared/api/shops';
import { supabase } from '../../../shared/lib/supabase';
import { Tables } from '../../../shared/types/database.types';

export const useProducts = (shopId?: number) => {
  return useQuery({
    queryKey: ['products', shopId],
    queryFn: async () => {
      try {
        if (shopId) {
          console.log('Fetching products for shop:', shopId);
          return await getShopProducts(shopId);
        }
        
        // Fallback for all products if no shopId provided
        console.log('Fetching all products');
        const { data, error } = await supabase
          .from('product')
          .select('*');
          
        if (error) throw error;
        return data;
      } catch (e) {
        console.error('useProducts error:', e);
        throw e;
      }
    },
  });
};
