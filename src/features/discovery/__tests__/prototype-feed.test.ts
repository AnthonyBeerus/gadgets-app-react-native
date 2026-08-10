import { PROTOTYPE_OPPORTUNITIES } from '../prototype-opportunities';

describe('alpha preview opportunity feed', () => {
  it('contains a credible, cash-based Molapo and partner ecosystem showcase', () => {
    expect(PROTOTYPE_OPPORTUNITIES.length).toBeGreaterThanOrEqual(10);
    expect(PROTOTYPE_OPPORTUNITIES.every(item => item.is_prototype)).toBe(true);
    expect(PROTOTYPE_OPPORTUNITIES.every(item => item.opportunity_id < 0)).toBe(true);
    expect(PROTOTYPE_OPPORTUNITIES.every(item => (item.pot_value ?? 0) > 0)).toBe(true);
    expect(PROTOTYPE_OPPORTUNITIES.every(item => item.deliverable_count > 0)).toBe(true);

    const merchants = PROTOTYPE_OPPORTUNITIES.map(item => item.merchant_name).join(' ');
    expect(merchants).toContain('Miss World Botswana');
    expect(merchants).toContain('ABICOB');
    expect(merchants).toContain('Sefalana');
    expect(merchants).toContain('Molapo Creative Hub');
  });

  it('labels inferred campaigns without claiming they are live partnerships', () => {
    expect(PROTOTYPE_OPPORTUNITIES.every(item => (item.prototype_disclaimer?.length ?? 0) > 20)).toBe(true);
  });
});
