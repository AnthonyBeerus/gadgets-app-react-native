import { Redirect } from 'expo-router';

/** Legacy cart route — bag combines cart + saved challenges. */
export default function CartRedirect() {
  return <Redirect href="/bag?tab=cart" />;
}
