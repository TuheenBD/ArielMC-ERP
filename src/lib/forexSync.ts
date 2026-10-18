import { CurrencyRate } from '@/types/erp';
import { INITIAL_CURRENCIES } from '@/data/initialData';

export interface BangladeshBankForexMeta {
  interbankMidRateBdt: number;
  adBuyingRateBdt: number;
  adSellingRateBdt: number;
  spreadPct: number;
  erqRetentionQuotaPct: number;
  regulatoryCircular: string;
  crossRates: {
    GBP_BDT: number;
    EUR_BDT: number;
    AUD_BDT: number;
    GBP_USD: number;
    EUR_USD: number;
  };
}

export interface ForexSyncPayload {
  success: boolean;
  base: string;
  source: string;
  provider: string;
  timestamp: string;
  lastUpdatedUtc: string;
  isLive: boolean;
  rates: {
    USD: number;
    BDT: number;
    GBP: number;
    EUR: number;
    AUD: number;
    [key: string]: number;
  };
  bangladeshBank: BangladeshBankForexMeta;
}

const STORAGE_RATES_KEY = 'arielmc_erp_exchange_rates_v1';
const STORAGE_META_KEY = 'arielmc_erp_forex_meta_v1';

/**
 * Get initial cached currencies or fallback to initial data
 */
export function getCachedCurrencies(): CurrencyRate[] {
  if (typeof window === 'undefined') return INITIAL_CURRENCIES;
  try {
    const raw = localStorage.getItem(STORAGE_RATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse cached currencies:', err);
  }
  return INITIAL_CURRENCIES;
}

/**
 * Get cached forex metadata
 */
export function getCachedForexMeta(): ForexSyncPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_META_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse cached forex meta:', err);
  }
  return null;
}

/**
 * Fetch live exchange rates from the API, merge into CurrencyRate[], and persist
 */
export async function syncLiveExchangeRates(
  currentCurrencies: CurrencyRate[] = INITIAL_CURRENCIES
): Promise<{
  currencies: CurrencyRate[];
  meta: ForexSyncPayload;
}> {
  try {
    const res = await fetch('/api/forex', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Forex API responded with ${res.status}`);
    }

    const payload: ForexSyncPayload = await res.json();

    // Map new rates into existing CurrencyRate array
    const updatedCurrencies = currentCurrencies.map((c) => {
      const code = c.code.toUpperCase();
      if (code in payload.rates) {
        return {
          ...c,
          rateToUsd: payload.rates[code],
        };
      }
      return c;
    });

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_RATES_KEY, JSON.stringify(updatedCurrencies));
        localStorage.setItem(STORAGE_META_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('Could not persist rates to localStorage:', err);
      }
    }

    return {
      currencies: updatedCurrencies,
      meta: payload,
    };
  } catch (error) {
    console.warn('Error fetching live forex sync, falling back to local cache/baseline:', error);
    const cached = getCachedCurrencies();
    const cachedMeta = getCachedForexMeta() || {
      success: true,
      base: 'USD',
      source: 'Bangladesh Bank Interbank Baseline (Cached)',
      provider: 'Bangladesh Bank Reference Table',
      timestamp: new Date().toISOString(),
      lastUpdatedUtc: new Date().toISOString(),
      isLive: false,
      rates: {
        USD: 1.0,
        BDT: 123.08,
        GBP: 0.751,
        EUR: 0.890,
        AUD: 1.440,
      },
      bangladeshBank: {
        interbankMidRateBdt: 123.08,
        adBuyingRateBdt: 122.47,
        adSellingRateBdt: 123.70,
        spreadPct: 0.5,
        erqRetentionQuotaPct: 50.0,
        regulatoryCircular: 'FE Circular No. 48 & 31 (ERQ 50% & AD Authorized Dealer Framework)',
        crossRates: {
          GBP_BDT: 163.90,
          EUR_BDT: 138.30,
          AUD_BDT: 85.50,
          GBP_USD: 1.3315,
          EUR_USD: 1.1235,
        },
      },
    };

    return {
      currencies: cached,
      meta: cachedMeta,
    };
  }
}
