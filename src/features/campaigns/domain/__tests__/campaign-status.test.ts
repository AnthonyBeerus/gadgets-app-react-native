import {
  canRequestRevision,
  canTransition,
  canTransitionSubmission,
  isAcceptingEntries,
  isCampaignStatus,
  isSubmissionStatus,
  nextMerchantActions,
} from '../campaign-status';

const NOW = new Date('2026-08-10T12:00:00Z');
const FUTURE = '2026-08-20T12:00:00Z';
const PAST = '2026-08-01T12:00:00Z';

describe('campaign transitions', () => {
  it('walks draft -> published -> closed -> settled', () => {
    expect(canTransition('draft', 'published')).toBe(true);
    expect(canTransition('published', 'closed')).toBe(true);
    expect(canTransition('closed', 'settled')).toBe(true);
  });

  it('refuses to skip or reverse steps', () => {
    expect(canTransition('draft', 'closed')).toBe(false);
    expect(canTransition('draft', 'settled')).toBe(false);
    expect(canTransition('published', 'draft')).toBe(false);
    expect(canTransition('settled', 'closed')).toBe(false);
  });

  it('treats settled as terminal', () => {
    expect(canTransition('settled', 'published')).toBe(false);
  });
});

describe('submission transitions', () => {
  it('allows a revision round trip', () => {
    expect(canTransitionSubmission('submitted', 'revision_requested')).toBe(true);
    expect(canTransitionSubmission('revision_requested', 'submitted')).toBe(true);
  });

  it('treats approved and rejected as terminal', () => {
    expect(canTransitionSubmission('approved', 'rejected')).toBe(false);
    expect(canTransitionSubmission('rejected', 'approved')).toBe(false);
  });

  it('does not let a draft jump straight to approved', () => {
    expect(canTransitionSubmission('draft', 'approved')).toBe(false);
  });
});

describe('canRequestRevision', () => {
  it('allows revisions until the allowance is spent', () => {
    expect(canRequestRevision(0, 1)).toBe(true);
    expect(canRequestRevision(1, 1)).toBe(false);
    expect(canRequestRevision(2, 3)).toBe(true);
  });

  it('blocks every revision when the campaign allows none', () => {
    expect(canRequestRevision(0, 0)).toBe(false);
  });
});

describe('nextMerchantActions', () => {
  it('offers edit and publish on a draft', () => {
    expect(nextMerchantActions({ status: 'draft', deadline: FUTURE }, NOW)).toEqual([
      'edit',
      'publish',
    ]);
  });

  it('leads with review while the campaign is still running', () => {
    expect(nextMerchantActions({ status: 'published', deadline: FUTURE }, NOW)).toEqual([
      'review_submissions',
      'close',
    ]);
  });

  it('leads with close once the deadline has passed', () => {
    expect(nextMerchantActions({ status: 'published', deadline: PAST }, NOW)).toEqual([
      'close',
      'review_submissions',
    ]);
  });

  it('only offers winner selection once something is approved', () => {
    expect(nextMerchantActions({ status: 'closed', deadline: PAST, approvedCount: 0 }, NOW)).toEqual(
      ['review_submissions'],
    );
    expect(nextMerchantActions({ status: 'closed', deadline: PAST, approvedCount: 3 }, NOW)).toEqual(
      ['review_submissions', 'select_winners'],
    );
  });

  it('only offers settle once ranks are assigned', () => {
    expect(
      nextMerchantActions(
        { status: 'closed', deadline: PAST, approvedCount: 3, rankedCount: 3 },
        NOW,
      ),
    ).toEqual(['review_submissions', 'select_winners', 'settle']);
  });

  it('rejects an unparseable deadline rather than guessing', () => {
    expect(() => nextMerchantActions({ status: 'draft', deadline: 'soon' }, NOW)).toThrow(
      'valid date',
    );
  });
});

describe('isAcceptingEntries', () => {
  it('accepts entries only while published and before the deadline', () => {
    expect(isAcceptingEntries({ status: 'published', deadline: FUTURE }, NOW)).toBe(true);
    expect(isAcceptingEntries({ status: 'published', deadline: PAST }, NOW)).toBe(false);
    expect(isAcceptingEntries({ status: 'draft', deadline: FUTURE }, NOW)).toBe(false);
    expect(isAcceptingEntries({ status: 'closed', deadline: FUTURE }, NOW)).toBe(false);
  });
});

describe('status guards', () => {
  it('narrows known values and rejects unknown ones', () => {
    expect(isCampaignStatus('published')).toBe(true);
    expect(isCampaignStatus('active')).toBe(false);
    expect(isSubmissionStatus('revision_requested')).toBe(true);
    expect(isSubmissionStatus('pending')).toBe(false);
  });
});
