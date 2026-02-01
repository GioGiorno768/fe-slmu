"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Link2,
  MousePointerClick,
  DollarSign,
  CreditCard,
  Clock,
  ChevronDown,
  Calendar,
} from "lucide-react";
import SharedStatsGrid, {
  type StatCardData,
} from "@/components/dashboard/SharedStatsGrid";
import {
  usePlatformAnalytics,
  type TimeFilter,
} from "@/hooks/usePlatformAnalytics";
import ActiveUsersDetailCard from "@/components/dashboard/super-admin/ActiveUsersDetailCard";
import TopCountriesCard from "@/components/dashboard/super-admin/TopCountriesCard";
import RevenueEstimationChart from "@/components/dashboard/super-admin/RevenueEstimationChart";
import { useTheme } from "next-themes";
import clsx from "clsx";

const TIME_FILTER_OPTIONS: { key: TimeFilter; label: string }[] = [
  { key: "all", label: "All Time" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
];

export default function PlatformAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { stats, isLoading } = usePlatformAnalytics(timeFilter);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Format number dengan comma
  const formatNumber = (num: number) => num.toLocaleString("en-US");

  // Format compact number (K, M, B)
  const formatCompact = (num: number): string => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  };

  // Format currency with compact option
  const formatCurrency = (val: number, compact: boolean = false) => {
    if (compact && val >= 1_000) {
      return "$" + formatCompact(val);
    }
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 5 });
  };

  // Get current filter label
  const currentFilterLabel =
    TIME_FILTER_OPTIONS.find((f) => f.key === timeFilter)?.label || "All Time";

  // Get period text for subLabels based on filter
  type PeriodType =
    | "users"
    | "active"
    | "links"
    | "clicks"
    | "revenue"
    | "paid"
    | "pending"
    | "usersPaid";
  const getPeriodText = (type: PeriodType) => {
    const periodMap: Record<TimeFilter, Record<PeriodType, string>> = {
      all: {
        users: "All registered users",
        active: "All active users",
        links: "All created links",
        clicks: "Platform-wide",
        revenue: "All time estimated",
        paid: "Total disbursement",
        pending: "Pending withdrawals",
        usersPaid: "All users paid",
      },
      week: {
        users: "Registered this week",
        active: "Active this week",
        links: "Created this week",
        clicks: "This week",
        revenue: "Estimated this week",
        paid: "Paid this week",
        pending: "Pending this week",
        usersPaid: "Users paid this week",
      },
      month: {
        users: "Registered this month",
        active: "Active this month",
        links: "Created this month",
        clicks: "This month",
        revenue: "Estimated this month",
        paid: "Paid this month",
        pending: "Pending this month",
        usersPaid: "Users paid this month",
      },
      year: {
        users: "Registered this year",
        active: "Active this year",
        links: "Created this year",
        clicks: "This year",
        revenue: "Estimated this year",
        paid: "Paid this year",
        pending: "Pending this year",
        usersPaid: "Users paid this year",
      },
    };
    return periodMap[timeFilter][type];
  };

  // Stats cards - Revenue + Platform metrics
  const statsCards: StatCardData[] = [
    // Revenue Stats
    {
      id: "est-revenue",
      title: "Est. Revenue",
      value: stats ? formatCurrency(stats.estRevenue, true) : "$0",
      subLabel: getPeriodText("revenue"),
      icon: DollarSign,
      color: "green",
    },
    {
      id: "total-paid",
      title: "Total Paid",
      value: stats ? formatCurrency(stats.totalPaid, true) : "$0",
      subLabel: getPeriodText("paid"),
      icon: CreditCard,
      color: "blue",
    },
    {
      id: "total-pending",
      title: "Total Pending",
      value: stats ? formatCurrency(stats.totalPending, true) : "$0",
      subLabel: getPeriodText("pending"),
      icon: Clock,
      color: "amber",
    },
    {
      id: "total-links",
      title: "Total Links",
      value: stats ? formatCompact(stats.totalLinks) : "0",
      subLabel: getPeriodText("links"),
      icon: Link2,
      color: "purple",
    },
    {
      id: "total-transactions",
      title: "Success Withdrawals",
      value: stats ? formatCompact(stats.totalTransactions) : "0",
      subLabel: getPeriodText("paid"),
      icon: CreditCard,
      color: "orange",
    },
    // Platform Stats
    {
      id: "total-users",
      title: "Total Users",
      value: stats ? formatCompact(stats.totalUsers) : "0",
      subLabel: getPeriodText("users"),
      icon: Users,
      color: "blue",
    },
    {
      id: "active-users",
      title: "Active Users",
      value: stats ? formatCompact(stats.activeUsers) : "0",
      subLabel: getPeriodText("active"),
      icon: UserCheck,
      color: "green",
    },
    {
      id: "total-links-platform",
      title: "Total Clicks/Views",
      value: stats ? formatCompact(stats.totalClicks) : "0",
      subLabel: getPeriodText("clicks"),
      icon: MousePointerClick,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 pb-10 font-figtree text-[10px]">
      {/* Header with Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={clsx(
              "text-[2.4em] font-bold",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            Platform Analytics
          </h1>
          <p
            className={clsx(
              "text-[1.4em]",
              isDark ? "text-gray-400" : "text-gray-400",
            )}
          >
            Comprehensive overview of platform performance and metrics
          </p>
        </div>

        {/* Time Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={clsx(
              "flex items-center gap-2 text-[1.4em] font-medium px-5 py-3 rounded-2xl transition-all duration-300 border",
              isDark
                ? "bg-subcard border-gray-700 text-white hover:bg-gray-700"
                : "bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm",
            )}
          >
            <Calendar className="w-4 h-4 text-bluelight" />
            <span>{currentFilterLabel}</span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform duration-300",
                isDark ? "text-gray-400" : "text-gray-400",
                isFilterOpen && "rotate-180",
              )}
            />
          </button>

          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsFilterOpen(false)}
              />
              {/* Dropdown Menu */}
              <div
                className={clsx(
                  "absolute top-full right-0 mt-2 p-2 w-44 rounded-2xl shadow-xl border z-20",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-100",
                )}
              >
                {TIME_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setTimeFilter(option.key);
                      setIsFilterOpen(false);
                    }}
                    className={clsx(
                      "block w-full text-left text-[1.3em] px-4 py-2.5 rounded-xl transition-colors",
                      timeFilter === option.key
                        ? isDark
                          ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard font-semibold"
                          : "bg-bluelight/10 text-bluelight font-semibold"
                        : isDark
                          ? "text-gray-400 hover:text-white hover:bg-subcard"
                          : "text-slate-600 hover:bg-gray-50",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div>
        <SharedStatsGrid cards={statsCards} isLoading={isLoading} columns={4} />
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveUsersDetailCard />
        <TopCountriesCard />
      </div>

      {/* Revenue Estimation Chart - Full Version with Filters */}
      <RevenueEstimationChart />
    </div>
  );
}
