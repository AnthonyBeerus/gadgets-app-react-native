import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartItemType = {
  id: number;
  shopId: number;
  shopName: string;
  hasDelivery?: boolean;
  hasCollection?: boolean;
  deliveryFee?: number;
  minimumOrderAmount?: number;
  title: string;
  heroImage: string;
  price: number;
  quantity: number;
  maxQuantity: number;
};

export type DiscoverySource = 'discover' | 'saved' | 'marketplace' | 'merchant';

export type CartAttribution = {
  source: DiscoverySource;
  opportunityId?: number;
};

export type CheckoutDraft = { fulfilment: 'collection' | 'delivery'; phone: string; address: string; notes: string };
export type PaymentFlowState = { orderId: number; paymentIntentId?: string; status: 'idle' | 'requires_payment' | 'processing' | 'succeeded' | 'failed' | 'cancelled'; reservationExpiresAt?: string } | null;

type CartState = {
  items: CartItemType[];
  attribution: CartAttribution | null;
  activeCheckoutKey: string | null;
  checkoutDraft: CheckoutDraft;
  paymentFlow: PaymentFlowState;
  addItem: (item: CartItemType) => 'added' | 'quantity_updated' | 'merchant_conflict';
  replaceCart: (item: CartItemType) => void;
  setAttribution: (attribution: CartAttribution | null) => void;
  setActiveCheckoutKey: (key: string | null) => void;
  updateCheckoutDraft: (draft: Partial<CheckoutDraft>) => void;
  setPaymentFlow: (flow: PaymentFlowState) => void;
  clearCompletedCheckout: () => void;
  removeItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  getTotalPrice: () => string;
  getItemCount: () => number;
  resetCart: () => void;
};

const initialCartItems: CartItemType[] = [];

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: initialCartItems,
  attribution: null,
  activeCheckoutKey: null,
  checkoutDraft: { fulfilment: 'collection', phone: '', address: '', notes: '' },
  paymentFlow: null,
  addItem: (item: CartItemType) => {
    const activeShopId = get().items[0]?.shopId;
    if (activeShopId != null && activeShopId !== item.shopId) return 'merchant_conflict';
    const existingItem = get().items.find(i => i.id === item.id);
    if (existingItem) {
      set(state => ({
        items: state.items.map(i =>
          i.id === item.id
            ? {
                ...i,
                quantity: Math.min(i.quantity + item.quantity, i.maxQuantity),
              }
            : i
        ),
        activeCheckoutKey: null,
      }));
      return 'quantity_updated';
    } else {
      set(state => ({ items: [...state.items, item], activeCheckoutKey: null }));
      return 'added';
    }
  },
  replaceCart: (item) => set({ items: [item], attribution: null, activeCheckoutKey: null }),
  removeItem: (id: number) =>
    set(state => ({ items: state.items.filter(item => item.id !== id), activeCheckoutKey: null })),
  incrementItem: (id: number) =>
    set(state => {
      return {
        items: state.items.map(item =>
          item.id === id && item.quantity < item.maxQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        activeCheckoutKey: null,
      };
    }),
  setAttribution: (attribution) => set({ attribution, activeCheckoutKey: null }),
  setActiveCheckoutKey: (activeCheckoutKey) => set({ activeCheckoutKey }),
  updateCheckoutDraft: (draft) => set(state => ({ checkoutDraft: { ...state.checkoutDraft, ...draft } })),
  setPaymentFlow: (paymentFlow) => set({ paymentFlow }),
  clearCompletedCheckout: () => set({ items: initialCartItems, attribution: null, activeCheckoutKey: null, paymentFlow: null }),
  decrementItem: (id: number) =>
    set(state => ({
      items: state.items.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
      activeCheckoutKey: null,
    })),
  getTotalPrice: () => {
    const { items } = get();

    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  },
  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
  resetCart: () => set({ items: initialCartItems, attribution: null, activeCheckoutKey: null, paymentFlow: null }),
}), {
  name: 'muse-cart-v1',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: state => ({ items: state.items, attribution: state.attribution, activeCheckoutKey: state.activeCheckoutKey, checkoutDraft: state.checkoutDraft, paymentFlow: state.paymentFlow }),
}));
