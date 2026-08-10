import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

import { useCartStore } from '../../../store/cart-store';

/** Statuses where money is in flight and the webhook, not this phone, decides the outcome. */
const IN_FLIGHT = ['requires_payment', 'processing'] as const;

/**
 * If the app was killed mid-payment, the persisted payment flow is the only record
 * that money is in flight. Rehydrate straight back into the processing panel rather
 * than dropping the user on Discover with a silently pending order.
 *
 * Processing itself resolves the branch: confirmed routes to B8, failed to B7.
 */
export function usePaymentResume() {
  const router = useRouter();
  const resumed = useRef(false);

  useEffect(() => {
    if (resumed.current) return;

    const resume = () => {
      if (resumed.current) return;
      resumed.current = true;
      const flow = useCartStore.getState().paymentFlow;
      if (!flow || !IN_FLIGHT.includes(flow.status as (typeof IN_FLIGHT)[number])) return;
      router.replace({ pathname: '/payment-processing', params: { orderId: String(flow.orderId) } });
    };

    const persist = useCartStore.persist;
    if (!persist || persist.hasHydrated()) {
      resume();
      return;
    }
    return persist.onFinishHydration(resume);
  }, [router]);
}
