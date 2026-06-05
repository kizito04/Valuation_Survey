// ============================================================
// useGeolocation — GPS capture hook
// ============================================================
import { useState, useCallback } from "react";
import type { GPSPosition } from "../types/survey";

interface GeolocationState {
  position: GPSPosition;
  error: string | null;
  isLocating: boolean;
}

const emptyPosition: GPSPosition = {
  latitude: null,
  longitude: null,
  accuracy: null,
  capturedAt: null,
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: emptyPosition,
    error: null,
    isLocating: false,
  });

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: "Geolocation is not supported by this browser.",
      }));
      return;
    }

    setState((s) => ({ ...s, isLocating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          isLocating: false,
          error: null,
          position: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            capturedAt: Date.now(),
          },
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          isLocating: false,
          error: `GPS error: ${err.message}`,
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const clearPosition = useCallback(() => {
    setState({ position: emptyPosition, error: null, isLocating: false });
  }, []);

  return { ...state, getPosition, clearPosition };
}
