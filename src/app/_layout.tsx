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
  sendDefaultPii: true,
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
                    name="order-details"
                    options={{ headerShown: false, title: "Order Details", animation: 'ios_from_right', }}
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
                    name="profile"
                    options={{ headerShown: false, title: "Profile", animation: 'ios_from_right', }}
                  />
                  <Stack.Screen
                    name="edit-profile"
                    options={{ headerShown: false, title: "Edit Profile", animation: 'ios_from_right', }}
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
