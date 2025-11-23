import { Stack } from "expo-router";

export default function ServicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="booking-modal" 
        options={{
          presentation: "modal",
          headerShown: false,
          headerTitle: "Book Service",
        }}
      />
    </Stack>
  );
}
