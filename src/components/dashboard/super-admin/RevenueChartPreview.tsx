"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader2, OctagonAlert, TrendingUp, ArrowRight } from "lucide-react";
import type { AnalyticsData } from "@/types/type";
import * as service from "@/services/superAdminService";
import Link from "next/link";
import { useTheme } from "next-themes";
import clsx from "clsx";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
    </div>
  ),
});

/**
 * Simplified Revenue Chart for Dashboard
 * - Fixed to "This Week" period
 * - No filter dropdown
 * - "View Details" link to analytics page
 */
export default function RevenueChartPreview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Fetch Data - Fixed to perWeek
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await service.getSuperAdminRevenueChart("perWeek");
        setData(res);
      } catch (err) {
        console.error(err);
        setError("Failed to load revenue data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Chart Options
  const chartOptions: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 250,
        zoom: { enabled: false },
        toolbar: { show: false },
        fontFamily: "Figtree, sans-serif",
      },
      colors: ["#8b5cf6", "#22c55e"],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.1,
          gradientToColors: ["#c4b5fd", "#86efac"],
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (val) =>
            "$" + val.toLocaleString("en-US", { minimumFractionDigits: 5 }),
        },
      },
      xaxis: {
        categories: data?.categories || [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: isDark ? "#9ca3af" : "#64748b",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val) =>
            "$" + val.toLocaleString("en-US", { minimumFractionDigits: 5 }),
          style: {
            colors: isDark ? "#9ca3af" : "#64748b",
          },
        },
      },
      grid: {
        show: true,
        borderColor: isDark ? "#374151" : "#f1f1f1",
        strokeDashArray: 4,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: isDark ? "#d1d5db" : "#374151",
        },
      },
    }),
    [data, isDark],
  );

  return (
    <div
      className={clsx(
        "p-8 rounded-3xl shadow-sm border font-figtree",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3
            className={clsx(
              "text-[1.8em] font-bold flex items-center gap-3",
              isDark ? "text-white" : "text-slate-800",
            )}
          >
            <TrendingUp
              className={clsx(
                "w-7 h-7",
                isDark ? "text-purple-400" : "text-purple-600",
              )}
            />
            Revenue Estimation
          </h3>
          <p
            className={clsx(
              "text-[1.2em] mt-1",
              isDark ? "text-gray-400" : "text-slate-400",
            )}
          >
            This week&apos;s estimated revenue
          </p>
        </div>

        {/* View Details Link */}
        <Link
          href="/en/super-admin/analytics"
          className={clsx(
            "flex items-center gap-2 text-[1.3em] font-medium px-4 py-2 rounded-xl transition-all duration-300 group",
            isDark
              ? "text-purple-400 bg-purple-500/20 hover:bg-purple-500/30"
              : "text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100",
          )}
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Chart Body */}
      <div className="h-[280px] -ml-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-200" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-500">
            <OctagonAlert className="w-8 h-8 mx-auto mb-2" />
            <p className="text-[1.4em] font-medium">{error}</p>
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={data?.series || []}
            type="area"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
