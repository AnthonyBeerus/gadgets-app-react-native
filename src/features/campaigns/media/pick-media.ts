import * as ImagePicker from 'expo-image-picker';

import type { ContentFormat, PickedAsset } from './constraints';

export type PickOutcome =
  | { status: 'picked'; assets: PickedAsset[] }
  | { status: 'cancelled' }
  | { status: 'denied'; reason: string };

function mediaTypesFor(format: ContentFormat): ImagePicker.MediaType[] {
  if (format === 'video') return ['videos'];
  if (format === 'photo') return ['images'];
  return ['images', 'videos'];
}

function toPickedAsset(asset: ImagePicker.ImagePickerAsset): PickedAsset {
  return {
    uri: asset.uri,
    // The picker returns null when it cannot sniff the type; fall back to the
    // extension so validateAsset can still give a useful message.
    mimeType: asset.mimeType ?? guessMime(asset.uri),
    fileSize: asset.fileSize,
    // expo-image-picker reports video length in milliseconds.
    durationSeconds: asset.duration != null ? asset.duration / 1000 : undefined,
    width: asset.width,
    height: asset.height,
    fileName: asset.fileName ?? undefined,
  };
}

function guessMime(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };
  return (ext && map[ext]) || 'application/octet-stream';
}

export async function pickFromLibrary(options: {
  format: ContentFormat;
  selectionLimit?: number;
  videoMaxSeconds?: number | null;
}): Promise<PickOutcome> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return {
      status: 'denied',
      reason: 'Muse needs access to your photos to attach content. You can grant it in Settings.',
    };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: mediaTypesFor(options.format),
    selectionLimit: options.selectionLimit ?? 1,
    allowsMultipleSelection: (options.selectionLimit ?? 1) > 1,
    quality: 1,
    // Leave the original file intact; re-encoding a creator's video loses quality
    // and the merchant is paying for the raw asset.
    videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
  });

  if (result.canceled) return { status: 'cancelled' };
  return { status: 'picked', assets: result.assets.map(toPickedAsset) };
}

export async function captureWithCamera(options: {
  format: ContentFormat;
  videoMaxSeconds?: number | null;
}): Promise<PickOutcome> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    return {
      status: 'denied',
      reason: 'Muse needs camera access to record content. You can grant it in Settings.',
    };
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: mediaTypesFor(options.format),
    quality: 1,
    videoMaxDuration: options.videoMaxSeconds ?? undefined,
  });

  if (result.canceled) return { status: 'cancelled' };
  return { status: 'picked', assets: result.assets.map(toPickedAsset) };
}
