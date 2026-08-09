import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ToastProvider } from "react-native-toast-notifications";
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import AuthProvider, { useAuth } from "../shared/providers/auth-provider";
import QueryProvider from "../shared/providers/query-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontProvider } from "../shared/providers/font-provider";
import { ThemeProvider, useTheme } from "../shared/providers/theme-provider";
import { DesignTokensProvider } from "../shared/design-system";
import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
  
  return (
    <Stack>
      <Stack.Protected guard={isMerchant}>
        <Stack.Screen
          name="(merchant)"
          options={{ headerShown: false, title: "Merchant Dashboard" }}
        />
        <Stack.Screen
          name="scan-order"
          options={{ 
            presentation: "fullScreenModal",
            headerShown: false, 
            title: "Scan Order",
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Protected>

      <Stack.Screen
        name="(shop)"
        options={{ headerShown: false, title: "Shop" }}
      />
      <Stack.Screen
        name="categories"
        options={{ headerShown: false, title: "Categories", animation: 'ios_from_right', }}
      />
      <Stack.Screen
        name="product"
        options={{ headerShown: false, title: "Product", animation: 'ios_from_right', }}
      />
      <Stack.Screen
        name="shop"
        options={{ headerShown: false, title: "Shop Details", animation: 'ios_from_right', }}
      />
      <Stack.Screen
        name="cart"
        options={{
          presentation: "modal",
          headerShown: false,
          title: "Cart",
        }}
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
        name="bag"
        options={{
          headerShown: false,
          title: "Bag",
          animation: "ios_from_right",
        }}
      />
      <Stack.Screen
        name="saved-opportunities"
        options={{
          headerShown: false,
          title: "Saved",
          animation: "ios_from_right",
        }}
      />
      <Stack.Screen
        name="order-success"
        options={{ headerShown: false, title: "Order Success" }}
      />
      <Stack.Screen
        name="orders/index"
        options={{ 
          headerShown: false, 
          title: "Orders", 
          presentation: 'card',
          animation: 'slide_from_right', 
        }} 
      />
      <Stack.Screen
        name="challenges"
        options={{ headerShown: false, title: "Challenges", animation: 'ios_from_right', }}
      />
      <Stack.Screen
          name="create-product"
          options={{
            headerShown: false,
            title: "Create Product",
            animation: 'ios_from_right',
          }}
        />
      <Stack.Screen
          name="(modal)"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.5, 0.75],
            sheetGrabberVisible: true,
            headerShown: false,
          }}
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
