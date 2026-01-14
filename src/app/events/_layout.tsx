import { Stack } from "expo-router";
import { useAuth } from "../../shared/providers/auth-provider";

export default function EventsLayout() {
  const { activeRole } = useAuth();
  const isMerchant = activeRole === 'merchant';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={isMerchant}>
        <Stack.Screen name="create" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
