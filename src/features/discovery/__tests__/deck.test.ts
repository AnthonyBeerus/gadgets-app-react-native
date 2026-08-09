import { buildDiscoveryDeck } from '../deck';
import { PROTOTYPE_OPPORTUNITIES } from '../prototype-opportunities';

describe('discovery deck', () => {
  it('places a sponsored-demo slot after opportunities, never first', () => {
    const deck = buildDiscoveryDeck(PROTOTYPE_OPPORTUNITIES.slice(0, 8), 4);
    expect(deck[0].kind).toBe('opportunity');
    expect(deck[4].kind).toBe('sponsored-demo');
    expect(deck.filter(item => item.kind === 'sponsored-demo')).toHaveLength(2);
  });
});
