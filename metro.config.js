const { getSentryExpoConfig } = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Block whatwg-fetch AND exclude test files from bundling
config.resolver.blockList = [
  /node_modules\/whatwg-fetch\/.*/,
  /.*\/__tests__\/.*/,
  /.*\.test\.(ts|tsx|js|jsx)/,
];

config.resolver.extraNodeModules = {
  "whatwg-fetch": require.resolve("cross-fetch"),
};

module.exports = config;
