export const SUBMISSION_BUCKET = 'challenge-submissions';
export const CAMPAIGN_ASSET_BUCKET = 'campaign-assets';

/** Mirrors storage.buckets.file_size_limit in 20260811110000_campaign_storage.sql. */
export const MAX_SUBMISSION_BYTES = 209_715_200; // 200MB
export const MAX_CAMPAIGN_ASSET_BYTES = 52_428_800; // 50MB

/** Mirrors storage.buckets.allowed_mime_types for challenge-submissions. */
export const ALLOWED_SUBMISSION_MIME = [
  'video/mp4',
  'video/quicktime',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_CAMPAIGN_ASSET_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'application/pdf',
] as const;

export type ContentFormat = 'video' | 'photo' | 'either';

export type PickedAsset = {
  uri: string;
  mimeType: string;
  fileSize?: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  fileName?: string;
};

export type AssetRules = {
  contentFormat: ContentFormat;
  videoMinSeconds?: number | null;
  videoMaxSeconds?: number | null;
};

export type ValidationResult = { ok: true } | { ok: false; reason: string };

export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Client-side gate so a creator gets a sentence instead of a 413 after uploading
 * 200MB over mobile data. The bucket enforces size and mime independently.
 */
export function validateAsset(asset: PickedAsset, rules: AssetRules): ValidationResult {
  if (!(ALLOWED_SUBMISSION_MIME as readonly string[]).includes(asset.mimeType)) {
    return { ok: false, reason: `${describeType(asset.mimeType)} files are not accepted. Upload an MP4, MOV, JPG, PNG or WebP.` };
  }

  if (rules.contentFormat === 'video' && !isVideo(asset.mimeType)) {
    return { ok: false, reason: 'This campaign asks for video.' };
  }
  if (rules.contentFormat === 'photo' && !isImage(asset.mimeType)) {
    return { ok: false, reason: 'This campaign asks for photos.' };
  }

  if (asset.fileSize != null && asset.fileSize > MAX_SUBMISSION_BYTES) {
    return {
      ok: false,
      reason: `That file is ${formatBytes(asset.fileSize)}. The limit is ${formatBytes(MAX_SUBMISSION_BYTES)}.`,
    };
  }

  if (isVideo(asset.mimeType) && asset.durationSeconds != null) {
    const min = rules.videoMinSeconds;
    const max = rules.videoMaxSeconds;
    if (min != null && asset.durationSeconds < min) {
      return { ok: false, reason: `This campaign needs at least ${min}s of video. Yours is ${Math.round(asset.durationSeconds)}s.` };
    }
    if (max != null && asset.durationSeconds > max) {
      return { ok: false, reason: `This campaign caps video at ${max}s. Yours is ${Math.round(asset.durationSeconds)}s.` };
    }
  }

  return { ok: true };
}

export function validateCampaignAsset(asset: PickedAsset): ValidationResult {
  if (!(ALLOWED_CAMPAIGN_ASSET_MIME as readonly string[]).includes(asset.mimeType)) {
    return { ok: false, reason: `${describeType(asset.mimeType)} files are not accepted as brand assets.` };
  }
  if (asset.fileSize != null && asset.fileSize > MAX_CAMPAIGN_ASSET_BYTES) {
    return {
      ok: false,
      reason: `That file is ${formatBytes(asset.fileSize)}. Brand assets are capped at ${formatBytes(MAX_CAMPAIGN_ASSET_BYTES)}.`,
    };
  }
  return { ok: true };
}

export function extensionFor(mimeType: string, fileName?: string): string {
  const fromName = fileName?.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const map: Record<string, string> = {
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
  };
  return map[mimeType] ?? 'bin';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  const mb = bytes / (1024 * 1024);
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)}MB`;
}

function describeType(mimeType: string): string {
  const subtype = mimeType.split('/')[1];
  return subtype ? subtype.toUpperCase() : mimeType;
}
