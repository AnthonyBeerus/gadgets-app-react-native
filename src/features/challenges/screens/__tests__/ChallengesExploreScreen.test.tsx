
import React from 'react';
import { render } from '@testing-library/react-native';
import ChallengesExploreScreen from '../ChallengesExploreScreen';
import { FlashList } from '@shopify/flash-list';

// Mock store
jest.mock('../../store/challenge-store', () => ({
    useChallengeStore: () => ({
        challenges: [{ id: 1, title: 'Challenge 1' }],
        loading: false,
        fetchChallenges: jest.fn()
    })
}));

// Mock context
jest.mock('../../../../shared/context/CollapsibleTabContext', () => ({
    useCollapsibleTab: () => ({
        scrollY: { value: 0 },
        headerHeight: 0,
        tabBarHeight: 0
    })
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

describe('ChallengesExploreScreen Performance', () => {
  it('RED: renders FlashList for challenges', () => {
      const { UNSAFE_getByType } = render(<ChallengesExploreScreen />);
      try {
          const ml = UNSAFE_getByType(FlashList);
          expect(ml).toBeTruthy();
      } catch(e) {
          throw new Error('FlashList not found');
      }
  });
});
