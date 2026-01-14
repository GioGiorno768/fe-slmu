"use client";

import SharedStatsGrid, {
  StatCardData,
} from "@/components/dashboard/SharedStatsGrid"; // <--- REUSE DISINI
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { Ban, UserCheck, Clock } from "lucide-react";
import RevenueChartPreview from "@/components/dashboard/super-admin/RevenueChartPreview";
import AuditLogCard from "@/components/dashboard/super-admin/AuditLogCard";
import { useState, useEffect } from "react";
import { getRecentAuditLogs } from "@/services/superAdminService";
import type { AuditLog } from "@/types/type";

export default function SuperAdminDashboardPage() {
  const { stats, isLoading } = useSuperAdmin();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  useEffect(() => {
    getRecentAuditLogs().then((data) => {
      setAuditLogs(data);
      setIsLogsLoading(false);
    });
  }, []);

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  // MAPPING DATA SUPER ADMIN - Only security & system stats
  const superAdminCards: StatCardData[] = [
    {
      id: "pending_payment",
      title: "Total Pending",
      value: stats ? formatCurrency(stats.financial.pendingTotal) : "...",
      subLabel: "All Time",
      icon: Clock,
      color: "blue",
    },
    {
      id: "blocked",
      title: "Blocked Links",
      value: stats ? stats.security.blockedLinksToday.toString() : "...",
      subLabel: "System Block",
      icon: Ban,
      color: "red",
    },
    {
      id: "staff",
      title: "Staff Online",
      value: stats
        ? `${stats.system.staffOnline} / ${stats.system.totalStaff}`
        : "...",
      subLabel: "Active Admins",
      icon: UserCheck,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 pb-24 text-[10px]">
      {/* 1. Top Stats (REUSE) */}
      <SharedStatsGrid
        cards={superAdminCards}
        isLoading={isLoading}
        columns={3}
      />

      {/* 2. Revenue Chart Preview */}
      <RevenueChartPreview />

      {/* 3. Audit Logs */}
      {/* <AuditLogCard logs={auditLogs} isLoading={isLogsLoading} /> */}

      {/* 4. Chart & Logs */}
      {/* ... (kode chart) ... */}
    </div>
  );
}
