// src/utils/currency.ts
// Currency conversion utility - Frontend only conversion
// Backend stores everything in USD, frontend converts for display
// Fetches rates from backend (admin-managed) with fallback to external API

export type CurrencyCode = string; // Dynamic currencies from backend

// Default supported currencies (fallback)
const DEFAULT_CURRENCY_CODES = ["USD", "IDR", "EUR", "GBP", "MYR", "SGD"];

// Fallback rates (used when API fails)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  IDR: 16000,
  EUR: 0.92,
  GBP: 0.79,
  MYR: 4.5,
  SGD: 1.35,
};

// Fallback currency info
const FALLBACK_CURRENCY_INFO: Record<
  string,
  { symbol: string; name: string; locale: string }
> = {
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY" },
  SGD: { symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
};

// Currency code to locale mapping
const LOCALE_MAP: Record<string, string> = {
  USD: "en-US",
  IDR: "id-ID",
  EUR: "de-DE",
  GBP: "en-GB",
  MYR: "ms-MY",
  SGD: "en-SG",
  AED: "ar-AE",
  ARS: "es-AR",
  AUD: "en-AU",
  BDT: "bn-BD",
  BRL: "pt-BR",
  CAD: "en-CA",
  CHF: "de-CH",
  CNY: "zh-CN",
  EGP: "ar-EG",
  HKD: "zh-HK",
  INR: "hi-IN",
  JPY: "ja-JP",
  KRW: "ko-KR",
  MXN: "es-MX",
  NGN: "en-NG",
  NZD: "en-NZ",
  PHP: "fil-PH",
  PKR: "ur-PK",
  PLN: "pl-PL",
  RUB: "ru-RU",
  SAR: "ar-SA",
  SEK: "sv-SE",
  THB: "th-TH",
  TRY: "tr-TR",
  TWD: "zh-TW",
  VND: "vi-VN",
  ZAR: "en-ZA",
};

// Cache storage keys
const RATES_CACHE_KEY = "exchange_rates_v2";
const RATES_TIMESTAMP_KEY = "exchange_rates_timestamp_v2";
const CACHE_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

interface CurrencyData {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  rate: number;
}

interface CachedData {
  currencies: CurrencyData[];
  rates: Record<string, number>;
  currencyInfo: Record<
    string,
    { symbol: string; name: string; locale: string }
  >;
}

// In-memory data
let currentRates: Record<string, number> = { ...FALLBACK_RATES };
let currencyInfo: Record<
  string,
  { symbol: string; name: string; locale: string }
> = { ...FALLBACK_CURRENCY_INFO };
let availableCurrencyCodes: string[] = [...DEFAULT_CURRENCY_CODES];

// For backwards compatibility
export const CURRENCY_INFO = new Proxy(
  {} as Record<string, { symbol: string; name: string; locale: string }>,
  {
    get(_, prop: string) {
      return (
        currencyInfo[prop] || { symbol: prop, name: prop, locale: "en-US" }
      );
    },
    ownKeys() {
      return availableCurrencyCodes;
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  },
);

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
      const data: CachedData = JSON.parse(cached);
      currentRates = { ...FALLBACK_RATES, ...data.rates };
      currencyInfo = { ...FALLBACK_CURRENCY_INFO, ...data.currencyInfo };
      availableCurrencyCodes = Object.keys(currentRates);
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
function saveCachedRates(data: CachedData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(RATES_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn("Failed to save rates cache:", error);
  }
}

/**
 * Fetch rates from backend API (admin-managed rates)
 */
async function fetchFromBackend(): Promise<CurrencyData[] | null> {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const response = await fetch(`${API_URL}/settings/currency-rates`);

    if (!response.ok) throw new Error("Backend API request failed");

    const result = await response.json();

    // Backend returns {status: "success", data: {...}} not {success: true}
    if (result.status === "success" && result.data?.currencies) {
      console.log(
        "✅ Backend currencies loaded:",
        result.data.currencies.length,
      );
      return result.data.currencies;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.warn("Failed to fetch from backend:", error);
    return null;
  }
}

/**
 * Fetch rates from external API (fallback)
 */
async function fetchFromExternalAPI(): Promise<Record<string, number> | null> {
  try {
    // Frankfurter API for major currencies
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,MYR,SGD",
    );

    if (!response.ok) throw new Error("External API request failed");

    const data = await response.json();

    const rates: Record<string, number> = {
      USD: 1,
      EUR: data.rates.EUR || FALLBACK_RATES.EUR,
      GBP: data.rates.GBP || FALLBACK_RATES.GBP,
      MYR: data.rates.MYR || FALLBACK_RATES.MYR,
      SGD: data.rates.SGD || FALLBACK_RATES.SGD,
    };

    // Try to get IDR from another API
    try {
      const idrResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD",
      );
      if (idrResponse.ok) {
        const idrData = await idrResponse.json();
        if (idrData.rates?.IDR) {
          rates.IDR = idrData.rates.IDR;
        }
      }
    } catch {
      rates.IDR = FALLBACK_RATES.IDR;
    }

    return rates;
  } catch (error) {
    console.warn("Failed to fetch from external API:", error);
    return null;
  }
}

