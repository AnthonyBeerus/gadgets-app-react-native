import { DEFAULT_PRIZE_SPLITS } from '../../opportunities/domain/competition';

export const MAX_WINNERS = 5;

/** The DB stores splits as fractions keyed by rank: {"1":0.4,"2":0.25,...}. */
export type PotSplits = Record<string, number>;

export type WinnerAllocation = {
  rank: number;
  submissionId: number;
  /** Currency units to 2dp, matching challenges.pot_value. */
  prize: number;
};

export function splitsToFractions(splits: PotSplits | null | undefined): number[] {
  if (!splits || Object.keys(splits).length === 0) {
    return DEFAULT_PRIZE_SPLITS.map(pct => pct / 100);
  }
  return Object.keys(splits)
    .map(Number)
    .filter(rank => Number.isInteger(rank) && rank >= 1)
    .sort((a, b) => a - b)
    .map(rank => splits[String(rank)]);
}

const floorToCent = (value: number) => Math.floor(value * 100) / 100;
const roundToCent = (value: number) => Math.round(value * 100) / 100;

/**
 * Maps the merchant's chosen order onto the pot.
 *
 * Mirrors public.campaign_prize_for_rank exactly: only the ranks that actually have a
 * winner share the pot (a 3-winner campaign spends all of it, not 80%), each of ranks
 * 2..n is floored to the cent, and first place absorbs the remainder so the prizes
 * always sum to the funded pot. Keeping the two in lockstep is what lets the merchant
 * trust the payout preview before they settle.
 */
export function allocateToWinners(
  rankedSubmissionIds: readonly number[],
  pot: number,
  splits: PotSplits | null | undefined,
): WinnerAllocation[] {
  if (rankedSubmissionIds.length === 0) return [];
  if (rankedSubmissionIds.length > MAX_WINNERS) {
    throw new Error(`A campaign pays at most ${MAX_WINNERS} winners`);
  }
  if (new Set(rankedSubmissionIds).size !== rankedSubmissionIds.length) {
    throw new Error('A submission cannot win two places');
  }
  if (!Number.isFinite(pot) || pot <= 0) {
    throw new Error('The prize pot must be more than zero');
  }

  const occupied = splitsToFractions(splits).slice(0, rankedSubmissionIds.length);
  const total = occupied.reduce((sum, fraction) => sum + fraction, 0);
  if (total <= 0) throw new Error('Prize splits must be positive');

  const tail = occupied.slice(1).map(fraction => floorToCent((pot * fraction) / total));
  const first = roundToCent(pot - tail.reduce((sum, value) => sum + value, 0));

  return rankedSubmissionIds.map((submissionId, index) => ({
    rank: index + 1,
    submissionId,
    prize: index === 0 ? first : tail[index - 1],
  }));
}

export function totalAllocated(allocations: readonly WinnerAllocation[]): number {
  return roundToCent(allocations.reduce((sum, a) => sum + a.prize, 0));
}
