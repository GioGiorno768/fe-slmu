"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader2, ChevronDown, Users } from "lucide-react";
import apiClient from "@/services/apiClient";
import { useTheme } from "next-themes";
import clsx from "clsx";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
    </div>
  ),
});

type TimeRange = "week" | "month" | "year";

export default function ActiveUsersDetailCard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "year", label: "This Year" },
  ];

  // Fetch data based on time range
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          "/admin/analytics/active-users-chart",
          {
            params: { period: timeRange },
          }
        );
        const data = response.data.data;

        setChartData({
          categories: data.categories,
          series: data.series,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to empty data
        setChartData({
          categories: [],
          series: [{ name: "Active Users", data: [] }],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const chartOptions: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 250,
        zoom: { enabled: false },
        toolbar: { show: false },
        fontFamily: "Figtree, sans-serif",
      },
      colors: ["#22c55e"], // Green
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.1,
          gradientToColors: ["#86efac"],
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
        y: { formatter: (val) => val.toLocaleString("en-US") + " users" },
      },
      xaxis: {
        categories: chartData?.categories || [],
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
          formatter: (val) => val.toFixed(0),
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
      legend: { show: false },
    }),
    [chartData, isDark]
  );

  return (
    <div
      className={clsx(
        "p-6 rounded-3xl shadow-sm border font-figtree",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isDark ? "bg-green-500/20" : "bg-green-100"
            )}
          >
            <Users
              className={clsx(
                "w-5 h-5",
                isDark ? "text-green-400" : "text-green-600"
              )}
            />
          </div>
          <div>
            <h3
              className={clsx(
                "text-[1.6em] font-bold",
                isDark ? "text-white" : "text-slate-800"
              )}
            >
              Active Users
            </h3>
            <p
              className={clsx(
                "text-[1.1em]",
                isDark ? "text-gray-400" : "text-slate-400"
              )}
            >
              Daily active user trends
            </p>
          </div>
        </div>

        {/* Time Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className={clsx(
              "flex items-center gap-2 text-[1.3em] font-medium px-4 py-2 rounded-xl transition-all duration-300 border",
              isDark
                ? "bg-subcard border-gray-700 text-white hover:bg-gray-700"
                : "bg-gray-50 border-gray-200 text-slate-600 hover:bg-white hover:shadow-sm"
            )}
          >
            {timeRanges.find((r) => r.key === timeRange)?.label}
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform duration-300",
                isRangeOpen && "rotate-180"
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
                  "absolute top-full right-0 mt-2 p-2 w-40 rounded-xl shadow-xl border z-20",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-100"
                )}
              >
                {timeRanges.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setTimeRange(r.key);
                      setIsRangeOpen(false);
                    }}
                    className={clsx(
                      "block w-full text-left text-[1.2em] px-3 py-2 rounded-lg transition-colors",
                      timeRange === r.key
                        ? isDark
                          ? "bg-green-500/20 text-green-400 font-semibold"
                          : "bg-green-50 text-green-600 font-semibold"
                        : isDark
                        ? "text-gray-400 hover:text-white hover:bg-subcard"
                        : "text-slate-600 hover:bg-gray-50"
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

      {/* Chart */}
      <div className="h-[250px] -ml-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-200" />
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={chartData?.series || []}
            type="area"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
