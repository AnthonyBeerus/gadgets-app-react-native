import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GemBalanceChip } from '../gem-balance-chip';
import { useGemStore } from '../../../../features/gems/store/gem-store';
import { useRouter } from 'expo-router';

// Mocks
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../../features/gems/store/gem-store', () => ({
  useGemStore: jest.fn(),
}));

jest.mock('../../../constants/neobrutalism', () => ({
  NEO_THEME: {
    colors: { 
      primary: '#6B46C1',
      gemGold: '#F6AD55',
      black: '#1A202C',
      success: '#48BB78'
    },
    fonts: { bold: 'Inter_700Bold' },
    borders: { width: 3 },
    shadows: { hardSmall: '2px 2px 0px #1A202C' }
  }
}));

jest.mock('react-native-purchases', () => ({
  LOG_LEVEL: {},
  configure: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Global Reanimated mock
global.ReanimatedDataMock = {
  now: () => 0,
};

describe('GemBalanceChip', () => {
  const mockPush = jest.fn();
  const mockFetchBalance = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useGemStore as unknown as jest.Mock).mockReturnValue({
      balance: 1250,
      fetchBalance: mockFetchBalance,
    });
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<GemBalanceChip />);
  });

  it('should fetch balance on mount', () => {
    render(<GemBalanceChip />);
    expect(mockFetchBalance).toHaveBeenCalled();
  });

  it('should display formatted balance', () => {
    const { getByText } = render(<GemBalanceChip />);
    // Balance 1250 formatted as "1,250"
    expect(getByText(/1.?250/)).toBeTruthy();
  });
});
