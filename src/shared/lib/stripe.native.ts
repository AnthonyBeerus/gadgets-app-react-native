import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

// Stripe survived the commerce teardown for one reason: a merchant still has to fund
// a campaign's prize pot before it can be published. The order checkout sheet and its
// `stripe-checkout` edge function are gone.
export const initializeCampaignPaymentSheet = initPaymentSheet;
export const presentCampaignPaymentSheet = presentPaymentSheet;
