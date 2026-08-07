import { Stack } from 'expo-router';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { useAuth } from '../../shared/providers/auth-provider';

export default function ChallengesLayout() {
  const { activeRole, isAdmin } = useAuth();
  const isMerchant = activeRole === 'merchant';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isMerchant}>
        <Stack.Screen
          name="create"
          options={{
            title: 'Create Opportunity',
            headerShown: false
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isAdmin || isMerchant}>
        <Stack.Screen name="review" options={{ title: 'Challenge Review', headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Challenge Details',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="entry/[id]" 
        options={{ 
          title: 'Submit Entry',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
