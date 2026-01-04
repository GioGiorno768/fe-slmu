// src/hooks/useAnalytics.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
import * as analyticsService from "@/services/analyticsService";
import type { StatCardData } from "@/components/dashboard/SharedStatsGrid";
import { DollarSign, Eye, UserPlus2, TrendingUp } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

// Range types - Now separated for stats and chart
export type StatsRange = "lifetime" | "perWeek" | "perMonth" | "perYear";
export type ChartRange = "perWeek" | "perMonth" | "perYear";
export type ChartMetric = "clicks" | "earnings" | "valid_clicks";

// Legacy type for backward compatibility
export type AnalyticsRange = StatsRange;

// Query keys for React Query
export const analyticsKeys = {
  all: ["analytics"] as const,
  stats: (range: StatsRange) => [...analyticsKeys.all, "stats", range] as const,
  chart: (range: ChartRange, metric: ChartMetric) =>
    [...analyticsKeys.all, "chart", range, metric] as const,
  history: () => [...analyticsKeys.all, "history"] as const,
  topCountries: () => [...analyticsKeys.all, "topCountries"] as const,
  topReferrers: () => [...analyticsKeys.all, "topReferrers"] as const,
};

export function useAnalytics() {
  const t = useTranslations("Dashboard");

  // 💱 Use global currency context
  const { format: formatCurrency } = useCurrency();

  // 🔧 Separate controls for stats and chart
  const [statsRange, setStatsRange] = useState<StatsRange>("lifetime");
  const [chartRange, setChartRange] = useState<ChartRange>("perMonth");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("clicks");

  // Helper: Format number
  const formatNumber = useCallback(
    (val: number) => val.toLocaleString("en-US"),
    []
  );

  // Helper: Get sub label based on range
  const getSubLabel = useCallback(
    (rangeVal: StatsRange) => {
      switch (rangeVal) {
        case "perWeek":
          return t("perWeek");
        case "perMonth":
          return t("perMonth");
        case "perYear":
          return t("perYear");
        case "lifetime":
          return t("allTime");
        default:
          return t("perMonth");
      }
    },
    [t]
  );

  // 1. Query: Summary Stats (for SharedStatsGrid) - Uses statsRange
  const {
    data: statsData,
    isLoading: statsLoading,
    isFetching: statsFetching,
    error: statsError,
  } = useQuery({
    queryKey: analyticsKeys.stats(statsRange),
    queryFn: () => analyticsService.getSummaryStats(statsRange),
    staleTime: 2 * 60 * 1000, // 2 minutes (matches backend cache)
  });

  // Transform stats data to StatCardData format
  const statsCards: StatCardData[] = useMemo(() => {
    if (!statsData) return [];

    const subLabel = getSubLabel(statsRange);

    return [
      {
        id: "earnings",
        title: t("totalEarnings"),
        value: formatCurrency(statsData.earnings.total_earnings),
        subLabel: subLabel,
        icon: DollarSign,
        color: "green",
      },
      {
        id: "views",
        title: t("totalViews"),
        value: formatNumber(statsData.clicks.total_clicks),
        subLabel: subLabel,
        icon: Eye,
        color: "blue",
      },
      {
        id: "referrals",
        title: t("referral"),
        value: formatNumber(statsData.referrals.referral_count),
        subLabel: subLabel,
        icon: UserPlus2,
        color: "purple",
      },
      {
        id: "cpm",
        title: t("avgCPM"),
        value: formatCurrency(statsData.cpm.average_cpm),
        subLabel: subLabel,
        icon: TrendingUp,
        color: "orange",
      },
    ];
  }, [statsData, statsRange, t, getSubLabel, formatCurrency, formatNumber]);

  // 2. Query: Chart Data - Uses chartRange (separate from stats)
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: analyticsKeys.chart(chartRange, chartMetric),
    queryFn: async () => {
      // Determine group_by based on chart range
      let groupBy: "day" | "week" | "month" = "day";
      if (chartRange === "perMonth") groupBy = "day";
      else if (chartRange === "perYear") groupBy = "month";

      return analyticsService.getAnalyticsData(
        chartRange,
        chartMetric,
        groupBy
      );
    },
    staleTime: 2 * 60 * 1000,
  });

  // 3. Query: Traffic History (trailing 12 months)
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: analyticsKeys.history(),
    queryFn: () => analyticsService.getTrafficHistory("per12Months"),
    staleTime: 5 * 60 * 1000, // 5 minutes for history (less frequently changing)
  });

  // 4. Query: Top Countries (from aggregate table)
  const { data: topCountries, isLoading: countriesLoading } = useQuery({
    queryKey: analyticsKeys.topCountries(),
    queryFn: () => analyticsService.getTopCountries(7),
    staleTime: 5 * 60 * 1000,
  });

  // 5. Query: Top Referrers (from aggregate table)
  const { data: topReferrers, isLoading: referrersLoading } = useQuery({
    queryKey: analyticsKeys.topReferrers(),
    queryFn: () => analyticsService.getTopReferrers(8),
    staleTime: 5 * 60 * 1000,
  });

  // Query Client for manual refetch
  const queryClient = useQueryClient();

  // Refetch all analytics data
  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
  }, [queryClient]);

  // Combined fetching state for refresh button
  const isRefetching =
    statsFetching ||
    chartLoading ||
    historyLoading ||
    countriesLoading ||
    referrersLoading;

  return {
    // Data
    statsCards,
    chartData: chartData ?? null,
    history: history ?? null,
    topCountries: topCountries ?? null,
    topReferrers: topReferrers ?? null,

    // Loading States
    statsLoading,
    chartLoading,
    historyLoading,
    countriesLoading,
    referrersLoading,
    isRefetching,

    // Error
    error: statsError ? "Failed to load stats" : null,

    // 🔧 Separate Filters & Controls
    statsRange,
    setStatsRange,
    chartRange,
    setChartRange,
    chartMetric,
    setChartMetric,

    // Legacy: Keep 'range' and 'setRange' for backward compatibility
    range: statsRange,
    setRange: setStatsRange,

    // Actions
    refetchAll,
  };
}
