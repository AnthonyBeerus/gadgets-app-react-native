import { Redirect } from 'expo-router';

/** Browsing Muse is public; protected actions interrupt into auth when needed. */
export default function RootRedirect() {
  return <Redirect href="/(shop)" />;
}
