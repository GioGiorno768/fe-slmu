// src/services/analyticsService.ts
import apiClient from "./apiClient";
import type { AnalyticsData, MonthlyStat } from "@/types/type";

// API Range mapping: frontend -> backend
type FrontendRange =
  | "perWeek"
  | "perMonth"
  | "perYear"
  | "lifetime"
  | "per12Months";
type BackendRange = "week" | "month" | "year" | "lifetime" | "12months";

const rangeMap: Record<FrontendRange, BackendRange> = {
  perWeek: "week",
  perMonth: "month",
  perYear: "year",
  lifetime: "lifetime",
  per12Months: "12months",
};

// =============================================
// SUMMARY STATS (untuk SharedStatsGrid)
// =============================================

export interface SummaryStatsResponse {
  earnings: {
    total_earnings: number;
    range: string;
    from_date: string;
    to_date: string;
  };
  clicks: {
    total_clicks: number;
    range: string;
    from_date: string;
    to_date: string;
  };
  referrals: {
    referral_count: number;
    range: string;
    from_date: string;
    to_date: string;
  };
  cpm: {
    average_cpm: number;
    range: string;
    from_date: string;
    to_date: string;
  };
}

/**
 * Fetch all summary stats in parallel for SharedStatsGrid
 */
export async function getSummaryStats(
  range: FrontendRange = "perMonth"
): Promise<SummaryStatsResponse> {
  const backendRange = rangeMap[range] || "month";

  const [earnings, clicks, referrals, cpm] = await Promise.all([
    apiClient.get("/dashboard/summary/earnings", {
      params: { range: backendRange },
    }),
    apiClient.get("/dashboard/summary/clicks", {
      params: { range: backendRange },
    }),
    apiClient.get("/dashboard/summary/referrals", {
      params: { range: backendRange },
    }),
    apiClient.get("/dashboard/summary/cpm", {
      params: { range: backendRange },
    }),
  ]);

  return {
    earnings: earnings.data.data,
    clicks: clicks.data.data,
    referrals: referrals.data.data,
    cpm: cpm.data.data,
  };
}

// =============================================
// CHART DATA (untuk LinkAnalyticsCard)
// =============================================

type ChartMetric = "clicks" | "earnings" | "valid_clicks";
type ChartGroupBy = "day" | "week" | "month";

interface ChartApiResponse {
  metric: string;
  group_by: string;
  range_info: {
    from: string;
    to: string;
  };
  points: {
    label: string;
    value: number;
    date: string;
  }[];
  total: number;
}

/**
 * Fetch chart data for analytics
 */
export async function getAnalyticsData(
  range: FrontendRange,
  metric: ChartMetric = "clicks",
  groupBy: ChartGroupBy = "day"
): Promise<AnalyticsData> {
  const backendRange = rangeMap[range] || "month";

  const response = await apiClient.get<{ data: ChartApiResponse }>(
    "/dashboard/analytics",
    {
      params: {
        range: backendRange,
        metric,
        group_by: groupBy,
      },
    }
  );

  const apiData = response.data.data;

  // Transform to AnalyticsData format for ApexCharts
  return {
    series: [
      {
        name: metric === "earnings" ? "Earnings" : "Views",
        data: apiData.points.map((p) => p.value),
      },
    ],
    categories: apiData.points.map((p) => p.label),
  };
}

// =============================================
// TRAFFIC HISTORY (untuk TrafficHistory table)
// =============================================

interface MonthlyPerformanceApiResponse {
  range_info: {
    from: string;
    to: string;
  };
  items: {
    month: string; // "2025-01"
    label: string; // "January 2025"
    valid_clicks: number;
    earnings: number;
    average_cpm: number;
    user_level: string;
  }[];
}

/**
 * Fetch monthly performance data for traffic history table
 */
export async function getTrafficHistory(
  range: FrontendRange = "per12Months"
): Promise<MonthlyStat[]> {
  const backendRange = rangeMap[range] || "12months";

  const response = await apiClient.get<{ data: MonthlyPerformanceApiResponse }>(
    "/analytics/monthly-performance",
    {
      params: { range: backendRange },
    }
  );

  const apiData = response.data.data;

  // Transform to MonthlyStat format
  // Sort by newest first and calculate growth
  const items = apiData.items.reverse(); // Newest first

  return items.map((item, index) => {
    // Calculate growth vs previous month
    const prevItem = items[index + 1];
    let growth = 0;
    if (prevItem && prevItem.valid_clicks > 0) {
      growth =
        ((item.valid_clicks - prevItem.valid_clicks) / prevItem.valid_clicks) *
        100;
    }

    // Parse month label to get month name and year
    const [year, monthNum] = item.month.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[parseInt(monthNum) - 1] || "Jan";

    return {
      month: monthName,
      year: parseInt(year),
      views: item.valid_clicks,
      cpm: item.average_cpm,
      earnings: item.earnings,
      level: item.user_level,
      growth: Math.round(growth * 10) / 10, // Round to 1 decimal
    };
  });
}

// =============================================
// TOP COUNTRIES (dari aggregate table)
// =============================================

interface TopCountriesApiResponse {
  total_views: number;
  items: {
    country_code: string;
    country_name: string;
    views: number;
    percentage: number;
  }[];
}

export async function getTopCountries(limit: number = 7) {
  const response = await apiClient.get<{ data: TopCountriesApiResponse }>(
    "/analytics/top-countries",
    { params: { limit } }
  );

  const apiData = response.data.data;

  // Transform to CountryStat format
  return apiData.items.map((item) => ({
    isoCode: item.country_code.toLowerCase(),
    name: item.country_name,
    views: item.views,
    percentage: item.percentage,
  }));
}

// =============================================
// TOP REFERRERS (dari aggregate table)
// =============================================

interface TopReferrersApiResponse {
  total_views: number;
  items: {
    referrer_key: string;
    referrer_label: string;
    views: number;
    percentage: number;
  }[];
}

export async function getTopReferrers(limit: number = 6) {
  const response = await apiClient.get<{ data: TopReferrersApiResponse }>(
    "/analytics/top-referrers",
    { params: { limit } }
  );

  const apiData = response.data.data;

  // Transform to ReferrerStat format
  return apiData.items.map((item) => ({
    name: item.referrer_label,
    views: item.views,
    percentage: item.percentage,
  }));
}
