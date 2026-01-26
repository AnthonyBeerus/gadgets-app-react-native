// Add any global test setup here
import '@testing-library/jest-native/extend-expect';

// Mock Expo modules if needed
global.__DEV__ = true;

// Mock environment variables for Supabase
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-purchases', () => ({
  configure: jest.fn(),
  setDebugLogsEnabled: jest.fn(),
  addCustomerInfoUpdateListener: jest.fn(),
  removeCustomerInfoUpdateListener: jest.fn(),
  getCustomerInfo: jest.fn().mockResolvedValue({}),
  getOfferings: jest.fn().mockResolvedValue({ current: null, all: {} }),
  purchasePackage: jest.fn().mockResolvedValue({}),
}));
