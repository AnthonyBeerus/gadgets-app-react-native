import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import AuthProvider from "../shared/providers/auth-provider";
import QueryProvider from "../shared/providers/query-provider";
import NotificationProvider from "../shared/providers/notification-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RevenueCatProvider } from "../shared/providers/RevenueCatProvider";
import { Platform } from "react-native";
import React from "react";

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: __DEV__, // Only enable debug in development
});

// Conditionally import Stripe only on native platforms
let StripeProvider: any = ({ children }: { children: React.ReactNode }) => <>{children}</>;

if (Platform.OS !== 'web') {
  const stripe = require("@stripe/stripe-react-native");
  StripeProvider = stripe.StripeProvider;
}

function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <QueryProvider>
            <StripeProvider
              publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
              <NotificationProvider>
                <RevenueCatProvider>
                <Stack>
                  <Stack.Screen
                    name="(shop)"
                    options={{ headerShown: false, title: "Shop" }}
                  />
                  <Stack.Screen
                    name="categories"
                    options={{ headerShown: false, title: "Categories" }}
                  />
                  <Stack.Screen
                    name="product"
                    options={{ headerShown: false, title: "Product" }}
                  />
                  <Stack.Screen
                    name="shop"
                    options={{ headerShown: false, title: "Shop Details" }}
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
                    }}
                  />
                  <Stack.Screen
                    name="services"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="gem-shop"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="auth"
                    options={{ headerShown: false, title: "Auth" }}
                  />
                  <Stack.Screen
                    name="order-details"
                    options={{ headerShown: false, title: "Order Details" }}
                  />
                  <Stack.Screen
                    name="my-orders"
                    options={{ headerShown: false, title: "My Orders" }}
                  />
                  <Stack.Screen
                    name="profile"
                    options={{ headerShown: false, title: "Profile" }}
                  />
                  <Stack.Screen
                    name="edit-profile"
                    options={{ headerShown: false, title: "Edit Profile" }}
                  />
                  <Stack.Screen
                    name="challenges"
                    options={{ headerShown: false, title: "Challenges" }}
                  />
                  <Stack.Screen
                    name="paywall"
                    options={{ 
                      presentation: "modal",
                      headerShown: false, 
                      title: "Upgrade to Pro" 
                    }}
                  />
                </Stack>
                </RevenueCatProvider>
              </NotificationProvider>
            </StripeProvider>
          </QueryProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
