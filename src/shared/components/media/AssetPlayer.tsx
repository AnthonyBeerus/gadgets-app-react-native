import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { View } from 'react-native';

import { Text, useThemedStyles, type SemanticColors } from '../../design-system';

type AssetPlayerProps = {
  uri: string | null;
  mimeType: string;
  /** Width/height ratio. Submissions are usually 9:16 vertical. */
  aspectRatio?: number;
  autoPlay?: boolean;
};

/**
 * Plays a submitted asset inline. Video and image share one component because the
 * review list mixes them and the merchant should not have to care which is which.
 */
export function AssetPlayer({
  uri,
  mimeType,
  aspectRatio = 9 / 16,
  autoPlay = false,
}: AssetPlayerProps) {
  const styles = useThemedStyles(createStyles);
  const isVideo = mimeType.startsWith('video/');

  // Hooks cannot be conditional, so the player is always created and simply gets a
  // null source for images.
  const player = useVideoPlayer(isVideo && uri ? uri : null, instance => {
    instance.loop = true;
    if (autoPlay) instance.play();
  });

  if (!uri) {
    return (
      <View style={[styles.frame, { aspectRatio }]}>
        <Text variant="label" align="center">
          Loading…
        </Text>
      </View>
    );
  }

  if (!isVideo) {
    return (
      <Image
        source={{ uri }}
        style={[styles.frame, { aspectRatio }]}
        contentFit="cover"
        transition={150}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <VideoView
      player={player}
      style={[styles.frame, { aspectRatio }]}
      contentFit="cover"
      fullscreenOptions={{ enable: true }}
      nativeControls
    />
  );
}

function createStyles(c: SemanticColors) {
  return {
    frame: {
      width: '100%' as const,
      borderWidth: 2,
      borderColor: c.stroke,
      backgroundColor: c.surfaceSunken,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      overflow: 'hidden' as const,
    },
  };
}
