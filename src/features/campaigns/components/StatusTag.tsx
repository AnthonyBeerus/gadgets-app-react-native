import { Tag, type TagTone } from '../../../shared/design-system';
import type { CampaignStatus, SubmissionStatus } from '../domain/campaign-status';

const CAMPAIGN_LABELS: Record<CampaignStatus, { label: string; tone: TagTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  published: { label: 'Live', tone: 'success' },
  closed: { label: 'Closed', tone: 'warning' },
  settled: { label: 'Settled', tone: 'accent' },
};

const SUBMISSION_LABELS: Record<SubmissionStatus, { label: string; tone: TagTone }> = {
  draft: { label: 'Not submitted', tone: 'neutral' },
  submitted: { label: 'In review', tone: 'warning' },
  under_review: { label: 'In review', tone: 'warning' },
  revision_requested: { label: 'Changes requested', tone: 'accent' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Not selected', tone: 'error' },
};

export function CampaignStatusTag({ status }: { status: CampaignStatus }) {
  const { label, tone } = CAMPAIGN_LABELS[status] ?? CAMPAIGN_LABELS.draft;
  return <Tag label={label} tone={tone} />;
}

export function SubmissionStatusTag({ status }: { status: SubmissionStatus }) {
  const { label, tone } = SUBMISSION_LABELS[status] ?? SUBMISSION_LABELS.draft;
  return <Tag label={label} tone={tone} />;
}

export function describeDeadline(deadline: string, now: Date = new Date()): string {
  const end = new Date(deadline);
  const ms = end.getTime() - now.getTime();
  if (Number.isNaN(ms)) return 'No deadline';
  if (ms <= 0) return 'Deadline passed';
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return `${days} day${days === 1 ? '' : 's'} left`;
  const hours = Math.max(1, Math.floor(ms / 3_600_000));
  return `${hours} hour${hours === 1 ? '' : 's'} left`;
}
