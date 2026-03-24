import { useState, useCallback } from 'react';
import type { GeoLocation } from '../types';

interface GeoState {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
}

export function useGeo() {
  const [state, setState] = useState<GeoState>({
    location: null,
    loading: false,
    error: null,
  });

  const capture = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation not supported on this device.' }));
      return;
    }

    setState({ location: null, loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode approximation — in production use a real API
        const loc: GeoLocation = {
          lat: parseFloat(latitude.toFixed(6)),
          lng: parseFloat(longitude.toFixed(6)),
          address: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°W`,
          capturedAt: new Date().toISOString(),
        };
        setState({ location: loc, loading: false, error: null });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied.',
          2: 'Position unavailable.',
          3: 'Location request timed out.',
        };
        setState({
          location: null,
          loading: false,
          error: messages[err.code] ?? 'Unknown geolocation error.',
        });
      },
      { timeout: 10_000, enableHighAccuracy: true }
    );
  }, []);

  const clear = useCallback(() => {
    setState({ location: null, loading: false, error: null });
  }, []);

  return { ...state, capture, clear };
}
