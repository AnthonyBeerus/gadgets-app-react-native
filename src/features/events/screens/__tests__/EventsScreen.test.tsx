
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import EventsScreen from '../EventsScreen';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

// Mock shared components
jest.mock('../../../../shared/components/layout/AnimatedHeaderLayout', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        AnimatedHeaderLayout: ({ children }: any) => <View testID="animated-header-layout">{children}</View>
    }
});

// Mock api
jest.mock('../../api/events', () => ({
    fetchEvents: jest.fn().mockResolvedValue([
        { id: 1, title: 'Event 1', image: 'http://e.com/1.jpg', category: 'Music' }
    ])
}));

// Mock gem store
jest.mock('../../../gems/store/gem-store', () => ({
    useGemStore: () => ({ fetchBalance: jest.fn() })
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

describe('EventsScreen Performance', () => {
  it('renders FlashList for events', async () => {
    const { UNSAFE_getByType } = render(<EventsScreen />);
    
    await waitFor(() => {
      expect(UNSAFE_getByType(FlashList)).toBeTruthy();
    });
  });
});
