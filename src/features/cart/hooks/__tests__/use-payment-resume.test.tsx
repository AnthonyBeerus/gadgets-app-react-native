import { renderHook } from '@testing-library/react-native';

import { usePaymentResume } from '../use-payment-resume';
import { useCartStore } from '../../../../store/cart-store';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }));

describe('usePaymentResume', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    useCartStore.setState({ paymentFlow: null });
  });

  it('does nothing when no payment is in flight', () => {
    renderHook(() => usePaymentResume());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it.each(['requires_payment', 'processing'] as const)('resumes the processing panel when status is %s', status => {
    useCartStore.setState({ paymentFlow: { orderId: 42, status } });
    renderHook(() => usePaymentResume());
    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/payment-processing', params: { orderId: '42' } });
  });

  it.each(['succeeded', 'failed', 'cancelled'] as const)('leaves a settled %s flow alone', status => {
    useCartStore.setState({ paymentFlow: { orderId: 42, status } });
    renderHook(() => usePaymentResume());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('resumes only once per mount', () => {
    useCartStore.setState({ paymentFlow: { orderId: 7, status: 'processing' } });
    const { rerender } = renderHook(() => usePaymentResume());
    rerender({});
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });
});
