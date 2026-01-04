"use client";

import { useAuditLogs } from "@/hooks/useAuditLogs";
import SharedStatsGrid from "@/components/dashboard/SharedStatsGrid";
import AuditLogFilterBar from "@/components/dashboard/super-admin/AuditLogFilterBar";
import AuditLogListItem from "@/components/dashboard/super-admin/AuditLogListItem";
import Pagination from "@/components/dashboard/Pagination";
import {
  Loader2,
  Activity,
  Users,
  AlertTriangle,
  XCircle,
  FileText,
} from "lucide-react";

export default function AuditLogsPage() {
  const {
    logs,
    stats,
    adminsList,
    isLoading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    dateRange,
    setDateRange,
    adminFilter,
    setAdminFilter,
    actionType,
    setActionType,
    targetType,
    setTargetType,
    status,
    setStatus,
  } = useAuditLogs();

  // Format stats for SharedStatsGrid
  const statsData = stats
    ? [
        {
          id: "total-activities",
          title: "Activities Today",
          value: stats.totalActivitiesToday.toString(),
          subLabel: "total actions",
          icon: Activity,
          color: "blue" as const,
        },
        {
          id: "active-admins",
          title: "Active Admins",
          value: stats.activeAdmins.toString(),
          subLabel: "online now",
          icon: Users,
          color: "green" as const,
        },
        {
          id: "critical-actions",
          title: "Critical Actions",
          value: stats.criticalActions.toString(),
          subLabel: "delete/suspend",
          icon: AlertTriangle,
          color: "orange" as const,
        },
        {
          id: "failed-actions",
          title: "Failed Actions",
          value: stats.failedActions.toString(),
          subLabel: "errors detected",
          icon: XCircle,
          color: "red" as const,
        },
      ]
    : [];

  return (
    <div className="space-y-8 pb-10 text-[10px]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[3em] font-bold text-shortblack font-manrope">
            Audit Logs
          </h1>
          <p className="text-[1.6em] text-grays mt-1">
            Track and monitor all admin activities across the platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <SharedStatsGrid cards={statsData} isLoading={isLoading} columns={4} />

      {/* Filter Bar */}
      <AuditLogFilterBar
        search={search}
        onSearchChange={setSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        adminFilter={adminFilter}
        onAdminFilterChange={setAdminFilter}
        actionType={actionType}
        onActionTypeChange={setActionType}
        targetType={targetType}
        onTargetTypeChange={setTargetType}
        status={status}
        onStatusChange={setStatus}
        adminsList={adminsList}
      />

      {/* Activity List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-[2em] font-bold text-gray-700 mb-2">
              No Activities Found
            </h3>
            <p className="text-[1.4em] text-gray-500">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <>
            {logs.map((log, index) => (
              <AuditLogListItem key={log.id} log={log} index={index} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
