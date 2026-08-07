import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { useShopStore } from '../../../store/shop-store';
import { clearOpenShopIntent } from '../open-shop-intent';

export default function OpenShopScreen() {
  const router = useRouter();
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
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
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
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={NEO_THEME.colors.black} />
        </Pressable>

        <View style={styles.card}>
          <Ionicons name="storefront" size={56} color={NEO_THEME.colors.black} style={styles.heroIcon} />
          <NuviaText variant="h1" align="center">Open your shop</NuviaText>
          <NuviaText variant="body" align="center" style={styles.description}>
            Set up a storefront for products and competitive content pots. Discover only shows live pots after you add a product and fund a challenge.
          </NuviaText>

          <View style={styles.formGroup}>
            <NuviaText variant="caption" style={styles.label}>SHOP NAME</NuviaText>
            <TextInput
              style={styles.input}
              value={shopName}
              onChangeText={setShopName}
              placeholder="e.g. Mama T's Soul Food"
              placeholderTextColor={NEO_THEME.colors.grey}
            />
          </View>

          <View style={styles.formGroup}>
            <NuviaText variant="caption" style={styles.label}>DISPLAY LOCATION</NuviaText>
            <TextInput
              style={styles.input}
              value={shopLocation}
              onChangeText={setShopLocation}
              placeholder="Molapo Crossing, Unit B12"
              placeholderTextColor={NEO_THEME.colors.grey}
            />
          </View>

          <View style={styles.formGroup}>
            <NuviaText variant="caption" style={styles.label}>MALL (REQUIRED FOR DISCOVER)</NuviaText>
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
                    <NuviaText variant="bodyBold">{mall.name}</NuviaText>
                    {selected ? <Ionicons name="checkmark-circle" size={20} color={NEO_THEME.colors.black} /> : null}
                  </Pressable>
                );
              })}
              {malls.length === 0 ? (
                <NuviaText variant="caption">Loading malls…</NuviaText>
              ) : null}
            </View>
          </View>

          <View style={styles.formGroup}>
            <NuviaText variant="caption" style={styles.label}>SHORT DESCRIPTION</NuviaText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={shopDescription}
              onChangeText={setShopDescription}
              placeholder="What do you sell, and what kind of challenges will you fund?"
              placeholderTextColor={NEO_THEME.colors.grey}
              multiline
            />
          </View>

          <View style={styles.switchRow}>
            <NuviaText variant="bodyBold">Delivery</NuviaText>
            <Switch
              value={enableDelivery}
              onValueChange={setEnableDelivery}
              trackColor={{ false: NEO_THEME.colors.greyLight, true: NEO_THEME.colors.primary }}
            />
          </View>
          <View style={styles.switchRow}>
            <NuviaText variant="bodyBold">Collection</NuviaText>
            <Switch
              value={enableCollection}
              onValueChange={setEnableCollection}
              trackColor={{ false: NEO_THEME.colors.greyLight, true: NEO_THEME.colors.primary }}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleCreate}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            <NuviaText variant="bodyBold">{loading ? 'CREATING…' : 'CREATE SHOP'}</NuviaText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.background },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  backButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 14,
    backgroundColor: NEO_THEME.colors.white,
  },
  card: {
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    boxShadow: '6px 6px 0px #000000',
  },
  heroIcon: { alignSelf: 'center', marginBottom: 4 },
  description: { color: NEO_THEME.colors.grey, marginBottom: 4 },
  formGroup: { gap: 6 },
  label: { fontFamily: NEO_THEME.fonts.bold, color: NEO_THEME.colors.black },
  input: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
  },
  textArea: { minHeight: 96, textAlignVertical: 'top' },
  mallList: { gap: 8 },
  mallOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: NEO_THEME.colors.white,
  },
  mallOptionSelected: { backgroundColor: NEO_THEME.colors.secondary },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 999,
    backgroundColor: NEO_THEME.colors.primary,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
});
