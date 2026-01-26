
import { renderHook, waitFor, act } from '@testing-library/react-native';
import * as Network from 'expo-network';
import { useNetworkStatus } from '../use-network-status';

// Mock expo-network
jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(),
  addNetworkStateListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  NetworkStateType: {
    WIFI: 'WIFI',
    CELLULAR: 'CELLULAR',
    NONE: 'NONE',
    UNKNOWN: 'UNKNOWN',
  },
}));

describe('useNetworkStatus', () => {
  it('should return initial network state', async () => {
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: Network.NetworkStateType.WIFI,
    });

    const { result } = renderHook(() => useNetworkStatus());

    await waitFor(() => {
        expect(result.current).toEqual({
            isConnected: true,
            isInternetReachable: true,
            type: Network.NetworkStateType.WIFI,
        });
    });
  });

  it('should update state on network change', async () => {
    let listenerCallback: any;
    (Network.addNetworkStateListener as jest.Mock).mockImplementation((cb) => {
      listenerCallback = cb;
      return { remove: jest.fn() };
    });
    
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true, 
      type: Network.NetworkStateType.WIFI,
    });

    const { result } = renderHook(() => useNetworkStatus());
    
    await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
    });

    // Simulate Network Change
    act(() => {
      listenerCallback({
        isConnected: false,
        isInternetReachable: false,
        type: Network.NetworkStateType.NONE,
      });
    });

    await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
    });
  });
});
