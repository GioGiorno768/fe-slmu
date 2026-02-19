// src/services/linkSettingsService.ts
import apiClient from "./apiClient";

export interface LinkSettings {
  min_wait_seconds: number;
  expiry_seconds: number;
  mass_link_limit: number;
  guest_link_limit: number;
  guest_link_limit_days: number;
  modal_wait_seconds: number;
  modal_ad_clicks_required: number;
  modal_time_reduction_per_click: number;
}

export const getLinkSettings = async (): Promise<LinkSettings> => {
  try {
    // 🔧 Use public endpoint (not admin-only)
    const response = await apiClient.get("/settings/link");
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch link settings",
    );
  }
};

export const updateLinkSettings = async (
  data: LinkSettings,
): Promise<LinkSettings> => {
  try {
    const response = await apiClient.put("/admin/settings/link", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update link settings",
    );
  }
};
