import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='[slug]'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
