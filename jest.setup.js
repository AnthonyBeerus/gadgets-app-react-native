// Add any global test setup here
import '@testing-library/jest-native/extend-expect';

// Mock Expo modules if needed
global.__DEV__ = true;

// Mock environment variables for Supabase
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const ReactNative = require('react-native');

  const passthrough = (value, _config, callback) => {
    if (typeof callback === 'function') {
      callback(true);
    }
    return value;
  };

  const Animated = {
    View: ReactNative.View,
    Text: ReactNative.Text,
    Image: ReactNative.Image,
    ScrollView: ReactNative.ScrollView,
    FlatList: ReactNative.FlatList,
    createAnimatedComponent: (Component) => Component,
  };
  const animationBuilder = {
    delay: () => animationBuilder,
    duration: () => animationBuilder,
    easing: () => animationBuilder,
    springify: () => animationBuilder,
  };

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    Easing: ReactNative.Easing,
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    useAnimatedRef: () => React.createRef(),
    useAnimatedScrollHandler: (handlers) => handlers,
    useAnimatedStyle: (updater) => updater(),
    useDerivedValue: (updater) => ({ value: updater() }),
    useSharedValue: (value) => ({ value }),
    withDelay: (_delay, value) => value,
    withRepeat: (value) => value,
    withSequence: (...values) => values[values.length - 1],
    withSpring: passthrough,
    withTiming: passthrough,
    FadeIn: animationBuilder,
    FadeInDown: animationBuilder,
  };
});

jest.mock('react-native-worklets', () => ({
  __esModule: true,
  createWorkletRuntime: jest.fn(),
  executeOnUIRuntimeSync: (fn) => fn,
  makeShareable: (value) => value,
  makeShareableCloneRecursive: (value) => value,
  runOnJS: (fn) => fn,
  runOnRuntime: (_runtime, fn) => fn,
  runOnUI: (fn) => fn,
}));

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
