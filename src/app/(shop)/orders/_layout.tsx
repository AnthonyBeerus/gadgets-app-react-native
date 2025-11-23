import { Stack } from 'expo-router';

import { useOrderUpdateSubscription } from '../../../shared/api/subscriptions';

export default function OrdersLayout() {
  useOrderUpdateSubscription();

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
