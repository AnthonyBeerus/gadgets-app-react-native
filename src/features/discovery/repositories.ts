import type { CreatorOpportunityFeedItem } from './types';
import type { MerchantGrowthProfile } from './shops-model';

export type DataProvenance = 'live' | 'illustrative-fallback' | 'cached' | 'unavailable';
export type RepositoryResult<T> = {
  provenance: DataProvenance;
  records: T[];
  reason: 'empty' | 'unavailable' | null;
};

export interface OpportunityRepository {
  list(input?: { cursor?: number; limit?: number; mallId?: number | null }): Promise<RepositoryResult<CreatorOpportunityFeedItem>>;
  get(id: number): Promise<CreatorOpportunityFeedItem | null>;
}

export interface MerchantRepository {
  list(): Promise<RepositoryResult<MerchantGrowthProfile>>;
  get(id: number): Promise<MerchantGrowthProfile | null>;
}

export interface ProductRepository<TProduct> {
  get(slug: string): Promise<TProduct | null>;
}

export interface OrderRepository<TOrder> {
  get(id: string): Promise<TOrder | null>;
}

export interface MerchantWorkspaceRepository<TWorkspace> {
  get(): Promise<TWorkspace | null>;
}

export async function withIllustrativeFallback<T>(
  readLive: () => Promise<T[]>,
  illustrativeRecords: T[],
): Promise<RepositoryResult<T>> {
  try {
    const records = await readLive();
    if (records.length > 0) return { provenance: 'live', records, reason: null };
    return { provenance: 'illustrative-fallback', records: illustrativeRecords, reason: 'empty' };
  } catch {
    return { provenance: 'illustrative-fallback', records: illustrativeRecords, reason: 'unavailable' };
  }
}
