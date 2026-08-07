import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Text,
  Button,
  Surface,
  space,
  radii,
  fonts,
  elevation,
  useDesignTokens,
  useThemedStyles,
  type SemanticColors,
  type DesignTokens,
} from '../../../shared/design-system';
import { useAuth } from '../../../shared/providers/auth-provider';
import { useShopStore } from '../../../store/shop-store';
import { clearOpenShopIntent } from '../open-shop-intent';

export default function OpenShopScreen() {
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const { session, mounting, isMerchant, createMerchantShop, switchRole } = useAuth();
  const { malls, loadInitialData } = useShopStore();
  const [loading, setLoading] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopMallId, setShopMallId] = useState<number | null>(null);
  const [enableDelivery, setEnableDelivery] = useState(false);
  const [enableCollection, setEnableCollection] = useState(true);

  useEffect(() => {
    if (malls.length === 0) loadInitialData();
  }, [malls.length, loadInitialData]);

  useEffect(() => {
    if (shopMallId == null && malls.length > 0) {
      setShopMallId(malls[0].id);
    }
  }, [malls, shopMallId]);

  useEffect(() => {
    if (isMerchant) switchRole('merchant');
  }, [isMerchant, switchRole]);

  if (mounting) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.ink} />
      </SafeAreaView>
    );
  }

  if (!session) return <Redirect href="/auth" />;
  if (isMerchant) return <Redirect href="/(merchant)" />;

  const handleCreate = async () => {
    if (!shopName.trim() || !shopLocation.trim()) {
      Alert.alert('Shop details needed', 'Enter a shop name and display location to continue.');
      return;
    }
    if (shopMallId == null) {
      Alert.alert('Mall needed', 'Pick a mall so your challenges can show in Discover.');
      return;
    }

    try {
      setLoading(true);
      await createMerchantShop({
        shopName: shopName.trim(),
        shopLocation: shopLocation.trim(),
        shopDescription: shopDescription.trim() || undefined,
        shopMallId,
        enableDelivery,
        enableCollection,
      });
      await clearOpenShopIntent();
      switchRole('merchant');
      router.replace('/(merchant)');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create your shop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>

        <Surface style={styles.card} elevation="hairline">
          <Ionicons name="storefront-outline" size={48} color={colors.ink} style={styles.heroIcon} />
          <Text variant="h1" align="center">
            Open your shop
          </Text>
          <Text variant="body" align="center" color={colors.inkMuted} style={styles.description}>
            Set up a storefront for products and competitive content pots. Discover only shows live
            pots after you add a product and fund a challenge.
          </Text>

          <View style={styles.formGroup}>
            <Text variant="label">Shop name</Text>
            <TextInput
              style={styles.input}
              value={shopName}
              onChangeText={setShopName}
              placeholder="e.g. Mama T's Soul Food"
              placeholderTextColor={colors.inkMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text variant="label">Display location</Text>
            <TextInput
              style={styles.input}
              value={shopLocation}
              onChangeText={setShopLocation}
              placeholder="Molapo Crossing, Unit B12"
              placeholderTextColor={colors.inkMuted}
            />
          </View>

          <View style={styles.formGroup}>
            <Text variant="label">Mall (required for Discover)</Text>
            <View style={styles.mallList}>
              {malls.map(mall => {
                const selected = shopMallId === mall.id;
                return (
                  <Pressable
                    key={mall.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setShopMallId(mall.id)}
                    style={[styles.mallOption, selected && styles.mallOptionSelected]}
                  >
                    <Text variant="bodyBold">{mall.name}</Text>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={20} color={colors.ink} />
                    ) : null}
                  </Pressable>
                );
              })}
              {malls.length === 0 ? (
                <Text variant="caption">Loading malls…</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text variant="label">Short description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={shopDescription}
              onChangeText={setShopDescription}
              placeholder="What do you sell, and what kind of challenges will you fund?"
              placeholderTextColor={colors.inkMuted}
              multiline
            />
          </View>

          <View style={styles.switchRow}>
            <Text variant="bodyBold">Delivery</Text>
            <Switch
              value={enableDelivery}
              onValueChange={setEnableDelivery}
              trackColor={{ false: colors.gray200, true: colors.ink }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text variant="bodyBold">Collection</Text>
            <Switch
              value={enableCollection}
              onValueChange={setEnableCollection}
              trackColor={{ false: colors.gray200, true: colors.ink }}
            />
          </View>

          <Button onPress={handleCreate} disabled={loading} style={styles.button}>
            {loading ? 'Creating…' : 'Create shop'}
          </Button>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    container: { flex: 1, backgroundColor: c.canvas },
    content: { padding: space.md, paddingBottom: space.xxl, gap: space.sm },
    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: radii.md,
      backgroundColor: c.surface,
      ...tokens.elevation.hairline,
    },
    card: {
      padding: space.lg,
      gap: space.md,
    },
    heroIcon: { alignSelf: 'center' as const, marginBottom: space.xxs },
    description: { marginBottom: space.xxs },
    formGroup: { gap: space.xs },
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.md,
      paddingHorizontal: space.sm,
      paddingVertical: space.sm,
      fontFamily: fonts.regular,
      fontSize: 16,
      color: c.ink,
      backgroundColor: c.surface,
    },
    textArea: { minHeight: 96, textAlignVertical: 'top' as const },
    mallList: { gap: space.xs },
    mallOption: {
      minHeight: 48,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.md,
      paddingHorizontal: space.sm,
      backgroundColor: c.surface,
    },
    mallOptionSelected: {
      backgroundColor: c.accentMuted,
      borderColor: c.accent,
    },
    switchRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
    },
    button: { marginTop: space.xs },
  };
}
