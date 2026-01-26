
import * as Network from 'expo-network';
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [status, setStatus] = useState<Network.NetworkState>({
    isConnected: true,
    isInternetReachable: true,
    type: Network.NetworkStateType.UNKNOWN,
  });

  useEffect(() => {
    Network.getNetworkStateAsync().then(setStatus);

    const subscription = Network.addNetworkStateListener((newState) => {
      setStatus(newState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return status;
}
