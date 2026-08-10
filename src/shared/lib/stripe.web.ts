// Web has no native PaymentSheet. Campaign pot funding is a native-only flow, so
// these resolve with an error rather than pretending to have taken a payment.
export const initializeCampaignPaymentSheet = async (_options: unknown) => ({
  error: { message: 'Fund a campaign from the Muse mobile app.' },
});

export const presentCampaignPaymentSheet = async () => ({
  error: { message: 'Fund a campaign from the Muse mobile app.' },
});
