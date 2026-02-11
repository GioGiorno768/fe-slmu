// src/services/backupService.ts
import apiClient from "./apiClient";

export interface BackupType {
  type: string;
  label: string;
  description: string;
  group: "critical" | "important";
}

export interface BackupStats {
  period: string;
  counts: Record<string, number>;
}

export const getBackupTypes = async (): Promise<BackupType[]> => {
  const response = await apiClient.get("/super-admin/backup/types");
  return response.data.data;
};

export const getBackupStats = async (
  period: string = "all",
): Promise<BackupStats> => {
  const response = await apiClient.get("/super-admin/backup/stats", {
    params: { period },
  });
  return response.data.data;
};

export const generateBackup = async (
  types: string[],
  period: string,
): Promise<Blob> => {
  const response = await apiClient.post(
    "/super-admin/backup/generate",
    { types, period },
    { responseType: "blob" },
  );
  return response.data;
};
