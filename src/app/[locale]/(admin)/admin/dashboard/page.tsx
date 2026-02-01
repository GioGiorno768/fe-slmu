"use client";

import SharedStatsGrid, {
  StatCardData,
} from "@/components/dashboard/SharedStatsGrid"; // <--- IMPORT INI
import RecentActivities from "@/components/dashboard/admin/dashboardAdmin/RecentActivities";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { CheckCircle2, Users, Link2 } from "lucide-react"; // Import Icon

export default function AdminDashboard() {
  const { stats, activities, isLoading } = useAdminDashboard();

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 5 });
  const formatNumber = (val: number) => val.toLocaleString("en-US");

  // MAPPING DATA ADMIN (3 Cards)
  const adminStatsCards: StatCardData[] = [
    {
      id: "paid",
      title: "Paid Today",
      value: stats ? formatCurrency(stats.financial.paidToday) : "...",
      subLabel: "Total Payouts",
      trend: stats?.financial.trend,
      icon: CheckCircle2,
      color: "green",
    },
    {
      id: "users_paid",
      title: "Users Paid",
      value: stats ? formatNumber(stats.financial.usersPaidToday) : "...",
      subLabel: "Processed Today",
      trend: stats?.financial.trend,
      icon: Users,
      color: "blue",
    },
    {
      id: "created",
      title: "Links Created",
      value: stats ? formatNumber(stats.content.linksCreatedToday) : "...",
      subLabel: "New Links Today",
      trend: stats?.content.trend,
      icon: Link2,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8 pb-10 text-[10px]">
      {/* Pake Shared Component */}
      <SharedStatsGrid
        cards={adminStatsCards}
        isLoading={isLoading}
        columns={3}
      />

      <RecentActivities
        withdrawals={activities?.withdrawals || []}
        users={activities?.users || []}
        links={activities?.links || []}
        isLoading={isLoading}
      />
    </div>
  );
}
