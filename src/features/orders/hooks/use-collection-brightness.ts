import { useEffect } from 'react';
import * as Brightness from 'expo-brightness';

export function useCollectionBrightness(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let previous: number | undefined;
    void Brightness.getBrightnessAsync()
      .then((value) => {
        previous = value;
        return Brightness.setBrightnessAsync(1);
      })
      .catch(() => undefined);

    return () => {
      if (previous != null) {
        void Brightness.setBrightnessAsync(previous).catch(() => undefined);
      }
    };
  }, [enabled]);
}
