"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader2, OctagonAlert, ChevronDown, TrendingUp } from "lucide-react";
import type { AnalyticsData, TimeRange } from "@/types/type";
import * as service from "@/services/superAdminService";
import { useTheme } from "next-themes";
import clsx from "clsx";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
    </div>
  ),
});

export default function RevenueEstimationChart() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // State Filter
  const [range, setRange] = useState<TimeRange>("perWeek");
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: "perWeek", label: "This Week" },
    { key: "perMonth", label: "This Month" },
    { key: "perYear", label: "This Year" },
  ];

  // Fetch Data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await service.getSuperAdminRevenueChart(range);
        setData(res);
      } catch (err) {
        console.error(err);
        setError("Failed to load revenue data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [range]);

  // Chart Options
  const chartOptions: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 300,
        zoom: { enabled: false },
        toolbar: { show: false },
        fontFamily: "Figtree, sans-serif",
      },
      colors: ["#8b5cf6", "#22c55e"], // Purple (Revenue), Green (User)
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
      stroke: {
        curve: "smooth",
        width: 3,
      },
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
          colors: isDark ? "#9ca3af" : "#64748b",
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3
            className={clsx(
              "text-[1.8em] font-bold flex items-center gap-3",
              isDark ? "text-white" : "text-slate-800",
            )}
          >
            <TrendingUp className="w-7 h-7 text-purple-600" />
            Revenue Estimation
          </h3>
          <p
            className={clsx(
              "text-[1.2em] mt-1",
              isDark ? "text-gray-400" : "text-slate-400",
            )}
          >
            Estimated platform revenue based on user earnings (Reverse
            Calculation).
          </p>
        </div>

        {/* Dropdown Range */}
        <div className="relative">
          <button
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className={clsx(
              "flex items-center gap-2 text-[1.4em] font-medium px-[1.5em] py-[.6em] rounded-xl transition-all duration-300 border",
              isDark
                ? "bg-subcard border-gray-700 text-white hover:bg-gray-700"
                : "bg-gray-50 border-gray-200 text-slate-600 hover:bg-white hover:shadow-sm",
            )}
          >
            {timeRanges.find((o) => o.key === range)?.label}
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform duration-300",
                isRangeOpen && "rotate-180",
              )}
            />
          </button>

          {isRangeOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsRangeOpen(false)}
              />
              <div
                className={clsx(
                  "absolute top-full right-0 mt-2 p-2 w-48 rounded-xl shadow-xl border z-20 animate-in fade-in slide-in-from-top-2",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-100",
                )}
              >
                {timeRanges.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setRange(r.key);
                      setIsRangeOpen(false);
                    }}
                    className={clsx(
                      "block w-full text-left text-[1.3em] px-4 py-2 rounded-lg transition-colors",
                      range === r.key
                        ? isDark
                          ? "bg-purple-500/20 text-purple-400 font-semibold"
                          : "bg-purple-50 text-purple-600 font-semibold"
                        : isDark
                          ? "text-gray-400 hover:text-white hover:bg-subcard"
                          : "text-slate-600 hover:bg-gray-50",
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart Body */}
      <div className="h-[350px] -ml-2">
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
