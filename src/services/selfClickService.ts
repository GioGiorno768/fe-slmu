// src/services/selfClickService.ts
import apiClient from "./apiClient";

export interface SelfClickSettings {
  enabled: boolean;
  cpc_percentage: number;
  daily_limit: number;
}

export const getSelfClickSettings = async (): Promise<SelfClickSettings> => {
  try {
    const response = await apiClient.get("/admin/settings/self-click");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch self-click settings"
    );
  }
};

export const updateSelfClickSettings = async (
  data: SelfClickSettings
): Promise<SelfClickSettings> => {
  try {
    const response = await apiClient.put("/admin/settings/self-click", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update self-click settings"
    );
  }
};
