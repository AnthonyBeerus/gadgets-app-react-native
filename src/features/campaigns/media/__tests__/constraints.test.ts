import {
  extensionFor,
  formatBytes,
  MAX_SUBMISSION_BYTES,
  validateAsset,
  validateCampaignAsset,
  type AssetRules,
  type PickedAsset,
} from '../constraints';

const videoRules: AssetRules = { contentFormat: 'video', videoMinSeconds: 10, videoMaxSeconds: 60 };

const video = (overrides: Partial<PickedAsset> = {}): PickedAsset => ({
  uri: 'file:///tmp/clip.mp4',
  mimeType: 'video/mp4',
  fileSize: 5_000_000,
  durationSeconds: 30,
  ...overrides,
});

describe('validateAsset', () => {
  it('accepts a video that satisfies the brief', () => {
    expect(validateAsset(video(), videoRules)).toEqual({ ok: true });
  });

  it('rejects a mime type the bucket would reject anyway', () => {
    const result = validateAsset(video({ mimeType: 'video/x-matroska' }), videoRules);
    expect(result).toMatchObject({ ok: false });
    expect((result as { reason: string }).reason).toContain('not accepted');
  });

  it('rejects a photo when the campaign asks for video', () => {
    const result = validateAsset(video({ mimeType: 'image/jpeg', durationSeconds: undefined }), videoRules);
    expect(result).toEqual({ ok: false, reason: 'This campaign asks for video.' });
  });

  it('rejects a video when the campaign asks for photos', () => {
    const result = validateAsset(video(), { contentFormat: 'photo' });
    expect(result).toEqual({ ok: false, reason: 'This campaign asks for photos.' });
  });

  it('accepts either format when the campaign allows both', () => {
    expect(validateAsset(video(), { contentFormat: 'either' })).toEqual({ ok: true });
    expect(
      validateAsset(video({ mimeType: 'image/png', durationSeconds: undefined }), {
        contentFormat: 'either',
      }),
    ).toEqual({ ok: true });
  });

  it('rejects a file over the bucket limit and says how big it is', () => {
    const result = validateAsset(video({ fileSize: MAX_SUBMISSION_BYTES + 1 }), videoRules);
    expect(result).toMatchObject({ ok: false });
    expect((result as { reason: string }).reason).toContain('200MB');
  });

  it('enforces the campaign duration window', () => {
    expect(validateAsset(video({ durationSeconds: 4 }), videoRules)).toMatchObject({ ok: false });
    expect(validateAsset(video({ durationSeconds: 90 }), videoRules)).toMatchObject({ ok: false });
    expect(validateAsset(video({ durationSeconds: 10 }), videoRules)).toEqual({ ok: true });
    expect(validateAsset(video({ durationSeconds: 60 }), videoRules)).toEqual({ ok: true });
  });

  it('skips duration checks when the campaign sets no window', () => {
    expect(validateAsset(video({ durationSeconds: 600 }), { contentFormat: 'video' })).toEqual({
      ok: true,
    });
  });

  it('does not guess when the picker gives no size or duration', () => {
    expect(
      validateAsset({ uri: 'file:///a.mp4', mimeType: 'video/mp4' }, videoRules),
    ).toEqual({ ok: true });
  });
});

describe('validateCampaignAsset', () => {
  it('accepts brand material a submission bucket would not take', () => {
    expect(
      validateCampaignAsset({ uri: 'file:///brand.pdf', mimeType: 'application/pdf', fileSize: 1000 }),
    ).toEqual({ ok: true });
  });

  it('rejects brand assets over 50MB', () => {
    const result = validateCampaignAsset({
      uri: 'file:///big.png',
      mimeType: 'image/png',
      fileSize: 60_000_000,
    });
    expect(result).toMatchObject({ ok: false });
    expect((result as { reason: string }).reason).toContain('50MB');
  });
});

describe('extensionFor', () => {
  it('prefers the real filename extension', () => {
    expect(extensionFor('video/mp4', 'holiday.MOV')).toBe('mov');
  });

  it('falls back to the mime type', () => {
    expect(extensionFor('video/quicktime')).toBe('mov');
    expect(extensionFor('image/jpeg')).toBe('jpg');
  });

  it('ignores a filename with no usable extension', () => {
    expect(extensionFor('image/png', 'screenshot')).toBe('png');
  });
});

describe('formatBytes', () => {
  it('scales units', () => {
    expect(formatBytes(512)).toBe('512B');
    expect(formatBytes(2048)).toBe('2KB');
    expect(formatBytes(1_500_000)).toBe('1.4MB');
    expect(formatBytes(209_715_200)).toBe('200MB');
  });
});
