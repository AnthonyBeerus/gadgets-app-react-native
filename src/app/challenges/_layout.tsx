import { Stack } from 'expo-router';
import { NEO_THEME } from '../../shared/constants/neobrutalism';

export default function ChallengesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
