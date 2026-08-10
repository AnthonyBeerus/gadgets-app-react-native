import { z } from 'zod';

export const CAMPAIGN_GOALS = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'product_launch', label: 'Product launch' },
  { value: 'ugc_library', label: 'Build a content library' },
  { value: 'conversions', label: 'Drive sales' },
] as const;

export const CONTENT_FORMATS = [
  { value: 'video', label: 'Video' },
  { value: 'photo', label: 'Photo' },
  { value: 'either', label: 'Either' },
] as const;

/**
 * Usage rights are the thing a merchant is actually buying, so they are explicit
 * rather than buried in terms. Every UGC platform surfaces this on the brief.
 */
export const USAGE_RIGHTS = [
  {
    value: 'none',
    label: 'Creator keeps all rights',
    detail: 'You may not reuse the content. Creators post it themselves.',
  },
  {
    value: 'organic_social_12m',
    label: 'Organic social, 12 months',
    detail: 'Repost on your own channels for a year. No paid promotion.',
  },
  {
    value: 'paid_ads_12m',
    label: 'Paid ads, 12 months',
    detail: 'Use in paid campaigns for a year, including whitelisted ads.',
  },
  {
    value: 'perpetual_all_media',
    label: 'Full rights, forever',
    detail: 'Unlimited use across any medium. Expect to pay more for this.',
  },
] as const;

const trimmed = (min: number, max: number, field: string) =>
  z
    .string()
    .trim()
    .min(min, `${field} must be at least ${min} characters`)
    .max(max, `${field} must be under ${max} characters`);

const bulletList = z
  .array(z.string().trim().min(1).max(140))
  .max(8, 'Keep it to 8 points — briefs longer than a page get skimmed')
  .default([]);

export const campaignBasicsSchema = z.object({
  title: trimmed(4, 80, 'Title'),
  description: trimmed(20, 1200, 'Brief'),
  campaignGoal: z.enum(['awareness', 'product_launch', 'ugc_library', 'conversions']),
  category: z.string().trim().max(60).optional().nullable(),
});

export const campaignBriefSchema = z
  .object({
    contentFormat: z.enum(['video', 'photo', 'either']),
    deliverableCount: z.coerce
      .number()
      .int()
      .min(1, 'Ask for at least one file')
      .max(10, 'Ten files is the cap'),
    videoMinSeconds: z.coerce.number().int().min(1).max(600).nullable().optional(),
    videoMaxSeconds: z.coerce.number().int().min(1).max(600).nullable().optional(),
    talkingPoints: bulletList,
    dos: bulletList,
    donts: bulletList,
  })
  .refine(
    v =>
      v.videoMinSeconds == null ||
      v.videoMaxSeconds == null ||
      v.videoMinSeconds <= v.videoMaxSeconds,
    { message: 'Minimum length cannot exceed the maximum', path: ['videoMaxSeconds'] },
  )
  .refine(v => v.contentFormat !== 'photo' || (v.videoMinSeconds == null && v.videoMaxSeconds == null), {
    message: 'Photo campaigns cannot set a video length',
    path: ['videoMinSeconds'],
  });

export const campaignAssetsSchema = z.object({
  brandAssetPaths: z
    .array(z.string().min(1))
    .min(1, 'Add at least one brand asset so creators know what to make')
    .max(10, 'Ten assets is plenty'),
  imageUrl: z.string().trim().min(1, 'Pick a cover image'),
});

export const campaignPrizeSchema = z.object({
  potValue: z.coerce.number().positive('The prize pot must be more than zero'),
  potCurrency: z.string().trim().length(3).default('BWP'),
  deadline: z.coerce.date().refine(d => d.getTime() > Date.now(), {
    message: 'The deadline must be in the future',
  }),
});

export const campaignTermsSchema = z.object({
  usageRights: z.enum(['none', 'organic_social_12m', 'paid_ads_12m', 'perpetual_all_media']),
  revisionsAllowed: z.coerce.number().int().min(0).max(5),
  reviewSlaDays: z.coerce
    .number()
    .int()
    .min(1)
    .max(30)
    // 3-7 days is the industry norm; anything longer and creators disengage.
    .default(5),
});

export const campaignFormSchema = campaignBasicsSchema
  .and(campaignBriefSchema)
  .and(campaignAssetsSchema)
  .and(campaignPrizeSchema)
  .and(campaignTermsSchema);

export type CampaignBasics = z.infer<typeof campaignBasicsSchema>;
export type CampaignBrief = z.infer<typeof campaignBriefSchema>;
export type CampaignAssets = z.infer<typeof campaignAssetsSchema>;
export type CampaignPrize = z.infer<typeof campaignPrizeSchema>;
export type CampaignTerms = z.infer<typeof campaignTermsSchema>;
export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const CAMPAIGN_WIZARD_STEPS = [
  { key: 'basics', title: 'Basics', schema: campaignBasicsSchema },
  { key: 'brief', title: 'The brief', schema: campaignBriefSchema },
  { key: 'assets', title: 'Brand assets', schema: campaignAssetsSchema },
  { key: 'prize', title: 'Prize & deadline', schema: campaignPrizeSchema },
  { key: 'terms', title: 'Rights & review', schema: campaignTermsSchema },
] as const;

export type CampaignWizardStepKey = (typeof CAMPAIGN_WIZARD_STEPS)[number]['key'];

export const emptyCampaignForm: CampaignFormValues = {
  title: '',
  description: '',
  campaignGoal: 'ugc_library',
  category: null,
  contentFormat: 'video',
  deliverableCount: 1,
  videoMinSeconds: 15,
  videoMaxSeconds: 60,
  talkingPoints: [],
  dos: [],
  donts: [],
  brandAssetPaths: [],
  imageUrl: '',
  potValue: 1000,
  potCurrency: 'BWP',
  deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  usageRights: 'organic_social_12m',
  revisionsAllowed: 1,
  reviewSlaDays: 5,
};
