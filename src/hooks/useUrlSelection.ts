import { useEffect, useRef } from 'react';
import { usePeriodicStore } from '../store/usePeriodicStore';

export function useUrlSelection() {
  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const setSelectedSymbols = usePeriodicStore((s) => s.setSelectedSymbols);
  const isInitialMount = useRef(true);

  // Read URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const elParam = params.get('el');
      if (elParam) {
        const rawSymbols = elParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        if (rawSymbols.length > 0) {
          setSelectedSymbols(rawSymbols);
        }
      }
    } catch {
      // Ignore URL parse errors
    }
  }, [setSelectedSymbols]);

  // Update URL on selection changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      const url = new URL(window.location.href);
      if (selectedSymbols.length > 0) {
        url.searchParams.set('el', selectedSymbols.join(','));
      } else {
        url.searchParams.delete('el');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history errors
    }
  }, [selectedSymbols]);
}
