import { notificationHref } from '../notification-route';

describe('notificationHref', () => {
  it('opens a campaign brief', () =>
    expect(notificationHref({ version: 1, destination: 'campaign', recordId: '42' })).toBe(
      '/opportunity/42',
    ));

  it('opens the merchant review queue for a new entry', () =>
    expect(notificationHref({ version: 1, destination: 'entry_review', recordId: '42' })).toBe(
      '/(merchant)/campaigns/42/submissions',
    ));

  it('opens the creator entry tracker for a result', () =>
    expect(notificationHref({ version: 1, destination: 'entry_result', recordId: '7' })).toBe(
      '/(shop)/entries',
    ));

  it('escapes the record id', () =>
    expect(notificationHref({ version: 1, destination: 'campaign', recordId: 'a/b' })).toBe(
      '/opportunity/a%2Fb',
    ));

  it('rejects unversioned payloads', () =>
    expect(notificationHref({ destination: 'campaign', recordId: '42' })).toBeNull());

  it('rejects a missing record id', () =>
    expect(notificationHref({ version: 1, destination: 'campaign', recordId: '' })).toBeNull());

  // Retired destinations must not resolve, or a stale push opens a dead route.
  it.each(['order', 'collection', 'url'])('rejects the retired destination %s', destination =>
    expect(notificationHref({ version: 1, destination, recordId: '42' })).toBeNull(),
  );

  it('rejects a non-object payload', () => {
    expect(notificationHref(null)).toBeNull();
    expect(notificationHref('campaign')).toBeNull();
  });
});
