// src/hooks/useDashboard.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as dashboardService from "@/services/dashboardService";
import { SLIDE_CONFIGS } from "@/services/dashboardService";
import type {
  MilestoneData,
  ReferralCardData,
  TopTrafficStats,
  TopPerformingLink,
  AnalyticsData,
  TimeRange,
  StatType,
  CountryStat,
  DashboardSlide,
} from "@/types/type";
import { getTopCountries } from "@/services/analyticsService";

// Query keys for cache management
export const dashboardKeys = {
  all: ["dashboard"] as const,
  milestone: () => [...dashboardKeys.all, "milestone"] as const,
  referral: () => [...dashboardKeys.all, "referral"] as const,
  traffic: () => [...dashboardKeys.all, "traffic"] as const,
  topLinks: () => [...dashboardKeys.all, "topLinks"] as const,
  topCountries: () => [...dashboardKeys.all, "topCountries"] as const,
  analytics: (range: TimeRange, stat: StatType) =>
    [...dashboardKeys.all, "analytics", range, stat] as const,
};

export function useDashboard(username?: string) {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard");

  // Analytics Filter State (still need local state for filters)
  const [analyticsRange, setAnalyticsRange] = useState<TimeRange>("perWeek");
  const [analyticsStat, setAnalyticsStat] = useState<StatType>("totalViews");

  // 1. Slides - Create personalized slides with translations
  const slides: DashboardSlide[] = useMemo(() => {
    return SLIDE_CONFIGS.map((config) => {
      // Get translated content for this slide
      let title = t(`slides.${config.id}.title`);

      // For welcome slide, use titleWithName if username is available
      if (config.id === "welcome" && username) {
        title = t(`slides.${config.id}.titleWithName`, { name: username });
      }

      return {
        id: config.id,
        title,
        desc: t(`slides.${config.id}.desc`),
        cta: t(`slides.${config.id}.cta`),
        link: config.link,
        icon: config.icon,
        theme: config.theme,
      };
    });
  }, [t, username]);

  // 2. Milestone Query
  const { data: milestone } = useQuery({
    queryKey: dashboardKeys.milestone(),
    queryFn: dashboardService.getMilestone,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // 3. Referral Data Query
  const { data: referralData } = useQuery({
    queryKey: dashboardKeys.referral(),
    queryFn: dashboardService.getReferralData,
    staleTime: 5 * 60 * 1000,
  });

  // 4. Traffic Stats Query
  const { data: trafficStats } = useQuery({
    queryKey: dashboardKeys.traffic(),
    queryFn: dashboardService.getTrafficStats,
    staleTime: 5 * 60 * 1000,
  });

  // 5. Top Links Query
  const { data: topLinks } = useQuery({
    queryKey: dashboardKeys.topLinks(),
    queryFn: dashboardService.getTopLinks,
    staleTime: 5 * 60 * 1000,
  });

  // 6. Top Countries Query (for dashboard)
  const { data: topCountries } = useQuery({
    queryKey: dashboardKeys.topCountries(),
    queryFn: () => getTopCountries(5), // Top 5 for dashboard
    staleTime: 5 * 60 * 1000,
  });

  // 7. Analytics Data Query (depends on filters)
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: dashboardKeys.analytics(analyticsRange, analyticsStat),
    queryFn: () => dashboardService.getAnalytics(analyticsRange, analyticsStat),
    staleTime: 5 * 60 * 1000,
  });

  // Refresh all dashboard data
  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  }, [queryClient]);

  return {
    // Data
    slides, // Now translated and personalized
    milestone: milestone ?? null,
    referralData: referralData ?? null,
    trafficStats: trafficStats ?? null,
    topLinks: topLinks ?? null,
    topCountries: topCountries ?? null,
    analyticsData: analyticsData ?? null,

    // Analytics Controls
    analyticsLoading,
    analyticsRange,
    analyticsStat,
    setAnalyticsRange,
    setAnalyticsStat,

    // Actions
    refreshAll,
  };
}
