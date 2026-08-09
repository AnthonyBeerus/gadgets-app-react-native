import { PROTOTYPE_OPPORTUNITIES } from '../prototype-opportunities';
import {
  PROTOTYPE_MERCHANTS,
  buildMerchantGrowthProfiles,
  searchMerchantGrowthProfiles,
} from '../shops-model';

describe('campaign-aware Shops model', () => {
  const profiles = buildMerchantGrowthProfiles(PROTOTYPE_MERCHANTS, PROTOTYPE_OPPORTUNITIES);

  it('builds a dense Molapo merchant set joined by merchant ID', () => {
    expect(profiles.length).toBeGreaterThanOrEqual(10);
    expect(profiles.every(profile => profile.id < 0)).toBe(true);
    expect(profiles.every(profile => profile.isPrototype)).toBe(true);
    expect(profiles.filter(profile => profile.opportunity).length).toBeGreaterThanOrEqual(8);
    expect(profiles[0].isSponsored).toBe(true);
  });

  it('groups search results with merchants first, then opportunities and products', () => {
    const beauty = searchMerchantGrowthProfiles(profiles, 'beauty');
    expect(beauty.merchants.length).toBeGreaterThan(0);
    expect(beauty.opportunities.length).toBeGreaterThan(0);
    expect(beauty.products.length).toBeGreaterThan(0);
  });

  it('keeps prototype products isolated from live IDs', () => {
    const products = profiles.flatMap(profile => profile.products);
    expect(products.every(product => product.id < 0)).toBe(true);
    expect(products.every(product => product.slug.startsWith('prototype-'))).toBe(true);
  });
});
