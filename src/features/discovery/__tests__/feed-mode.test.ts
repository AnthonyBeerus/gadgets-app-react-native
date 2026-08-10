import { shouldUsePrototypeFeedImmediately } from '../feed-mode';

describe('Discovery feed mode', () => {
  it.each(['development', 'preview', 'production'])('attempts live data before fallback for %s builds', variant => {
    expect(shouldUsePrototypeFeedImmediately(variant)).toBe(false);
  });

  it('does not replace the production feed before attempting live data', () => {
    expect(shouldUsePrototypeFeedImmediately('production')).toBe(false);
  });
});
