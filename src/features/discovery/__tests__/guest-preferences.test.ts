import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearGuestOpportunityPreferences,
  getGuestOpportunityPreferences,
  restoreGuestOpportunityPreference,
  setGuestOpportunityPreference,
} from '../guest-preferences';

describe('guest creator opportunity preferences', () => {
  beforeEach(async () => AsyncStorage.clear());

  it('keeps only the newest action for an opportunity', async () => {
    await setGuestOpportunityPreference(8, 'saved');
    await setGuestOpportunityPreference(8, 'dismissed');
    expect(await getGuestOpportunityPreferences()).toEqual([
      expect.objectContaining({ opportunity_id: 8, state: 'dismissed' }),
    ]);
  });

  it('restores one opportunity without removing the rest', async () => {
    await setGuestOpportunityPreference(8, 'saved');
    await setGuestOpportunityPreference(9, 'dismissed');
    await restoreGuestOpportunityPreference(8);
    expect(await getGuestOpportunityPreferences()).toEqual([
      expect.objectContaining({ opportunity_id: 9, state: 'dismissed' }),
    ]);
  });

  it('clears preferences after a successful account merge', async () => {
    await setGuestOpportunityPreference(8, 'saved');
    await clearGuestOpportunityPreferences();
    expect(await getGuestOpportunityPreferences()).toEqual([]);
  });
});
