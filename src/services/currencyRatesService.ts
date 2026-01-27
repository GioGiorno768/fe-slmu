// src/services/currencyRatesService.ts
import apiClient from "@/services/apiClient";

export interface CurrencyItem {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  rate: number;
}

export interface CurrencyRatesData {
  currencies: CurrencyItem[];
  last_updated: string;
}

export interface CurrencyRatesResponse {
  status: string; // "success" or "error"
  data: CurrencyRatesData;
  message: string;
}

/**
 * Currency Rates Service
 * Handles CRUD operations for manual currency exchange rates
 */
const currencyRatesService = {
  /**
   * Get all currency rates (public endpoint)
   */
  async getRates(): Promise<CurrencyRatesData> {
    const response = await apiClient.get<CurrencyRatesResponse>(
      "/settings/currency-rates",
    );
    return response.data.data;
  },

  /**
   * Update currency rates (admin only)
   */
  async updateRates(currencies: CurrencyItem[]): Promise<CurrencyRatesData> {
    const response = await apiClient.put<CurrencyRatesResponse>(
      "/admin/settings/currency-rates",
      {
        currencies,
      },
    );
    return response.data.data;
  },
};

export default currencyRatesService;
