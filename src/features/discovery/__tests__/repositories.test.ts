import { withIllustrativeFallback } from '../repositories';

describe('live-first repository result', () => {
  const fallback = [{ id: -1 }];

  it('keeps non-empty live records authoritative', async () => {
    await expect(withIllustrativeFallback(async () => [{ id: 7 }], fallback)).resolves.toEqual({
      provenance: 'live', records: [{ id: 7 }], reason: null,
    });
  });

  it('labels illustrative fallback when live data is empty', async () => {
    await expect(withIllustrativeFallback(async () => [], fallback)).resolves.toEqual({
      provenance: 'illustrative-fallback', records: fallback, reason: 'empty',
    });
  });

  it('labels illustrative fallback when live data fails', async () => {
    await expect(withIllustrativeFallback(async () => { throw new Error('offline'); }, fallback)).resolves.toEqual({
      provenance: 'illustrative-fallback', records: fallback, reason: 'unavailable',
    });
  });
});
