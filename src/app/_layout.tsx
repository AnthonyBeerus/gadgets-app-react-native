import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import AuthProvider, { useAuth } from "../shared/providers/auth-provider";
import QueryProvider from "../shared/providers/query-provider";
import NotificationProvider from "../shared/providers/notification-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RevenueCatProvider } from "../shared/providers/RevenueCatProvider";
import { FontProvider } from "../shared/providers/font-provider";
import { ThemeProvider } from "../shared/providers/theme-provider";
import { Platform } from "react-native";
import React from "react";

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

// Conditionally import Stripe only on native platforms
let StripeProvider: any = ({ children }: { children: React.ReactNode }) => <>{children}</>;

if (Platform.OS !== 'web') {
  const stripe = require("@stripe/stripe-react-native");
  StripeProvider = stripe.StripeProvider;
}

const AppNavigator = () => {
  const { activeRole } = useAuth();
  const isMerchant = activeRole === 'merchant';
  
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
        name="appointments"
        options={{
          headerShown: false,
          title: "Appointments",
          animation: 'ios_from_right',
        }}
      />
      <Stack.Screen
        name="services"
        options={{
          headerShown: false,
          animation: 'ios_from_right',
        }}
      />
      <Stack.Screen
        name="gem-shop"
        options={{
          headerShown: false,
          animation: 'ios_from_right',
        }}
      />
      <Stack.Screen
        name="auth"
        options={{ headerShown: false, title: "Auth" }}
      />
      <Stack.Screen
        name="order-success"
        options={{ headerShown: false, title: "Order Success" }}
      />
      <Stack.Screen
        name="orders"
        options={{ 
          headerShown: false, 
          title: "Orders", 
          presentation: 'card',
          animation: 'slide_from_right', 
        }} 
      />
      <Stack.Screen
        name="events"
        options={{ headerShown: false, title: "Events", animation: 'ios_from_right', }}
      />
      <Stack.Screen
        name="challenges"
        options={{ headerShown: false, title: "Challenges", animation: 'ios_from_right', }}
      />
      <Stack.Screen
        name="paywall"
        options={{ 
          presentation: "formSheet",
          headerShown: false, 
          title: "Upgrade to Pro",
        }}
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

function RootLayout() {
  return (
    <ThemeProvider>
      <FontProvider>
        <SafeAreaProvider>
          <ToastProvider>
          <AuthProvider>
            <QueryProvider>
              <StripeProvider
                publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
                <NotificationProvider>
                  <RevenueCatProvider>
                    <AppNavigator />
                  </RevenueCatProvider>
                </NotificationProvider>
              </StripeProvider>
            </QueryProvider>
          </AuthProvider>
        </ToastProvider>
      </SafeAreaProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
