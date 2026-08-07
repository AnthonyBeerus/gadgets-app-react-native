import AsyncStorage from '@react-native-async-storage/async-storage';

const OPEN_SHOP_INTENT_KEY = 'muse.open-shop-intent';

export async function setOpenShopIntent() {
  await AsyncStorage.setItem(OPEN_SHOP_INTENT_KEY, '1');
}

export async function clearOpenShopIntent() {
  await AsyncStorage.removeItem(OPEN_SHOP_INTENT_KEY);
}

export async function consumeOpenShopIntent(): Promise<boolean> {
  const value = await AsyncStorage.getItem(OPEN_SHOP_INTENT_KEY);
  if (!value) return false;
  await AsyncStorage.removeItem(OPEN_SHOP_INTENT_KEY);
  return true;
}
