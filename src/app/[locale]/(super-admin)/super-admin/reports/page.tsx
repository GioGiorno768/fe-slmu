"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/dashboard/Pagination";
import ReportList from "@/components/dashboard/admin/reports/ReportList";
import { useAdminReports } from "@/hooks/admin/useAdminReports";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function SuperAdminReportsPage() {
  const {
    reports,
    stats,
    isLoading,
    filter,
    setFilter,
    handleResolve,
    handleIgnore,
    page,
    setPage,
    totalPages,
  } = useAdminReports();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="space-y-8 pb-10 font-figtree text-[12px]">
      {/* 1. Simple Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className={clsx(
            "p-5 rounded-2xl border shadow-sm flex items-center gap-4",
            isDark ? "bg-card border-gray-800" : "bg-white border-red-100"
          )}
        >
          <div
            className={clsx(
              "p-3 rounded-xl",
              isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600"
            )}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p
              className={clsx(
                "text-[1.1em]",
                isDark ? "text-gray-400" : "text-grays"
              )}
            >
              Pending
            </p>
            <h3
              className={clsx(
                "text-[2em] font-bold",
                isDark ? "text-white" : "text-shortblack"
              )}
            >
              {stats?.pendingCount || 0}
            </h3>
          </div>
        </div>
        <div
          className={clsx(
            "p-5 rounded-2xl border shadow-sm flex items-center gap-4",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
          )}
        >
          <div
            className={clsx(
              "p-3 rounded-xl",
              isDark
                ? "bg-green-500/20 text-green-400"
                : "bg-green-50 text-green-600"
            )}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p
              className={clsx(
                "text-[1.1em]",
                isDark ? "text-gray-400" : "text-grays"
              )}
            >
              Resolved Today
            </p>
            <h3
              className={clsx(
                "text-[2em] font-bold",
                isDark ? "text-white" : "text-shortblack"
              )}
            >
              {stats?.resolvedToday || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div
        className={clsx(
          "flex gap-2 border-b pb-1",
          isDark ? "border-gray-700" : "border-gray-200"
        )}
      >
        {["all", "pending", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-6 py-2 rounded-t-lg font-bold text-[1.2em] transition-colors",
              filter === f
                ? isDark
                  ? "bg-card text-bluelight border-b-2 border-bluelight"
                  : "bg-white text-bluelight border-b-2 border-bluelight"
                : isDark
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-grays hover:text-shortblack hover:bg-gray-50"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* 3. The List */}
      <ReportList
        reports={reports}
        isLoading={isLoading}
        onResolve={handleResolve}
        onIgnore={handleIgnore}
      />

      {/* 4. Pagination */}
      {!isLoading && reports.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
