import {
  campaignAssetsSchema,
  campaignBasicsSchema,
  campaignBriefSchema,
  campaignPrizeSchema,
  campaignTermsSchema,
  emptyCampaignForm,
} from '../campaign-schema';

describe('campaignBasicsSchema', () => {
  it('accepts a filled-in basics step', () => {
    const result = campaignBasicsSchema.safeParse({
      title: 'Summer braai content',
      description: 'Film yourself ordering and eating our weekend braai platter.',
      campaignGoal: 'ugc_library',
      category: 'Food',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a title that is too short to be useful', () => {
    const result = campaignBasicsSchema.safeParse({
      title: 'Hi',
      description: 'A perfectly long enough description of the campaign.',
      campaignGoal: 'awareness',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a one-line brief', () => {
    const result = campaignBasicsSchema.safeParse({
      title: 'Valid title',
      description: 'Too short',
      campaignGoal: 'awareness',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown goal', () => {
    const result = campaignBasicsSchema.safeParse({
      title: 'Valid title',
      description: 'A perfectly long enough description of the campaign.',
      campaignGoal: 'virality',
    });
    expect(result.success).toBe(false);
  });
});

describe('campaignBriefSchema', () => {
  const base = {
    contentFormat: 'video' as const,
    deliverableCount: 1,
    talkingPoints: [],
    dos: [],
    donts: [],
  };

  it('accepts a coherent video window', () => {
    expect(
      campaignBriefSchema.safeParse({ ...base, videoMinSeconds: 15, videoMaxSeconds: 60 }).success,
    ).toBe(true);
  });

  it('rejects an inverted video window', () => {
    const result = campaignBriefSchema.safeParse({
      ...base,
      videoMinSeconds: 90,
      videoMaxSeconds: 30,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a video length on a photo campaign', () => {
    const result = campaignBriefSchema.safeParse({
      ...base,
      contentFormat: 'photo',
      videoMinSeconds: 15,
    });
    expect(result.success).toBe(false);
  });

  it('caps the brief at eight bullets per list', () => {
    const nine = Array.from({ length: 9 }, (_, i) => `Point ${i}`);
    expect(campaignBriefSchema.safeParse({ ...base, talkingPoints: nine }).success).toBe(false);
  });

  it('refuses to ask for more than ten deliverables', () => {
    expect(campaignBriefSchema.safeParse({ ...base, deliverableCount: 11 }).success).toBe(false);
    expect(campaignBriefSchema.safeParse({ ...base, deliverableCount: 0 }).success).toBe(false);
  });
});

describe('campaignAssetsSchema', () => {
  it('requires at least one brand asset', () => {
    expect(
      campaignAssetsSchema.safeParse({ brandAssetPaths: [], imageUrl: 'https://x/y.jpg' }).success,
    ).toBe(false);
    expect(
      campaignAssetsSchema.safeParse({ brandAssetPaths: ['1/2/a.png'], imageUrl: 'https://x/y.jpg' })
        .success,
    ).toBe(true);
  });

  it('requires a cover image', () => {
    expect(
      campaignAssetsSchema.safeParse({ brandAssetPaths: ['1/2/a.png'], imageUrl: '' }).success,
    ).toBe(false);
  });
});

describe('campaignPrizeSchema', () => {
  it('rejects a deadline in the past', () => {
    const result = campaignPrizeSchema.safeParse({
      potValue: 1000,
      potCurrency: 'BWP',
      deadline: new Date(Date.now() - 1000),
    });
    expect(result.success).toBe(false);
  });

  it('rejects a zero or negative pot', () => {
    const deadline = new Date(Date.now() + 86_400_000);
    expect(campaignPrizeSchema.safeParse({ potValue: 0, potCurrency: 'BWP', deadline }).success).toBe(
      false,
    );
    expect(
      campaignPrizeSchema.safeParse({ potValue: -5, potCurrency: 'BWP', deadline }).success,
    ).toBe(false);
  });

  it('accepts a funded future campaign', () => {
    expect(
      campaignPrizeSchema.safeParse({
        potValue: 1500,
        potCurrency: 'BWP',
        deadline: new Date(Date.now() + 86_400_000),
      }).success,
    ).toBe(true);
  });
});

describe('campaignTermsSchema', () => {
  it('allows zero revisions', () => {
    expect(
      campaignTermsSchema.safeParse({
        usageRights: 'organic_social_12m',
        revisionsAllowed: 0,
        reviewSlaDays: 5,
      }).success,
    ).toBe(true);
  });

  it('rejects a review SLA outside a month', () => {
    expect(
      campaignTermsSchema.safeParse({
        usageRights: 'none',
        revisionsAllowed: 1,
        reviewSlaDays: 45,
      }).success,
    ).toBe(false);
  });
});

describe('emptyCampaignForm', () => {
  it('is a valid starting point for every step except the ones the merchant must fill', () => {
    // Assets and basics are intentionally blank; everything else should already pass.
    expect(campaignBriefSchema.safeParse(emptyCampaignForm).success).toBe(true);
    expect(campaignPrizeSchema.safeParse(emptyCampaignForm).success).toBe(true);
    expect(campaignTermsSchema.safeParse(emptyCampaignForm).success).toBe(true);
    expect(campaignBasicsSchema.safeParse(emptyCampaignForm).success).toBe(false);
    expect(campaignAssetsSchema.safeParse(emptyCampaignForm).success).toBe(false);
  });
});
