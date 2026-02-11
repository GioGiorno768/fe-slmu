// src/services/visitorCooldownService.ts
import apiClient from "./apiClient";

export interface VisitorCooldownSettings {
  enabled: boolean;
  max_links_per_user: number;
  cooldown_hours: number;
}

export const getVisitorCooldownSettings =
  async (): Promise<VisitorCooldownSettings> => {
    try {
      const response = await apiClient.get("/admin/settings/visitor-cooldown");
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch visitor cooldown settings",
      );
    }
  };

export const updateVisitorCooldownSettings = async (
  data: VisitorCooldownSettings,
): Promise<VisitorCooldownSettings> => {
  try {
    const response = await apiClient.put(
      "/admin/settings/visitor-cooldown",
      data,
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to update visitor cooldown settings",
    );
  }
};
