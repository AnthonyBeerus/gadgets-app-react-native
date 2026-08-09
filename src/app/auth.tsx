import { useAuth } from '@clerk/expo';
import { AuthView } from '@clerk/expo/native';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AuthScreen() {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F6F8' }}>
        <ActivityIndicator color="#171217" />
      </View>
    );
  }
  if (isSignedIn) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F6F8' }}>
      <Stack.Screen options={{ title: 'Join Muse' }} />
      <AuthView mode="signInOrUp" isDismissable={false} />
    </View>
  );
}
