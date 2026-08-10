import { useAuth, useUser } from '../shared/clerk';
import { Redirect, Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Plate, Text, layout, space, useDesignTokens, useThemedStyles, type SemanticColors } from '../shared/design-system';

function createStyles(c: SemanticColors) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    content: { flex: 1, gap: space.lg, padding: layout.screenGutter },
    card: { gap: space.xs, padding: layout.screenGutter },
    actions: { gap: space.xs, marginTop: 'auto' as const },
  };
}

export default function AccountScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <View style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}><ActivityIndicator color={colors.ink} /></View>;
  if (!isSignedIn) return <Redirect href={{ pathname: '/auth', params: { returnTo: '/account' } }} />;

  const signOutNow = () => Alert.alert('Sign out?', 'You can sign back in with your email and password.', [
    { text: 'Stay signed in', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: () => void signOut().then(() => router.replace('/')) },
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Account and security' }} />
      <View style={styles.content}>
        <Plate style={styles.card}>
          <Text variant="label">Signed in as</Text>
          <Text variant="h2">{user?.fullName || 'Muse member'}</Text>
          <Text variant="body" color={colors.inkMuted}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </Plate>
        <Text variant="body" color={colors.inkMuted}>
          Your Clerk session secures checkout, orders and merchant actions. If it expires, Muse asks you to sign in again and returns you to the flow you were using.
        </Text>
        <View style={styles.actions}>
          <Button variant="secondary" onPress={() => router.push('/orders')}>View my orders</Button>
          <Button variant="secondary" onPress={signOutNow}>Sign out</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
