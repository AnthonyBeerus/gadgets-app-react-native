import type { CreatorOpportunityFeedItem } from '../types';

export type DiscoverAdVariant = {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  metricPrimary: string;
  metricPrimaryLabel: string;
  metricSecondary: string;
  metricSecondaryLabel: string;
  cta: string;
};

export type DiscoverDeckEntry =
  | { kind: 'opportunity'; key: string; item: CreatorOpportunityFeedItem }
  | { kind: 'ad'; key: string; ad: DiscoverAdVariant };

const AD_VARIANTS: DiscoverAdVariant[] = [
  {
    id: 'merchant-pot',
    eyebrow: 'Sponsored · Muse for merchants',
    headline: 'Fund a pot. Own the feed.',
    body: 'Local shops buy this slot to put a live challenge in front of swipers — purchase-gated, ranked, voucher-settled.',
    metricPrimary: 'P1.2k',
    metricPrimaryLabel: 'avg pot on Muse',
    metricSecondary: '5',
    metricSecondaryLabel: 'placers split rewards',
    cta: 'I run a shop',
  },
  {
    id: 'reach-slot',
    eyebrow: 'Ad slot · showcase',
    headline: 'This swipe is inventory.',
    body: 'Every Pass and Save is attention merchants pay to reach. Muse turns that attention into buy → post → board.',
    metricPrimary: '40/25/15',
    metricPrimaryLabel: 'top-3 voucher split',
    metricSecondary: '30d',
    metricSecondaryLabel: 'voucher validity',
    cta: 'See merchant pricing',
  },
  {
    id: 'creator-value',
    eyebrow: 'Why Muse beats cold DMs',
    headline: 'Creators compete. Merchants convert.',
    body: 'No vague “post for exposure.” A real pot, a qualifying buy, and a public leaderboard — that’s the product.',
    metricPrimary: 'P50+',
    metricPrimaryLabel: 'consolation vouchers',
    metricSecondary: 'TikTok',
    metricSecondaryLabel: 'proof of work',
    cta: 'I create content',
  },
];

/** Insert a sponsored card after every `every` opportunities (default 5). */
export function injectDiscoverAdSlots(
  items: CreatorOpportunityFeedItem[],
  every = 5,
): DiscoverDeckEntry[] {
  const deck: DiscoverDeckEntry[] = [];
  let adIndex = 0;

  items.forEach((item, index) => {
    deck.push({ kind: 'opportunity', key: `opp-${item.opportunity_id}`, item });
    if ((index + 1) % every === 0) {
      const ad = AD_VARIANTS[adIndex % AD_VARIANTS.length];
      deck.push({
        kind: 'ad',
        key: `ad-${ad.id}-${adIndex}`,
        ad: { ...ad, id: `${ad.id}-${adIndex}` },
      });
      adIndex += 1;
    }
  });

  return deck;
}
