// src/app/[locale]/(member)/analytics/page.tsx
"use client";

import { useTranslations } from "next-intl";

// Components
import AnalyticsHeader from "@/components/dashboard/analytics/AnalyticsHeader";
import SharedStatsGrid from "@/components/dashboard/SharedStatsGrid";
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
import TopCountriesCard from "@/components/dashboard/analytics/TopCountriesCard";
import TopReferrersCard from "@/components/dashboard/analytics/TopReferrersCard";

// Hooks
import { useAnalytics, type ChartRange } from "@/hooks/useAnalytics";
import { useFeatureLocks } from "@/hooks/useFeatureLocks";
import type { StatType, TimeRange } from "@/types/type";

export default function AnalyticsPage() {
  const t = useTranslations("Dashboard");

  const {
    statsCards,
    chartData,
    topCountries,
    topReferrers,
    statsLoading,
    chartLoading,
    isRefetching,
    // 🔧 Separate filters for stats and chart
    statsRange,
    setStatsRange,
    chartRange,
    setChartRange,
    chartMetric,
    setChartMetric,
    refetchAll,
  } = useAnalytics();

  // Feature locks for analytics sections
  const {
    canViewTopCountries,
    canViewTopReferrers,
    levelForTopCountries,
    levelForTopReferrers,
  } = useFeatureLocks();

  // Map chartMetric to StatType for LinkAnalyticsCard
  const metricToStatType: Record<string, StatType> = {
    clicks: "totalViews",
    earnings: "totalEarnings",
    valid_clicks: "totalViews",
  };

  const handleStatChange = (newStat: StatType) => {
    const map: Record<StatType, "clicks" | "earnings" | "valid_clicks"> = {
      totalViews: "clicks",
      totalEarnings: "earnings",
      totalReferral: "clicks", // fallback
    };
    setChartMetric(map[newStat] || "clicks");
  };

  // 🔧 Handler for chart range change (converts TimeRange to ChartRange)
  const handleChartRangeChange = (range: TimeRange) => {
    // Only accept valid chart ranges (no lifetime)
    if (range === "perWeek" || range === "perMonth" || range === "perYear") {
      setChartRange(range as ChartRange);
    }
  };

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <div className="space-y-6">
        {/* 0. Header with Title & Stats Range Filter */}
        <AnalyticsHeader
          range={statsRange}
          onRangeChange={setStatsRange}
          onRefresh={refetchAll}
          isRefetching={isRefetching}
        />

        {/* 1. Stats Cards - Uses statsRange filter */}
        <SharedStatsGrid
          cards={statsCards}
          isLoading={statsLoading}
          columns={3}
        />

        {/* 2. Main Chart - Has its own chartRange filter */}
        <div className="w-full">
          <LinkAnalyticsCard
            data={chartData}
            isLoading={chartLoading}
            error={null}
            range={chartRange}
            stat={metricToStatType[chartMetric]}
            onChangeRange={handleChartRangeChange}
            onChangeStat={handleStatChange}
            hideRangeFilter={false} // 🔧 Show range filter - chart has independent filter
          />
        </div>

        {/* 3. Top Countries & Referrers - From aggregate tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[380px]">
            <TopCountriesCard
              data={topCountries}
              isLocked={!canViewTopCountries}
              requiredLevel={levelForTopCountries}
            />
          </div>
          <div className="h-[380px]">
            <TopReferrersCard
              data={topReferrers}
              isLocked={!canViewTopReferrers}
              requiredLevel={levelForTopReferrers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
