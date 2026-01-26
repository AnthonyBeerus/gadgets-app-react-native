
import React from 'react';
import { render } from '@testing-library/react-native';
import ShopsScreen from '../ShopsScreen';
import { useShopStore } from '../../../../store/shop-store';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

// Describe the mock store type
type ShopStore = {
  shops: any[];
  allShops: any[];
  categories: any[];
  malls: any[];
  selectedMall: number | null; // Changed to number to match mock value and usage
  selectedCategory: number | string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  loadInitialData: jest.Mock;
  setSelectedCategory: jest.Mock;
  setSearchQuery: jest.Mock;
};

// Mock the store
jest.mock('../../../../store/shop-store');

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));


// Mock shared components that might cause issues
jest.mock('../../../../shared/components/layout/AnimatedHeaderLayout', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        AnimatedHeaderLayout: ({ children }: any) => <View testID="animated-header-layout">{children}</View>
    }
});

describe('ShopsScreen Performance Refactor', () => {
  const mockLoadInitialData = jest.fn();
  const mockSetSelectedCategory = jest.fn();
  const mockSetSearchQuery = jest.fn();

  const mockShops = [
    { id: 1, name: 'Shop 1', image_url: 'http://example.com/1.jpg', category: { name: 'Cat 1' } },
    { id: 2, name: 'Shop 2', image_url: 'http://example.com/2.jpg', category: { name: 'Cat 2' } },
    { id: 3, name: 'Shop 3', image_url: 'http://example.com/3.jpg', category: { name: 'Cat 3' } },
  ];

  beforeEach(() => {
    (useShopStore as unknown as jest.Mock).mockReturnValue({
      shops: mockShops,
      allShops: mockShops,
      categories: [{ id: 1, name: 'Cat 1' }],
      malls: [{ id: 1, name: 'Mall 1' }],
      selectedMall: 1,
      selectedCategory: null,
      searchQuery: '',
      loading: false,
      error: null,
      loadInitialData: mockLoadInitialData,
      setSelectedCategory: mockSetSelectedCategory,
      setSearchQuery: mockSetSearchQuery,
    } as ShopStore);
  });

  it('RED: renders the FlashList for shop items', () => {
    const { UNSAFE_getByType } = render(<ShopsScreen />);
    
    // This should FAIL if FlashList is not used
    // We expect FlashList to be present for the main list
    // Note: We might find multiple FlashLists if the categories/carousel are also refactored,
    // but at least one should be present.
    try {
        const flashList = UNSAFE_getByType(FlashList);
        expect(flashList).toBeTruthy();
    } catch (e) {
        throw new Error('FlashList component not found. Ensure ShopsScreen uses FlashList instead of map/FlatList.');
    }
  });

  it('RED: uses expo-image for shop images', () => {
     // This needs to check deeper integration or component mocks
     // For now, let's verify if we can find usage of expo-image by checking if the module is imported/used
     // Since we can't easily check imports in runtime tests without mocking, 
     // we will check if the rendered tree contains the ExpoImage component.
     // However, ExpoImage needs native code. In Jest, we usually rely on mocks.
     
     // Ideally, we interpret this as: "Does the component render the Image from expo-image?"
     // If we mock expo-image, we can check for it.
     
     const { UNSAFE_getAllByType } = render(<ShopsScreen />);
     
     // This will fail if Image from expo-image is not used
     // We expect the shop cards (and arguably carousel items) to use Expo Image
     try {
         const images = UNSAFE_getAllByType(Image);
         expect(images.length).toBeGreaterThan(0);
     } catch(e) {
         throw new Error('Expo Image component not found. Ensure ShopsScreen (and children) uses Image from expo-image.');
     }
  });
});
