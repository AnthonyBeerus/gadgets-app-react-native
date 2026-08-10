export { ClerkProvider, useAuth, useUser } from '@clerk/expo';
// Muse's custom auth screen uses Clerk's SignInResource/SignUpResource flow.
// Clerk Expo v3 moved those compatible hooks behind the explicit legacy entry.
export { useSignIn, useSignUp } from '@clerk/expo/legacy';
export { tokenCache } from '@clerk/expo/token-cache';
