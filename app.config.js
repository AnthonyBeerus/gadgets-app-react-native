const VARIANTS = {
  development: {
    name: 'Muse Dev',
    identifier: 'com.kaizenicai.muse.dev',
    scheme: 'muse-dev',
  },
  preview: {
    name: 'Muse Preview',
    identifier: 'com.kaizenicai.muse.preview',
    scheme: 'muse-preview',
  },
  production: {
    name: 'Muse',
    identifier: 'com.kaizenicai.muse',
    scheme: 'muse',
  },
};

module.exports = ({ config }) => {
  const variantName = process.env.APP_VARIANT ?? 'production';
  const variant = VARIANTS[variantName];

  if (!variant) {
    throw new Error(`Unsupported APP_VARIANT: ${variantName}`);
  }

  const plugins = (config.plugins ?? []).filter(plugin =>
    (Array.isArray(plugin) ? plugin[0] : plugin) !== 'expo-dev-client'
  );

  return {
    ...config,
    name: variant.name,
    scheme: variant.scheme,
    ios: {
      ...config.ios,
      bundleIdentifier: variant.identifier,
    },
    android: {
      ...config.android,
      package: variant.identifier,
    },
    plugins: [
      ...plugins,
      ['expo-dev-client', { addGeneratedScheme: variantName === 'development' }],
    ],
    extra: {
      ...config.extra,
      appVariant: variantName,
    },
  };
};