/**
 * Fetch exchange rates - ALWAYS tries backend first (admin-managed rates)
 * Cache is only used when backend fails
 */
export async function fetchExchangeRates(): Promise<boolean> {
  // ALWAYS try backend first (admin-managed rates take priority)
  console.log("� Fetching exchange rates from backend...");
  const backendData = await fetchFromBackend();

  if (backendData && backendData.length > 0) {
    // Build rates and info from backend data
    const newRates: Record<string, number> = {};
    const newInfo: Record<
      string,
      { symbol: string; name: string; locale: string }
    > = {};

    backendData.forEach((currency) => {
      newRates[currency.code] = currency.rate;
      newInfo[currency.code] = {
        symbol: currency.symbol,
        name: currency.name,
        locale: LOCALE_MAP[currency.code] || "en-US",
      };
    });

    currentRates = newRates;
    currencyInfo = newInfo;
    availableCurrencyCodes = Object.keys(newRates);

    saveCachedRates({
      currencies: backendData,
      rates: newRates,
      currencyInfo: newInfo,
    });

    console.log("✅ Exchange rates loaded from backend:", currentRates);
    return true;
  }

  // Backend failed - try cache as fallback
  console.warn("⚠️ Backend failed, trying cache...");
  if (loadCachedRates()) {
    console.log("📊 Using cached exchange rates as fallback");
    return true;
  }

  // Cache also failed - try external API as last resort
  console.warn("⚠️ Cache empty, trying external API...");
  const externalRates = await fetchFromExternalAPI();

  if (externalRates) {
    currentRates = { ...FALLBACK_RATES, ...externalRates };
    currencyInfo = { ...FALLBACK_CURRENCY_INFO };
    availableCurrencyCodes = Object.keys(currentRates);

    saveCachedRates({
      currencies: [],
      rates: currentRates,
      currencyInfo,
    });

    console.log("✅ Exchange rates loaded from external API:", currentRates);
    return true;
  }

  // Everything failed - use hardcoded fallback
  console.warn("⚠️ All sources failed, using hardcoded fallback rates");
  currentRates = { ...FALLBACK_RATES };
  currencyInfo = { ...FALLBACK_CURRENCY_INFO };
  availableCurrencyCodes = [...DEFAULT_CURRENCY_CODES];
  return false;
}

/**
 * Get current exchange rates (from cache or memory)
 */
export function getExchangeRates(): Record<string, number> {
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
export function convertFromUSD(amountUSD: number, toCurrency: string): number {
  const rates = getExchangeRates();
  return amountUSD * (rates[toCurrency] || 1);
}

/**
 * Get currency info safely
 */
function getCurrencyInfo(currency: string): {
  symbol: string;
  name: string;
  locale: string;
} {
  return (
    currencyInfo[currency] || {
      symbol: currency,
      name: currency,
      locale: "en-US",
    }
  );
}

/**
 * Format amount in specified currency with proper locale formatting
 * Default: 5 decimals for micro-transactions (CPC/CPM)
 */
export function formatCurrency(
  amountUSD: number,
  currency: string = "USD",
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number },
): string {
  const converted = convertFromUSD(amountUSD, currency);
  const info = getCurrencyInfo(currency);

  // For currencies like IDR, VND, KRW - no decimals
  const noDecimalCurrencies = ["IDR", "VND", "KRW", "JPY"];
  const fractionDigits = noDecimalCurrencies.includes(currency)
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 5, maximumFractionDigits: 5 };

  return new Intl.NumberFormat(info.locale, {
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
  currency: string = "USD",
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
  currency: string = "USD",
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
export function getCurrencySymbol(currency: string): string {
  return getCurrencyInfo(currency).symbol;
}

/**
 * Get all available currencies for dropdown
 */
export function getAvailableCurrencies(): {
  code: string;
  name: string;
  symbol: string;
}[] {
  return availableCurrencyCodes.map((code) => {
    const info = getCurrencyInfo(code);
    return {
      code,
      name: info.name,
      symbol: info.symbol,
    };
  });
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
