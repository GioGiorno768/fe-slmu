// src/components/dashboard/analytics/TrafficHistory.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Eye,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Crown,
  BarChart3,
  Loader2,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import Pagination from "@/components/dashboard/Pagination";
import type { MonthlyStat } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";

interface TrafficHistoryProps {
  data: MonthlyStat[] | null;
}

const ITEMS_PER_PAGE = 5;

export default function TrafficHistory({ data }: TrafficHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 💱 Currency context
  const { format: formatCurrency } = useCurrency();

  const formatViews = (val: number) => val.toLocaleString("en-US");

  // Find top month for highlighting
  // Priority: earnings > views (earnings is more reliable indicator)
  // Edge case: if all months have 0 data, return last item (current month)
  const topMonth = useMemo(() => {
    if (!data || data.length === 0) return null;

    const hasAnyActivity = data.some(
      (item) => item.earnings > 0 || item.views > 0
    );

    if (!hasAnyActivity) {
      // If no activity at all, show current month (first in array since it's reversed)
      return data[0];
    }

    return data.reduce((prev, current) => {
      // If current item has higher earnings, it's the top
      if (current.earnings > prev.earnings) {
        return current;
      }
      // If earnings are equal, compare views
      if (current.earnings === prev.earnings && current.views > prev.views) {
        return current;
      }
      return prev;
    });
  }, [data]);

  // Pagination logic
  const totalPages = data ? Math.ceil(data.length / ITEMS_PER_PAGE) : 0;
  const paginatedData = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  // Loading state
  if (!data) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center py-16">
          <BarChart3 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-[1.4em] text-grays">
            No traffic data available yet.
          </p>
        </div>
      </div>
    );
  }

  // Get level color
  const getLevelStyle = (level: string) => {
    const lower = level.toLowerCase();
    if (lower.includes("mythic"))
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (lower.includes("master"))
      return "bg-red-100 text-red-600 border-red-200";
    if (lower.includes("pro"))
      return "bg-blue-100 text-blue-600 border-blue-200";
    if (lower.includes("elite"))
      return "bg-emerald-100 text-emerald-600 border-emerald-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div className="space-y-6 font-figtree">
      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[2em] font-bold text-shortblack flex items-center gap-3">
              <Calendar className="w-6 h-6 text-bluelight" />
              Traffic Performance
            </h3>
            <p className="text-[1.4em] text-grays mt-1">
              Detail performa trafik bulanan, CPM, dan pendapatan Anda.
            </p>
          </div>

          {topMonth && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-5 py-3 rounded-2xl">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[1em] text-yellow-700 font-bold uppercase tracking-wider">
                  Best Traffic
                </p>
                <p className="text-[1.4em] font-bold text-shortblack">
                  {topMonth.month} {topMonth.year}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LIST CARDS */}
      <div className="space-y-4">
        {paginatedData.map((item, index) => {
          const isTop =
            topMonth &&
            item.month === topMonth.month &&
            item.year === topMonth.year;
          const isPositive = item.growth > 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={`${item.month}-${item.year}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={clsx(
                "bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md group relative overflow-hidden",
                isTop
                  ? "border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-white"
                  : "border-gray-100"
              )}
            >
              {/* Top badge */}
              {isTop && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[0.9em] font-bold uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Top
                </div>
              )}

              <div className="p-5 md:p-6">
                {/* Main Row */}
                <div className="flex items-start gap-4">
                  {/* Month Icon */}
                  <div
                    className={clsx(
                      "w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                      isTop
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-50 text-bluelight"
                    )}
                  >
                    <span className="text-[1.1em] font-bold leading-none">
                      {item.month}
                    </span>
                    <span className="text-[0.9em] font-medium opacity-70">
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top Row: Views & Earnings */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className="text-[1.6em] font-bold text-shortblack">
                          {formatViews(item.views)}
                        </span>
                        <span className="text-[1.2em] text-grays">views</span>
                      </div>

                      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-[1.6em] font-bold text-green-600">
                          {formatCurrency(item.earnings)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: CPM, Level, Growth */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* CPM */}
                      <div className="flex items-center gap-1.5 text-[1.2em] text-grays">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>CPM:</span>
                        <span className="font-semibold text-shortblack">
                          ${item.cpm.toFixed(5)}
                        </span>
                      </div>

                      {/* Level Badge */}
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-[1em] font-bold uppercase border",
                          getLevelStyle(item.level)
                        )}
                      >
                        {item.level}
                      </span>

                      {/* Growth */}
                      {item.growth !== 0 && (
                        <div
                          className={clsx(
                            "flex items-center gap-1 px-2 py-1 rounded-lg text-[1.1em] font-bold",
                            isPositive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          )}
                        >
                          <TrendIcon className="w-3.5 h-3.5" />
                          <span>{Math.abs(item.growth)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
