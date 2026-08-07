import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearOpenShopIntent,
  consumeOpenShopIntent,
  setOpenShopIntent,
} from '../open-shop-intent';

describe('open shop intent', () => {
  beforeEach(async () => AsyncStorage.clear());

  it('stores and consumes intent once', async () => {
    await setOpenShopIntent();
    expect(await consumeOpenShopIntent()).toBe(true);
    expect(await consumeOpenShopIntent()).toBe(false);
  });

  it('clears intent without consuming', async () => {
    await setOpenShopIntent();
    await clearOpenShopIntent();
    expect(await consumeOpenShopIntent()).toBe(false);
  });
});
