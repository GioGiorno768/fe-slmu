// src/services/generalSettingsService.ts
import apiClient from "@/services/apiClient";

export interface GeneralSettings {
  maintenance_mode: boolean;
  maintenance_estimated_time: string;
  maintenance_whitelist_ips: string;
  disable_registration: boolean;
  invite_only_mode: boolean;
  disable_login: boolean;
  cleanup_expired_links_days: number;
  cleanup_blocked_links_days: number;
  cleanup_old_notifications_days: number;
  backdoor_access_code: string;
}

export interface CleanupResult {
  expired_links: number;
  blocked_links: number;
  old_notifications: number;
}

export interface ForceLogoutResult {
  users_logged_out: number;
}

export const generalSettingsService = {
  /**
   * Get general settings
   */
  getSettings: async (): Promise<GeneralSettings> => {
    const response = await apiClient.get("/super-admin/settings/general");
    return response.data.data;
  },

  /**
   * Update general settings
   */
  updateSettings: async (
    settings: GeneralSettings
  ): Promise<{ settings: GeneralSettings; users_logged_out?: number }> => {
    const response = await apiClient.put(
      "/super-admin/settings/general",
      settings
    );
    return response.data.data;
  },

  /**
   * Force logout all users
   */
  forceLogout: async (): Promise<ForceLogoutResult> => {
    const response = await apiClient.post("/super-admin/settings/force-logout");
    return response.data.data;
  },

  /**
   * Run data cleanup manually
   */
  runCleanup: async (): Promise<CleanupResult> => {
    const response = await apiClient.post("/super-admin/settings/cleanup");
    return response.data.data;
  },
};

export default generalSettingsService;
