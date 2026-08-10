const { getSentryExpoConfig } = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Keep test files out of production bundles. React Native owns the native
// fetch polyfill; redirecting it to cross-fetch's Node entry crashes Hermes
// before AppRegistry can register the application.
config.resolver.blockList = [
  /.*\/__tests__\/.*/,
  /.*\.test\.(ts|tsx|js|jsx)/,
];

module.exports = config;
