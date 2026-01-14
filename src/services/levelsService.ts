// src/services/levelsService.ts
import apiClient from "@/services/apiClient";
import type { UserLevelProgress, LevelConfig, UserLevel } from "@/types/type";

// Feature locks type
export interface FeatureLocks {
  unlock_ad_level_3: boolean;
  unlock_ad_level_4: boolean;
  unlock_top_countries: boolean;
  unlock_top_referrers: boolean;
  max_referrals: number;
  monthly_withdrawal_limit: number;
}

// Unlock requirements - which level first unlocks each feature
export interface UnlockRequirements {
  ad_level_3: string | null;
  ad_level_4: string | null;
  top_countries: string | null;
  top_referrers: string | null;
}

// API Response types
interface LevelCardResponse {
  current_level: string;
  current_level_name: string;
  current_earnings: number;
  current_level_cpm: number;
  current_level_min: number;
  next_level_id: string | null;
  next_level_name: string | null;
  next_level_min: number;
  next_level_cpm: number;
  needed_to_next_level: number;
  progress_percent: number;
  feature_locks: FeatureLocks;
  unlock_requirements: UnlockRequirements;
}

interface LevelListResponse {
  id: string;
  name: string;
  icon: string;
  min_earnings: number;
  cpm_bonus: number;
  benefits: string[];
  icon_color: string;
  bg_color: string;
  border_color: string;
  locked: boolean;
}

interface LevelsApiResponse {
  card: LevelCardResponse;
  levels: LevelListResponse[];
}

// Extended UserLevelProgress with feature locks
export interface UserLevelProgressWithLocks extends UserLevelProgress {
  featureLocks: FeatureLocks;
  unlockRequirements: UnlockRequirements;
}

// Fetch user level progress (including feature locks)
export async function getUserLevelProgress(): Promise<UserLevelProgressWithLocks> {
  const response = await apiClient.get<{ data: LevelsApiResponse }>(
    "/user/levels"
  );
  const { card } = response.data.data;

  return {
    currentLevel: card.current_level as UserLevel,
    currentEarnings: card.current_earnings,
    nextLevelEarnings: card.next_level_min,
    progressPercent: card.progress_percent,
    featureLocks: card.feature_locks ?? {
      unlock_ad_level_3: false,
      unlock_ad_level_4: false,
      unlock_top_countries: false,
      unlock_top_referrers: false,
      max_referrals: 10,
      monthly_withdrawal_limit: 100,
    },
    unlockRequirements: card.unlock_requirements ?? {
      ad_level_3: null,
      ad_level_4: null,
      top_countries: null,
      top_referrers: null,
    },
  };
}

// Fetch levels configuration
export async function getLevelsConfig(): Promise<LevelConfig[]> {
  const response = await apiClient.get<{ data: LevelsApiResponse }>(
    "/user/levels"
  );
  const { levels } = response.data.data;

  return levels.map((level: LevelListResponse, index: number) => ({
    no: index + 1,
    id: level.id as UserLevel,
    name: level.name,
    icon: level.icon,
    minEarnings: level.min_earnings,
    cpmBonus: level.cpm_bonus,
    benefits: level.benefits,
    iconColor: level.icon_color,
    bgColor: level.bg_color,
    borderColor: level.border_color,
  }));
}

// ============== CRUD OPERATIONS (Admin) ==============

// Update level configuration
export async function updateLevelConfig(
  levelId: string,
  updates: Partial<LevelConfig>
): Promise<void> {
  await apiClient.put(`/admin/levels/${levelId}`, updates);
}

// Create new level
export async function createLevel(
  newLevel: Omit<LevelConfig, "no">
): Promise<LevelConfig> {
  const response = await apiClient.post<{ data: LevelConfig }>(
    "/admin/levels",
    newLevel
  );
  return response.data.data;
}

// Delete level
export async function deleteLevel(levelId: string): Promise<void> {
  await apiClient.delete(`/admin/levels/${levelId}`);
}
