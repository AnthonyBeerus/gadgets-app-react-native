import { useAuth, useUser } from '../shared/clerk';
import { Redirect, Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../components/atoms/nuvia-text';
import { NuviaButton } from '../shared/components/ui/nuvia-button';
import { useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../shared/design-system';

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    content: { flex: 1, gap: 18, padding: 20 },
    card: { gap: 8, borderWidth: 1, borderColor: c.border, borderRadius: 20, backgroundColor: c.surface, padding: 18, ...tokens.elevation.hairline },
    actions: { gap: 10, marginTop: 'auto' as const },
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
        <View style={styles.card}>
          <NuviaText variant="caption">SIGNED IN AS</NuviaText>
          <NuviaText variant="h2">{user?.fullName || 'Muse member'}</NuviaText>
          <NuviaText variant="body" color={colors.inkMuted}>{user?.primaryEmailAddress?.emailAddress}</NuviaText>
        </View>
        <NuviaText variant="body" color={colors.inkMuted}>
          Your Clerk session secures checkout, orders and merchant actions. If it expires, Muse asks you to sign in again and returns you to the flow you were using.
        </NuviaText>
        <View style={styles.actions}>
          <NuviaButton variant="secondary" onPress={() => router.push('/orders')}>VIEW MY ORDERS</NuviaButton>
          <NuviaButton variant="secondary" onPress={signOutNow}>SIGN OUT</NuviaButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
