import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { NuviaText } from '../components/atoms/nuvia-text';
import { NuviaButton } from '../shared/components/ui/nuvia-button';
import { useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../shared/design-system';
import { supabase } from '../shared/lib/supabase';

function createStyles(c: SemanticColors, _tokens: DesignTokens) {
  return { container: { flex: 1, backgroundColor: c.canvas }, centered: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 14, padding: 24 }, camera: { flex: 1 }, overlay: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 20, backgroundColor: 'rgba(0,0,0,0.52)' }, box: { width: 250, height: 250, borderWidth: 3, borderColor: c.accent, borderRadius: 24 }, copy: { maxWidth: 300, color: '#FFFFFF' }, back: { position: 'absolute' as const, left: 20, top: 54, zIndex: 2, backgroundColor: c.surface } };
}

export default function MerchantScanScreen() {
  const styles = useThemedStyles(createStyles); const { colors } = useDesignTokens(); const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions(); const [busy, setBusy] = useState(false); const [last, setLast] = useState<string | null>(null);
  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) return <View style={styles.centered}><NuviaText variant="h2" align="center">CAMERA ACCESS NEEDED</NuviaText><NuviaText variant="body" align="center">Muse scans the buyer's single-use collection code.</NuviaText><NuviaButton onPress={requestPermission}>ALLOW CAMERA</NuviaButton></View>;
  const scan = async ({ data }: { data: string }) => {
    if (busy || data === last) return; setBusy(true); setLast(data);
    try {
      const parsed = JSON.parse(data) as { orderId?: number; token?: string };
      if (!parsed.orderId || !parsed.token) throw new Error('This is not a Muse collection code.');
      const { data: result, error } = await supabase.functions.invoke('verify-fulfillment', { body: parsed });
      if (error || result?.error || !result?.success) throw new Error(result?.error ?? error?.message ?? 'Verification failed');
      Alert.alert('Order collected', `Order #${parsed.orderId} is complete. The code cannot be reused.`, [{ text: 'Done', onPress: () => router.back() }]);
    } catch (caught) {
      Alert.alert('Could not complete collection', caught instanceof Error ? caught.message : 'Try again.', [{ text: 'Scan again', onPress: () => { setBusy(false); setLast(null); } }]);
    }
  };
  return <View style={styles.container}><NuviaButton variant="secondary" style={styles.back} onPress={() => router.back()}>CLOSE</NuviaButton><CameraView style={styles.camera} facing="back" onBarcodeScanned={busy ? undefined : scan} barcodeScannerSettings={{ barcodeTypes: ['qr'] }}><View style={styles.overlay}><View style={styles.box} />{busy ? <ActivityIndicator color={colors.accent} /> : <NuviaText variant="h3" align="center" style={styles.copy}>SCAN THE BUYER'S COLLECTION CODE</NuviaText>}</View></CameraView></View>;
}
