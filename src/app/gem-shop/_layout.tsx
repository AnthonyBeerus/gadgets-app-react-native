import { Stack } from 'expo-router';

export default function GemShopLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right'  }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
