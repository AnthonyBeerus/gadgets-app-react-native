import type { CreatorOpportunityFeedItem } from './types';

/**
 * Preserve server relevance while preventing a single merchant from owning the deck.
 * Every fourth slot favors the least represented available merchant.
 */
export function diversifyOpportunityFeed(
  items: CreatorOpportunityFeedItem[],
): CreatorOpportunityFeedItem[] {
  const remaining = [...items];
  const result: CreatorOpportunityFeedItem[] = [];
  const merchantCounts = new Map<number, number>();

  while (remaining.length > 0) {
    const last = result.at(-1)?.merchant_id;
    const previous = result.at(-2)?.merchant_id;
    const explorationSlot = result.length % 4 === 3;
    const allowed = remaining
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !(item.merchant_id === last && item.merchant_id === previous));
    const pool = allowed.length > 0 ? allowed : remaining.map((item, index) => ({ item, index }));

    let selected = pool[0];
    if (explorationSlot) {
      selected = pool.reduce((best, candidate) => {
        const bestCount = merchantCounts.get(best.item.merchant_id) ?? 0;
        const candidateCount = merchantCounts.get(candidate.item.merchant_id) ?? 0;
        return candidateCount < bestCount ? candidate : best;
      });
    }

    result.push(selected.item);
    merchantCounts.set(
      selected.item.merchant_id,
      (merchantCounts.get(selected.item.merchant_id) ?? 0) + 1,
    );
    remaining.splice(selected.index, 1);
  }

  return result;
}
