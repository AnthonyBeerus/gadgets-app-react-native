export const PILOT_FEATURES = {
  services: false,
  events: false,
  gems: false,
  paywall: false,
  virtualTryOn: false,
  // Default on so the growth loop works without TikTok OAuth during pilot.
  // Set EXPO_PUBLIC_TIKTOK_MANUAL_FALLBACK=false to require API verification only.
  manualTikTokVerification: process.env.EXPO_PUBLIC_TIKTOK_MANUAL_FALLBACK !== 'false',
} as const;
