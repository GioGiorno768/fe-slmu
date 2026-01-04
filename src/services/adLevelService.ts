// Service for managing ad levels (Super Admin)
// Uses real API endpoints

import apiClient from "./apiClient";

export interface AdLevelConfig {
  id: string;
  levelNumber: number;
  name: string;
  description: string;
  revenueShare: number; // percentage
  cpcRate: number; // cost per click in dollars
  colorTheme: "green" | "blue" | "orange" | "red";
  isPopular: boolean;
  isEnabled: boolean; // Can be disabled instead of deleted
  isDefault?: boolean;
  isRecommended?: boolean;
  demoUrl: string;
  features: AdFeature[]; // Legacy features (for backward compatibility)
  enabledFeatures?: string[]; // IDs of global features enabled for this level
  featureValues?: Record<string, string>; // Per-level custom descriptions
  createdAt: Date;
  updatedAt: Date;
}

export interface AdFeature {
  id: string;
  label: string;
  included: boolean;
  value?: string | boolean;
}

// Country-specific CPC rate (now managed in CPC Rates settings tab)
export interface CountryRate {
  countryCode: string;
  countryName: string;
  // CPC rates per level
  level1Rate: number;
  level2Rate: number;
  level3Rate: number;
  level4Rate: number;
}

// ============== AD LEVELS API ==============

// Get all ad levels
export const getAdLevels = async (): Promise<AdLevelConfig[]> => {
  try {
    const response = await apiClient.get("/admin/ad-levels");
    const data = response.data?.data || response.data || [];

    // Map API response to frontend interface
    return data.map((level: Record<string, unknown>) => ({
      id: String(level.id),
      levelNumber: (level.levelNumber || level.display_order || 0) as number,
      name: (level.name || "") as string,
      description: (level.description || "") as string,
      revenueShare: (level.revenueShare || level.revenue_share || 0) as number,
      cpcRate: (level.cpcRate || level.cpm_rate || 0) as number,
      colorTheme: (level.colorTheme || level.color_theme || "blue") as
        | "green"
        | "blue"
        | "orange"
        | "red",
      isPopular: Boolean(level.isPopular || level.is_popular),
      isEnabled:
        level.isEnabled !== undefined ? Boolean(level.isEnabled) : true,
      isDefault: Boolean(level.isDefault || level.is_default),
      isRecommended: Boolean(level.isRecommended || level.is_recommended),
      demoUrl: (level.demoUrl || level.demo_url || "") as string,
      features: (level.features || []) as AdFeature[],
      enabledFeatures: (level.enabledFeatures ||
        level.enabled_features ||
        []) as string[],
      featureValues: (level.featureValues ||
        level.feature_values ||
        {}) as Record<string, string>,
      createdAt: new Date(
        String(level.createdAt || level.created_at || new Date())
      ),
      updatedAt: new Date(
        String(level.updatedAt || level.updated_at || new Date())
      ),
    }));
  } catch (error) {
    console.error("Failed to fetch ad levels:", error);
    throw error;
  }
};

// Update existing ad level
export const updateAdLevel = async (
  id: string,
  data: Partial<Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">>
): Promise<AdLevelConfig> => {
  try {
    const response = await apiClient.put(`/admin/ad-levels/${id}`, data);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to update ad level:", error);
    throw error;
  }
};

