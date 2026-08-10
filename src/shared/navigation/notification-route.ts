export type MuseNotificationPayload = {
  version: 1;
  destination: 'campaign' | 'entry_review' | 'entry_result';
  recordId: string;
};

/**
 * Maps a push payload to a route. Order and collection destinations went with the
 * commerce teardown; anything unrecognised returns null so a stale notification
 * opens the app instead of a dead route.
 */
export function notificationHref(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Partial<MuseNotificationPayload>;
  if (p.version !== 1 || typeof p.recordId !== 'string' || !p.recordId) return null;
  const id = encodeURIComponent(p.recordId);
  if (p.destination === 'campaign') return `/opportunity/${id}`;
  if (p.destination === 'entry_review') return `/(merchant)/campaigns/${id}/submissions`;
  if (p.destination === 'entry_result') return '/(shop)/entries';
  return null;
}
