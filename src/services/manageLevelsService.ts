// src/services/manageLevelsService.ts
// Admin service for managing user progression levels

import apiClient from "@/services/apiClient";

// Types matching backend response
export interface LevelConfig {
  id: string;
  no: number;
  name: string;
  icon: string;
  minEarnings: number;
  cpmBonus: number;
  benefits: string[];
  iconColor: string;
  bgColor: string;
  borderColor: string;
  // Feature locks
  unlockAdLevel3: boolean;
  unlockAdLevel4: boolean;
  unlockTopCountries: boolean;
  unlockTopReferrers: boolean;
  maxReferrals: number;
  monthlyWithdrawalLimit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LevelStats {
  totalLevels: number;
  maxCpmBonus: number;
  maxThreshold: number;
  totalBenefits: number;
  distribution: {
    id: string;
    name: string;
    usersCount: number;
  }[];
}

export interface CreateLevelData {
  name: string;
  icon: string;
  minEarnings: number;
  cpmBonus: number;
  benefits: string[];
  iconColor: string;
  bgColor: string;
  borderColor: string;
  // Feature locks
  unlockAdLevel3?: boolean;
  unlockAdLevel4?: boolean;
  unlockTopCountries?: boolean;
  unlockTopReferrers?: boolean;
  maxReferrals?: number;
  monthlyWithdrawalLimit?: number;
}

export type UpdateLevelData = Partial<CreateLevelData>;

// ============== API FUNCTIONS ==============

/**
 * Get all levels (ordered by minEarnings)
 */
export async function getLevels(): Promise<LevelConfig[]> {
  const response = await apiClient.get("/admin/levels");
  return response.data?.data || response.data || [];
}

/**
 * Get level statistics
 */
export async function getLevelStats(): Promise<LevelStats> {
  const response = await apiClient.get("/admin/levels/stats");
  return response.data?.data || response.data;
}

/**
 * Get single level by ID (slug)
 */
export async function getLevel(id: string): Promise<LevelConfig> {
  const response = await apiClient.get(`/admin/levels/${id}`);
  return response.data?.data || response.data;
}

/**
 * Create new level
 */
export async function createLevel(data: CreateLevelData): Promise<LevelConfig> {
  const response = await apiClient.post("/admin/levels", data);
  return response.data?.data || response.data;
}

/**
 * Update existing level
 */
export async function updateLevel(
  id: string,
  data: UpdateLevelData
): Promise<LevelConfig> {
  const response = await apiClient.put(`/admin/levels/${id}`, data);
  return response.data?.data || response.data;
}

/**
 * Delete level
 */
export async function deleteLevel(id: string): Promise<void> {
  await apiClient.delete(`/admin/levels/${id}`);
}