// Toggle enable/disable for a level
export const toggleAdLevelEnabled = async (
  id: string
): Promise<{ id: string; name: string; isEnabled: boolean }> => {
  try {
    const response = await apiClient.patch(`/admin/ad-levels/${id}/toggle`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to toggle ad level:", error);
    throw error;
  }
};

// Set level as default
export const setAdLevelDefault = async (
  id: string
): Promise<{ id: string; name: string; isDefault: boolean }> => {
  try {
    const response = await apiClient.post(`/admin/ad-levels/${id}/set-default`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to set default level:", error);
    throw error;
  }
};

// Set level as recommended
export const setAdLevelRecommended = async (
  id: string
): Promise<{ id: string; name: string; isRecommended: boolean }> => {
  try {
    const response = await apiClient.post(
      `/admin/ad-levels/${id}/set-recommended`
    );
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to set recommended level:", error);
    throw error;
  }
};

// Utility: Convert CPC to CPM
export const calculateCPM = (cpc: number): number => {
  return cpc * 1000;
};

// Utility: Format CPM for display
export const formatCPM = (cpc: number): string => {
  const cpm = calculateCPM(cpc);
  return `$${cpm.toFixed(2)}`;
};

// ============== GLOBAL FEATURES API ==============

export interface GlobalFeature {
  id: string;
  name: string;
  description?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Get all global features
export const getGlobalFeatures = async (): Promise<GlobalFeature[]> => {
  try {
    const response = await apiClient.get("/admin/global-features");
    const data = response.data?.data || response.data || [];

    return data.map((feature: Record<string, unknown>) => ({
      id: String(feature.id),
      name: feature.name || "",
      description: feature.description || "",
      displayOrder: feature.display_order || feature.displayOrder || 0,
      createdAt: feature.created_at || feature.createdAt,
      updatedAt: feature.updated_at || feature.updatedAt,
    }));
  } catch (error) {
    console.error("Failed to fetch global features:", error);
    throw error;
  }
};

// Create global feature
export const createGlobalFeature = async (
  data: Omit<GlobalFeature, "id" | "createdAt" | "updatedAt">
): Promise<GlobalFeature> => {
  try {
    const response = await apiClient.post("/admin/global-features", data);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to create global feature:", error);
    throw error;
  }
};

// Update global feature
export const updateGlobalFeature = async (
  id: string,
  data: Partial<Omit<GlobalFeature, "id" | "createdAt" | "updatedAt">>
): Promise<GlobalFeature> => {
  try {
    const response = await apiClient.put(`/admin/global-features/${id}`, data);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to update global feature:", error);
    throw error;
  }
};

// Delete global feature
export const deleteGlobalFeature = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/global-features/${id}`);
  } catch (error) {
    console.error("Failed to delete global feature:", error);
    throw error;
  }
};

// ============== CPC RATES API ==============

export interface CpcRatesData {
  defaultRates: {
    level_1: number;
    level_2: number;
    level_3: number;
    level_4: number;
  };
  countryRates: Array<{
    id?: number;
    country: string;
    countryName?: string;
    rates: {
      level_1: number;
      level_2: number;
      level_3: number;
      level_4: number;
    };
  }>;
}

// Get all CPC rates
export const getCpcRates = async (): Promise<CpcRatesData> => {
  try {
    const response = await apiClient.get("/admin/cpc-rates");
    const data = response.data?.data || response.data;

    return {
      defaultRates: data.default_rates ||
        data.defaultRates || {
          level_1: 0.05,
          level_2: 0.07,
          level_3: 0.1,
          level_4: 0.15,
        },
      countryRates: data.country_rates || data.countryRates || [],
    };
  } catch (error) {
    console.error("Failed to fetch CPC rates:", error);
    throw error;
  }
};

// Save all CPC rates
export const saveCpcRates = async (data: CpcRatesData): Promise<void> => {
  try {
    await apiClient.post("/admin/cpc-rates", {
      default_rates: data.defaultRates,
      country_rates: data.countryRates.map((cr) => ({
        country: cr.country,
        rates: cr.rates,
      })),
    });
  } catch (error) {
    console.error("Failed to save CPC rates:", error);
    throw error;
  }
};

// Add country-specific rate
export const addCountryRate = async (
  country: string,
  rates: { level_1: number; level_2: number; level_3: number; level_4: number }
): Promise<void> => {
  try {
    await apiClient.post("/admin/cpc-rates/country", { country, rates });
  } catch (error) {
    console.error("Failed to add country rate:", error);
    throw error;
  }
};

// Remove country-specific rate
export const removeCountryRate = async (country: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/cpc-rates/country/${country}`);
  } catch (error) {
    console.error("Failed to remove country rate:", error);
    throw error;
  }
};
