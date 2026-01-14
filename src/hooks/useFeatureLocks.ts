// src/hooks/useFeatureLocks.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import * as levelsService from "@/services/levelsService";
import type {
  FeatureLocks,
  UnlockRequirements,
} from "@/services/levelsService";

// Query keys
export const featureLocksKeys = {
  all: ["featureLocks"] as const,
  user: () => [...featureLocksKeys.all, "user"] as const,
};

// Default feature locks (most restrictive)
const DEFAULT_LOCKS: FeatureLocks = {
  unlock_ad_level_3: false,
  unlock_ad_level_4: false,
  unlock_top_countries: false,
  unlock_top_referrers: false,
  max_referrals: 10,
  monthly_withdrawal_limit: 100,
};

// Default unlock requirements
const DEFAULT_REQUIREMENTS: UnlockRequirements = {
  ad_level_3: null,
  ad_level_4: null,
  top_countries: null,
  top_referrers: null,
};

/**
 * Hook to get user's feature lock settings based on their current level
 * Returns unlock status for various features
 */
export function useFeatureLocks() {
  const { data, isLoading, error } = useQuery({
    queryKey: featureLocksKeys.user(),
    queryFn: levelsService.getUserLevelProgress,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const featureLocks = data?.featureLocks ?? DEFAULT_LOCKS;
  const unlockRequirements = data?.unlockRequirements ?? DEFAULT_REQUIREMENTS;

  return {
    // Raw feature locks
    featureLocks,
    unlockRequirements,
    isLoading,
    error: error ? "Failed to load feature locks" : null,

    // Convenience helpers
    canUseAdLevel3: featureLocks.unlock_ad_level_3,
    canUseAdLevel4: featureLocks.unlock_ad_level_4,
    canViewTopCountries: featureLocks.unlock_top_countries,
    canViewTopReferrers: featureLocks.unlock_top_referrers,
    maxReferrals: featureLocks.max_referrals,
    monthlyWithdrawalLimit: featureLocks.monthly_withdrawal_limit,

    // Level names for unlock requirements
    levelForAdLevel3: unlockRequirements.ad_level_3,
    levelForAdLevel4: unlockRequirements.ad_level_4,
    levelForTopCountries: unlockRequirements.top_countries,
    levelForTopReferrers: unlockRequirements.top_referrers,

    // Check if a specific ad level is unlocked (1-indexed)
    isAdLevelUnlocked: (adLevel: number): boolean => {
      if (adLevel <= 2) return true; // Level 1 & 2 always unlocked
      if (adLevel === 3) return featureLocks.unlock_ad_level_3;
      if (adLevel === 4) return featureLocks.unlock_ad_level_4;
      return false;
    },

    // Get required level name for an ad level (1-indexed)
    getRequiredLevelForAd: (adLevel: number): string | null => {
      if (adLevel === 3) return unlockRequirements.ad_level_3;
      if (adLevel === 4) return unlockRequirements.ad_level_4;
      return null;
    },
  };
}
