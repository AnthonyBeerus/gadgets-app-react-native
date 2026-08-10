import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ToastProvider } from "react-native-toast-notifications";
import { ClerkProvider, tokenCache } from '../shared/clerk';
import AuthProvider, { useAuth } from "../shared/providers/auth-provider";
import QueryProvider from "../shared/providers/query-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontProvider } from "../shared/providers/font-provider";
import { ThemeProvider, useTheme } from "../shared/providers/theme-provider";
import { DesignTokensProvider } from "../shared/design-system";
import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { notificationHref } from '../shared/navigation/notification-route';

import * as Sentry from '@sentry/react-native';

// 🚀 PERFORMANCE: Keep Sentry synchronous (required for error tracking)
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  profilesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 0.1,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllImages: true,
      maskAllText: true,
      maskAllVectors: true,
    }),
    navigationIntegration,
    Sentry.spotlightIntegration(),
  ],
  attachScreenshot: true,
});

import { StripeProviderWrapper } from "../shared/providers/stripe";

const AppNavigator = () => {
  const { isMerchant } = useAuth();
  const router = useRouter();
  React.useEffect(() => Notifications.addNotificationResponseReceivedListener(response => {
    const href = notificationHref(response.notification.request.content.data);
    if (href) router.push(href as never);
  }).remove, [router]);
  
  return (
    // Every Muse screen draws its own ScreenHeader, so the native header is off by
    // default. Registering a route only to hide its header is how the opportunity
    // and order-detail screens ended up with two stacked headers.
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(merchant)"
        options={{ headerShown: false, title: "Merchant Dashboard" }}
      />
      <Stack.Screen
        name="(shop)"
        options={{ headerShown: false, title: "Shop" }}
      />
      <Stack.Screen
        name="mall-selector"
        options={{
          presentation: "formSheet",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth"
        options={{ headerShown: false, title: "Auth" }}
      />
      <Stack.Screen
        name="account"
        options={{ title: "Account and security" }}
      />
      <Stack.Screen
        name="open-shop"
        options={{
          headerShown: false,
          title: "Open a Shop",
          animation: "ios_from_right",
        }}
      />
      <Stack.Screen
        name="opportunity/[id]/index"
        options={{ headerShown: false, title: "Campaign", animation: 'ios_from_right' }}
      />
      <Stack.Screen
        name="opportunity/[id]/submit"
        options={{ headerShown: false, title: "Submit content", animation: 'ios_from_right' }}
      />
    </Stack>
  );
}

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required');
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <ThemeProvider>
    <DesignTokensProvider>
      <FontProvider>
        <SafeAreaProvider>
          <ThemedStatusBar />
          <ToastProvider>
          <AuthProvider>
            <QueryProvider>
              <StripeProviderWrapper
                publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
                <AppNavigator />
              </StripeProviderWrapper>
            </QueryProvider>
          </AuthProvider>
        </ToastProvider>
      </SafeAreaProvider>
      </FontProvider>
    </DesignTokensProvider>
    </ThemeProvider>
    </ClerkProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);
