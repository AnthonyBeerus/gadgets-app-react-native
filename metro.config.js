const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Block whatwg-fetch and use cross-fetch instead
config.resolver.blockList = [/node_modules\/whatwg-fetch\/.*/];

config.resolver.extraNodeModules = {
  "whatwg-fetch": require.resolve("cross-fetch"),
};

module.exports = config;
