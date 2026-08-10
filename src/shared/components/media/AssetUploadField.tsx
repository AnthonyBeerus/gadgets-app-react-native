import { View } from 'react-native';

import type { UploadedAsset } from '../../../features/campaigns/media/useAssetUpload';
import {
  Button,
  DashedWell,
  IconButton,
  Progress,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../design-system';
import { AssetPlayer } from './AssetPlayer';

type AssetUploadFieldProps = {
  title: string;
  hint?: string;
  assets: UploadedAsset[];
  progress: number;
  isUploading: boolean;
  error: string | null;
  maxAssets: number;
  onPick: () => void;
  onCapture?: () => void;
  onRemove: (path: string) => void;
};

/**
 * The upload surface shared by the merchant brand-asset step and the creator
 * submission screen. Replaces the old presentational UploadBox, which advertised
 * "Supports JPG, PNG, MP4" but had no picker wired to it at all.
 */
export function AssetUploadField({
  title,
  hint,
  assets,
  progress,
  isUploading,
  error,
  maxAssets,
  onPick,
  onCapture,
  onRemove,
}: AssetUploadFieldProps) {
  const styles = useThemedStyles(createStyles);
  const atCapacity = assets.length >= maxAssets;

  return (
    <View style={styles.container}>
      {assets.length > 0 && (
        <View style={styles.grid}>
          {assets.map(asset => (
            <View key={asset.path} style={styles.tile}>
              <AssetPlayer uri={asset.localUri} mimeType={asset.mimeType} />
              <IconButton
                accessibilityLabel="Remove this file"
                onPress={() => onRemove(asset.path)}
                style={styles.remove}
              >
                ✕
              </IconButton>
            </View>
          ))}
        </View>
      )}

      {isUploading ? (
        <View style={styles.uploading}>
          <Text variant="label">Uploading… {Math.round(progress * 100)}%</Text>
          <Progress value={progress} />
        </View>
      ) : (
        !atCapacity && (
          <DashedWell title={title}>
            {hint ? (
              <Text variant="caption" align="center" style={styles.hint}>
                {hint}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <Button variant="secondary" onPress={onPick} style={styles.action}>
                Choose file
              </Button>
              {onCapture ? (
                <Button variant="outline" onPress={onCapture} style={styles.action}>
                  Record
                </Button>
              ) : null}
            </View>
          </DashedWell>
        )
      )}

      {error ? (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Text variant="caption" style={styles.count}>
        {assets.length} of {maxAssets} added
      </Text>
    </View>
  );
}

function createStyles(c: SemanticColors) {
  return {
    container: { gap: space.sm },
    grid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.sm },
    tile: { width: '31%' as const, position: 'relative' as const },
    remove: { position: 'absolute' as const, top: space.xs, right: space.xs },
    uploading: { gap: space.xs, paddingVertical: space.md },
    hint: { marginTop: space.xs, color: c.inkMuted },
    actions: { flexDirection: 'row' as const, gap: space.sm, marginTop: space.sm },
    action: { flex: 1 },
    error: { color: c.danger },
    count: { color: c.inkMuted },
  };
}
