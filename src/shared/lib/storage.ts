import { createUploadTask, FileSystemUploadType } from 'expo-file-system/legacy';

import { supabase } from './supabase';

export type UploadProgress = { totalBytes: number; sentBytes: number; fraction: number };

export type UploadRequest = {
  bucket: string;
  /** Full object path inside the bucket, e.g. `12/{profileId}/{uuid}.mp4`. */
  path: string;
  /** Local file URI from the picker. */
  uri: string;
  mimeType: string;
  onProgress?: (progress: UploadProgress) => void;
};

export class UploadError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

/**
 * Uploads a local file to Supabase Storage without ever pulling its bytes into JS.
 *
 * We mint a signed upload URL first -- that call is RLS-checked server side using the
 * Clerk token the client already attaches, so a creator cannot get a URL for someone
 * else's folder -- then stream the file straight to it from disk.
 *
 * Deliberately not `fetch(uri)` + blob (React Native drops large bodies and a 100MB
 * video will OOM the JS heap) and not `uploadToSignedUrl` (it needs the bytes in JS
 * for the same reason).
 */
export async function uploadToBucket({
  bucket,
  path,
  uri,
  mimeType,
  onProgress,
}: UploadRequest): Promise<{ path: string }> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);

  if (error || !data?.signedUrl) {
    throw new UploadError(error?.message ?? 'Could not start the upload', error);
  }

  const task = createUploadTask(
    data.signedUrl,
    uri,
    {
      httpMethod: 'PUT',
      uploadType: FileSystemUploadType.BINARY_CONTENT,
      headers: { 'content-type': mimeType },
    },
    progress => {
      if (!onProgress) return;
      const totalBytes = progress.totalBytesExpectedToSend;
      const sentBytes = progress.totalBytesSent;
      onProgress({
        totalBytes,
        sentBytes,
        fraction: totalBytes > 0 ? sentBytes / totalBytes : 0,
      });
    },
  );

  const result = await task.uploadAsync();

  if (!result) {
    throw new UploadError('Upload was cancelled');
  }
  if (result.status < 200 || result.status >= 300) {
    throw new UploadError(uploadFailureMessage(result.status, result.body));
  }

  return { path: data.path ?? path };
}

function uploadFailureMessage(status: number, body: string | undefined): string {
  // The storage API enforces the bucket's size and mime allowlist independently of our
  // client-side checks, so these two are reachable even after validateAsset passes.
  if (status === 413) return 'That file is too large for this campaign.';
  if (status === 415) return 'That file type is not accepted for this campaign.';
  if (status === 403) return 'You are not allowed to upload to this campaign.';
  return `Upload failed (${status})${body ? `: ${body}` : ''}`;
}

/** Creates a time-limited URL for reading a private object. */
export async function createSignedReadUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) {
    throw new UploadError(error?.message ?? 'Could not read that file', error);
  }
  return data.signedUrl;
}

/** Public buckets serve straight off the CDN -- no signing round trip needed. */
export function publicUrl(bucket: string, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function removeFromBucket(bucket: string, paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw new UploadError(error.message, error);
}
