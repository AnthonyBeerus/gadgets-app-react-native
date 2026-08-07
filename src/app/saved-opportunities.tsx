import { Redirect } from 'expo-router';

/** Legacy saved route — bag combines cart + saved challenges. */
export default function SavedOpportunitiesRedirect() {
  return <Redirect href="/bag?tab=saved" />;
}
