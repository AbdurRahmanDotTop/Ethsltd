import { useState, useEffect } from 'react';
import { apiClient } from '@ethsltd/api-client';

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  ratePerUsdt: string;
  decimalPrecision: number;
  isAsset: boolean;
  isBank: boolean;
}

// Global cache to prevent multiple fetches
let globalRatesCache: CurrencyRate[] | null = null;
let fetchPromise: Promise<any> | null = null;

export function useCurrencies() {
  const [rates, setRates] = useState<CurrencyRate[]>(globalRatesCache || []);
  const [isLoading, setIsLoading] = useState(!globalRatesCache);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      if (globalRatesCache) {
        if (isMounted) {
          setRates(globalRatesCache);
          setIsLoading(false);
        }
        return;
      }

      if (!fetchPromise) {
        fetchPromise = apiClient.getPublicCurrencyRates();
      }

      try {
        const res = await fetchPromise;
        if (res.success && res.list) {
          globalRatesCache = res.list;
          if (isMounted) {
            setRates(res.list);
          }
        }
      } catch (e) {
        console.error('Failed to fetch currencies', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const assets = rates.filter(r => r.isAsset);
  const fiats = rates.filter(r => r.isBank);

  return { rates, assets, fiats, isLoading };
}
