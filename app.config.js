// Dynamic Expo config: wraps the static app.json base config and overrides only the
// display name per APP_VARIANT so testers can tell builds apart.
//
// Intentionally constant across variants (do NOT override here):
// - android.package / ios.bundleIdentifier — Firebase google-services.json only registers
//   com.kaizenicai.muse; the Google Services Gradle plugin fails the build on a mismatch.
// - scheme ("muse") — used for muse:// deep links / OAuth redirects.
const VARIANT_NAME = {
  development: 'Muse Dev',
  preview: 'Muse Preview',
  production: 'Muse',
};

module.exports = ({ config }) => ({
  ...config,
  name: VARIANT_NAME[process.env.APP_VARIANT] ?? VARIANT_NAME.production,
});
