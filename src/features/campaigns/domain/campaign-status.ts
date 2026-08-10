export const CAMPAIGN_STATUSES = ['draft', 'published', 'closed', 'settled'] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const SUBMISSION_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'revision_requested',
  'approved',
  'rejected',
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export type MerchantAction =
  | 'edit'
  | 'publish'
  | 'review_submissions'
  | 'close'
  | 'select_winners'
  | 'settle';

const CAMPAIGN_TRANSITIONS: Record<CampaignStatus, readonly CampaignStatus[]> = {
  draft: ['published'],
  published: ['closed'],
  closed: ['settled'],
  settled: [],
};

const SUBMISSION_TRANSITIONS: Record<SubmissionStatus, readonly SubmissionStatus[]> = {
  draft: ['submitted'],
  submitted: ['under_review', 'approved', 'rejected', 'revision_requested'],
  under_review: ['approved', 'rejected', 'revision_requested'],
  revision_requested: ['submitted'],
  approved: [],
  rejected: [],
};

export function isCampaignStatus(value: string): value is CampaignStatus {
  return (CAMPAIGN_STATUSES as readonly string[]).includes(value);
}

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(value);
}

export function canTransition(from: CampaignStatus, to: CampaignStatus): boolean {
  return CAMPAIGN_TRANSITIONS[from].includes(to);
}

export function canTransitionSubmission(from: SubmissionStatus, to: SubmissionStatus): boolean {
  return SUBMISSION_TRANSITIONS[from].includes(to);
}

/**
 * A revision can only be requested while the creator still has revisions left.
 * `revisionsAllowed` of 0 means the merchant only ever approves or rejects.
 */
export function canRequestRevision(revisionCount: number, revisionsAllowed: number): boolean {
  return revisionCount < revisionsAllowed;
}

type CampaignSnapshot = {
  status: CampaignStatus;
  deadline: string | Date;
  approvedCount?: number;
  rankedCount?: number;
};

/**
 * What the merchant can do right now, in the order the dashboard should offer it.
 * Deadline passing does not close a campaign on its own -- closing is an explicit
 * merchant action -- but it is what surfaces `close` as the primary next step.
 */
export function nextMerchantActions(
  campaign: CampaignSnapshot,
  now: Date = new Date(),
): MerchantAction[] {
  const deadline = campaign.deadline instanceof Date ? campaign.deadline : new Date(campaign.deadline);
  if (Number.isNaN(deadline.getTime())) {
    throw new Error('Campaign deadline must be a valid date');
  }
  const pastDeadline = deadline.getTime() <= now.getTime();
  const approved = campaign.approvedCount ?? 0;
  const ranked = campaign.rankedCount ?? 0;

  switch (campaign.status) {
    case 'draft':
      return ['edit', 'publish'];
    case 'published':
      return pastDeadline ? ['close', 'review_submissions'] : ['review_submissions', 'close'];
    case 'closed': {
      const actions: MerchantAction[] = ['review_submissions'];
      if (approved > 0) actions.push('select_winners');
      if (ranked > 0) actions.push('settle');
      return actions;
    }
    case 'settled':
      return ['review_submissions'];
  }
}

export function isAcceptingEntries(
  campaign: Pick<CampaignSnapshot, 'status' | 'deadline'>,
  now: Date = new Date(),
): boolean {
  if (campaign.status !== 'published') return false;
  const deadline = campaign.deadline instanceof Date ? campaign.deadline : new Date(campaign.deadline);
  return !Number.isNaN(deadline.getTime()) && deadline.getTime() > now.getTime();
}
