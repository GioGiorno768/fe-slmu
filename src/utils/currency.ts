// src/utils/currency.ts
// Currency conversion utility - Frontend only conversion
// Backend stores everything in USD, frontend converts for display
// Uses Frankfurter API for real-time rates with 5-hour cache

export type CurrencyCode = "USD" | "IDR" | "EUR" | "GBP" | "MYR" | "SGD";

// Fallback rates (used when API fails)
const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  IDR: 15800,
  EUR: 0.92,
  GBP: 0.79,
  MYR: 4.47,
  SGD: 1.34,
};

// Cache storage keys
const RATES_CACHE_KEY = "exchange_rates";
const RATES_TIMESTAMP_KEY = "exchange_rates_timestamp";
const CACHE_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

// In-memory rates (updated from cache or API)
let currentRates: Record<CurrencyCode, number> = { ...FALLBACK_RATES };

export const CURRENCY_INFO: Record<
  CurrencyCode,
  { symbol: string; name: string; locale: string }
> = {
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY" },
  SGD: { symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
};

/**
 * Check if cached rates are still valid
 */
function isCacheValid(): boolean {
  if (typeof window === "undefined") return false;

  const timestamp = localStorage.getItem(RATES_TIMESTAMP_KEY);
  if (!timestamp) return false;

  const elapsed = Date.now() - parseInt(timestamp, 10);
  return elapsed < CACHE_DURATION_MS;
}

/**
 * Load rates from localStorage cache
 */
function loadCachedRates(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached && isCacheValid()) {
      const rates = JSON.parse(cached);
      currentRates = { ...FALLBACK_RATES, ...rates };
      return true;
    }
  } catch (error) {
    console.warn("Failed to load cached rates:", error);
  }
  return false;
}

/**
 * Save rates to localStorage cache
 */
function saveCachedRates(rates: Record<string, number>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(RATES_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn("Failed to save rates cache:", error);
  }
}

/**
 * Fetch fresh rates from Frankfurter API
 * API returns rates relative to base currency (USD)
 */
export async function fetchExchangeRates(): Promise<boolean> {
  // First try to load from cache
  if (loadCachedRates()) {
    console.log("📊 Using cached exchange rates");
    return true;
  }

  try {
    // Frankfurter API - free, no API key required
    // Note: Frankfurter doesn't support IDR directly, so we'll use a different approach
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,MYR,SGD"
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    // Update rates from API
    const newRates: Record<CurrencyCode, number> = {
      USD: 1,
      EUR: data.rates.EUR || FALLBACK_RATES.EUR,
      GBP: data.rates.GBP || FALLBACK_RATES.GBP,
      MYR: data.rates.MYR || FALLBACK_RATES.MYR,
      SGD: data.rates.SGD || FALLBACK_RATES.SGD,
      // IDR not available in Frankfurter, fetch separately or use fallback
      IDR: FALLBACK_RATES.IDR, // Will update below
    };

    // Try to get IDR rate from another free API
    try {
      const idrResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      if (idrResponse.ok) {
        const idrData = await idrResponse.json();
        if (idrData.rates?.IDR) {
          newRates.IDR = idrData.rates.IDR;
        }
      }
    } catch {
      // Use fallback for IDR if secondary API fails
      console.warn("Failed to fetch IDR rate, using fallback");
    }

    currentRates = newRates;
    saveCachedRates(newRates);

    console.log("✅ Exchange rates updated:", currentRates);
    return true;
  } catch (error) {
    console.warn("Failed to fetch exchange rates, using fallback:", error);
    return false;
  }
}

/**
 * Get current exchange rates (from cache or memory)
 */
export function getExchangeRates(): Record<CurrencyCode, number> {
  // Try to load from cache on first access
  if (typeof window !== "undefined" && !loadCachedRates()) {
    // If no valid cache, trigger background fetch
    fetchExchangeRates();
  }
  return currentRates;
}

/**
 * Convert USD amount to target currency
 */
export function convertFromUSD(
  amountUSD: number,
  toCurrency: CurrencyCode
): number {
  const rates = getExchangeRates();
  return amountUSD * rates[toCurrency];
}

/**
 * Format amount in specified currency with proper locale formatting
 * Default: 5 decimals for micro-transactions (CPC/CPM)
 */
export function formatCurrency(
  amountUSD: number,
  currency: CurrencyCode = "USD",
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  const converted = convertFromUSD(amountUSD, currency);
  const { locale } = CURRENCY_INFO[currency];

  // For IDR, we typically don't show decimals
  // For other currencies, default to 5 decimals for micro-transactions
  const fractionDigits =
    currency === "IDR"
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : { minimumFractionDigits: 5, maximumFractionDigits: 5 };

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    ...fractionDigits,
    ...options,
  }).format(converted);
}

/**
 * Format currency with 2 decimals (for display like balance, totals)
 */
export function formatCurrencySimple(
  amountUSD: number,
  currency: CurrencyCode = "USD"
): string {
  return formatCurrency(amountUSD, currency, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format micro amounts (CPC/CPM) - always 5 decimals
 */
export function formatMicroCurrency(
  amountUSD: number,
  currency: CurrencyCode = "USD"
): string {
  return formatCurrency(amountUSD, currency, {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  });
}

/**
 * Format USD amount directly without conversion
 * Use for displaying raw USD values
 */
export function formatUSD(amount: number, decimals: number = 5): string {
  return `$${amount.toFixed(decimals)}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_INFO[currency].symbol;
}

/**
 * Get all available currencies for dropdown
 */
export function getAvailableCurrencies(): {
  code: CurrencyCode;
  name: string;
  symbol: string;
}[] {
  return Object.entries(CURRENCY_INFO).map(([code, info]) => ({
    code: code as CurrencyCode,
    name: info.name,
    symbol: info.symbol,
  }));
}

/**
 * Get last update time for rates
 */
export function getRatesLastUpdate(): Date | null {
  if (typeof window === "undefined") return null;

  const timestamp = localStorage.getItem(RATES_TIMESTAMP_KEY);
  if (!timestamp) return null;

  return new Date(parseInt(timestamp, 10));
}

/**
 * Force refresh rates (bypass cache)
 */
export async function forceRefreshRates(): Promise<boolean> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RATES_CACHE_KEY);
    localStorage.removeItem(RATES_TIMESTAMP_KEY);
  }
  return fetchExchangeRates();
}
