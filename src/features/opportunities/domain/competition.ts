export const DEFAULT_PRIZE_SPLITS = [40, 25, 15, 10, 10] as const;

type CompetitionBudget = {
  acceptedEntryFeeMinor: number;
  maximumAcceptedEntries: number;
  prizePotMinor: number;
  fundedAmountMinor: number;
};

type HybridScoreInput = {
  qualityScore: number;
  engagementPercentile: number;
};

const assertNonNegativeInteger = (value: number, field: string) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative integer`);
  }
};

export function calculatePrizeAllocations(
  prizePotMinor: number,
  splits: readonly number[],
): number[] {
  assertNonNegativeInteger(prizePotMinor, 'prizePotMinor');
  if (splits.length === 0 || splits.some(split => split <= 0)) {
    throw new Error('Prize splits must contain positive percentages');
  }
  if (splits.reduce((sum, split) => sum + split, 0) !== 100) {
    throw new Error('Prize splits must total 100 percent');
  }

  const allocations = splits.map(split => Math.floor((prizePotMinor * split) / 100));
  const allocated = allocations.reduce((sum, amount) => sum + amount, 0);
  allocations[0] += prizePotMinor - allocated;
  return allocations;
}

export function validateCompetitionBudget(input: CompetitionBudget) {
  Object.entries(input).forEach(([field, value]) => assertNonNegativeInteger(value, field));
  const participationBudget = input.acceptedEntryFeeMinor * input.maximumAcceptedEntries;
  const requiredAmountMinor = participationBudget + input.prizePotMinor;
  return {
    requiredAmountMinor,
    isFullyFunded: input.fundedAmountMinor >= requiredAmountMinor,
  };
}

export function calculateHybridScore(input: HybridScoreInput): number {
  const scores = [input.qualityScore, input.engagementPercentile];
  if (scores.some(score => !Number.isFinite(score) || score < 0 || score > 100)) {
    throw new Error('Scores must be between 0 and 100');
  }
  return Number((input.qualityScore * 0.7 + input.engagementPercentile * 0.3).toFixed(2));
}
