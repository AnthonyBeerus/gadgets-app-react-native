import { allocateToWinners, splitsToFractions, totalAllocated } from '../winner-selection';

const STANDARD_SPLITS = { '1': 0.4, '2': 0.25, '3': 0.15, '4': 0.1, '5': 0.1 };

describe('splitsToFractions', () => {
  it('reads DB fractions in rank order', () => {
    expect(splitsToFractions(STANDARD_SPLITS)).toEqual([0.4, 0.25, 0.15, 0.1, 0.1]);
  });

  it('falls back to the default split when none is stored', () => {
    expect(splitsToFractions(null)).toEqual([0.4, 0.25, 0.15, 0.1, 0.1]);
    expect(splitsToFractions({})).toEqual([0.4, 0.25, 0.15, 0.1, 0.1]);
  });

  it('sorts numerically, not lexically', () => {
    // '10' sorts before '2' as a string; ranks must stay in numeric order.
    expect(splitsToFractions({ '1': 0.5, '2': 0.3, '10': 0.2 })).toEqual([0.5, 0.3, 0.2]);
  });
});

describe('allocateToWinners', () => {
  it('pays the standard split to a full set of five winners', () => {
    const result = allocateToWinners([11, 12, 13, 14, 15], 100_000, STANDARD_SPLITS);
    expect(result.map(r => r.prize)).toEqual([40_000, 25_000, 15_000, 10_000, 10_000]);
    expect(result.map(r => r.rank)).toEqual([1, 2, 3, 4, 5]);
    expect(result.map(r => r.submissionId)).toEqual([11, 12, 13, 14, 15]);
  });

  it('renormalises so a partial winner set still spends the whole pot', () => {
    const result = allocateToWinners([11, 12, 13], 100_000, STANDARD_SPLITS);
    // A raw 40/25/15 would strand 20% of merchant-funded money.
    expect(result.map(r => r.prize)).toEqual([50_000, 31_250, 18_750]);
    expect(totalAllocated(result)).toBe(100_000);
  });

  it('gives a single winner the entire pot', () => {
    expect(allocateToWinners([11], 100_000, STANDARD_SPLITS)).toEqual([
      { rank: 1, submissionId: 11, prize: 100_000 },
    ]);
  });

  /**
   * These are the exact numbers public.campaign_prize_for_rank returns for a 100000
   * pot. If this test fails, the merchant's payout preview has drifted from what
   * settle_campaign will actually pay, which is the one thing this pair must never do.
   */
  it('matches the SQL allocation for every winner count', () => {
    const expected: Record<number, number[]> = {
      1: [100_000],
      2: [61_538.47, 38_461.53],
      3: [50_000, 31_250, 18_750],
      4: [44_444.46, 27_777.77, 16_666.66, 11_111.11],
      5: [40_000, 25_000, 15_000, 10_000, 10_000],
    };
    for (const [count, prizes] of Object.entries(expected)) {
      const ids = Array.from({ length: Number(count) }, (_, i) => i + 1);
      expect(allocateToWinners(ids, 100_000, STANDARD_SPLITS).map(r => r.prize)).toEqual(prizes);
    }
  });

  it('never loses or invents a cent', () => {
    for (const pot of [999.99, 1000.01, 3, 7.77, 12_345.67, 1_234_567]) {
      for (const count of [1, 2, 3, 4, 5]) {
        const ids = Array.from({ length: count }, (_, i) => i + 1);
        expect(totalAllocated(allocateToWinners(ids, pot, STANDARD_SPLITS))).toBe(pot);
      }
    }
  });

  it('returns nothing when no winners were picked', () => {
    expect(allocateToWinners([], 100_000, STANDARD_SPLITS)).toEqual([]);
  });

  it('rejects more than five winners', () => {
    expect(() => allocateToWinners([1, 2, 3, 4, 5, 6], 100_000, STANDARD_SPLITS)).toThrow(
      'at most 5',
    );
  });

  it('rejects the same submission in two places', () => {
    expect(() => allocateToWinners([1, 2, 1], 100_000, STANDARD_SPLITS)).toThrow('two places');
  });

  it('rejects an unfunded pot', () => {
    expect(() => allocateToWinners([1], 0, STANDARD_SPLITS)).toThrow('more than zero');
  });
});
