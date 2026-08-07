import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GuestOpportunityPreference, OpportunityPreferenceState } from './types';

const STORAGE_KEY = 'muse.creator-opportunity-preferences.v1';

export async function getGuestOpportunityPreferences(): Promise<GuestOpportunityPreference[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export async function setGuestOpportunityPreference(
  opportunityId: number,
  state: OpportunityPreferenceState,
): Promise<GuestOpportunityPreference> {
  const next = {
    opportunity_id: opportunityId,
    state,
    updated_at: new Date().toISOString(),
  } satisfies GuestOpportunityPreference;
  const preferences = (await getGuestOpportunityPreferences()).filter(
    item => item.opportunity_id !== opportunityId,
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...preferences, next]));
  return next;
}

export async function restoreGuestOpportunityPreference(opportunityId: number) {
  const preferences = (await getGuestOpportunityPreferences()).filter(
    item => item.opportunity_id !== opportunityId,
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export async function clearGuestOpportunityPreferences() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
