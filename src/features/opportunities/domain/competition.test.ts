import {
  DEFAULT_PRIZE_SPLITS,
  calculateHybridScore,
  calculatePrizeAllocations,
  validateCompetitionBudget,
} from './competition';

describe('creator competition economics', () => {
  it('splits a P1,000 prize pot across the default top five', () => {
    expect(calculatePrizeAllocations(100_000, DEFAULT_PRIZE_SPLITS)).toEqual([
      40_000,
      25_000,
      15_000,
      10_000,
      10_000,
    ]);
  });

  it('requires the merchant to fund entry fees and the prize pot', () => {
    expect(
      validateCompetitionBudget({
        acceptedEntryFeeMinor: 5_000,
        maximumAcceptedEntries: 10,
        prizePotMinor: 100_000,
        fundedAmountMinor: 150_000,
      }),
    ).toEqual({ requiredAmountMinor: 150_000, isFullyFunded: true });
  });

  it('combines quality at 70 percent and engagement percentile at 30 percent', () => {
    expect(calculateHybridScore({ qualityScore: 80, engagementPercentile: 60 })).toBe(74);
  });
});
