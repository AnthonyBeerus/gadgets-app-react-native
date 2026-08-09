import { shouldUsePrototypeFeedImmediately } from '../feed-mode';

describe('Discovery feed mode', () => {
  it.each(['development', 'preview'])('uses fixtures immediately for %s builds', variant => {
    expect(shouldUsePrototypeFeedImmediately(variant)).toBe(true);
  });

  it('does not replace the production feed before attempting live data', () => {
    expect(shouldUsePrototypeFeedImmediately('production')).toBe(false);
  });
});
