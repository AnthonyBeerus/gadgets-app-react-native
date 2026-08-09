import { UserProfileView } from '@clerk/expo/native';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AccountScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8F6F8' }}>
      <Stack.Screen options={{ title: 'Account and security' }} />
      <UserProfileView />
    </View>
  );
}
