import type { CreatorOpportunityFeedItem, DiscoveryDeckEntry, SponsoredDemo } from './types';

const sponsoredDemo: SponsoredDemo = {
  id: 'molapo-generated-ad',
  advertiser: 'Your business at Molapo',
  headline: 'Your next ad could start with local creators',
  body: 'Muse turns a product, an offer and a funded creator brief into a sponsored discovery card people can save, shop and respond to.',
  badge: 'Generated ad concept · not sponsored',
  merchantId: -204,
};

export function buildDiscoveryDeck(items: CreatorOpportunityFeedItem[], interval = 4): DiscoveryDeckEntry[] {
  const deck: DiscoveryDeckEntry[] = [];
  items.forEach((item, index) => {
    deck.push({ kind: 'opportunity', key: `opp-${item.opportunity_id}`, item });
    if ((index + 1) % interval === 0) {
      deck.push({ kind: 'sponsored-demo', key: `ad-${index + 1}`, item: sponsoredDemo });
    }
  });
  return deck;
}
