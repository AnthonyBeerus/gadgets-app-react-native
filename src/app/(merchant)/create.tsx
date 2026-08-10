import { Redirect } from 'expo-router';

// The tab bar intercepts `tabPress` and pushes the wizard directly, so this screen is
// only reached by a deep link. Sending it on keeps that path working.
export default function MerchantCreateTab() {
  return <Redirect href="/(merchant)/campaigns/new" />;
}
