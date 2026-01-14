import type {
  SuperAdminStats,
  AnalyticsData,
  TimeRange,
  AuditLog,
} from "@/types/type";
import apiClient from "@/services/apiClient";

export async function getSuperAdminStats(): Promise<SuperAdminStats> {
  try {
    const response = await apiClient.get("/admin/dashboard/overview");
    const data = response.data.data;

    return {
      financial: {
        paidToday: data.payments_today_amount || 0,
        usersPaidToday: data.users_paid_today || 0,
        trend: data.payments_trend || 0,
        pendingTotal: data.pending_payments_total || 0, // Added field
      },
      security: {
        blockedLinksToday: data.links_blocked_today || 0,
        trend: data.blocked_trend || 0,
      },
      system: {
        staffOnline: data.staff_online || 0,
        totalStaff: data.total_staff || 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch super admin stats:", error);
    // Fallback mock
    return {
      financial: { paidToday: 0, usersPaidToday: 0, trend: 0, pendingTotal: 0 },
      security: { blockedLinksToday: 0, trend: 0 },
      system: { staffOnline: 0, totalStaff: 0 },
    };
  }
}

export async function getSuperAdminRevenueChart(
  range: TimeRange
): Promise<AnalyticsData> {
  try {
    const response = await apiClient.get("/admin/analytics/revenue-chart", {
      params: { period: range },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch revenue chart:", error);
    // Fallback to empty data
    return {
      categories: [],
      series: [
        { name: "Est. Platform Revenue (100%)", data: [] },
        { name: "User Earnings (70%)", data: [] },
      ],
    };
  }
}

export async function getRecentAuditLogs(): Promise<AuditLog[]> {
  await new Promise((r) => setTimeout(r, 700));

  return [
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      adminId: "adm-1",
      adminName: "Sarah Admin",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-1.webp",
      action: "block",
      targetType: "link",
      targetId: "link-123",
      targetName: "short.link/phishing123",
      description: "Detected as phishing site via report #RP-99",
      status: "success",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      adminId: "adm-2",
      adminName: "Budi Santoso",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-2.webp",
      action: "approve",
      targetType: "withdrawal",
      targetId: "wd-8821",
      targetName: "WD-8821 ($50.00)",
      description: "Payment sent via PayPal",
      status: "success",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      adminId: "adm-3",
      adminName: "Sarah Admin",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-3.webp",
      action: "update",
      targetType: "announcement",
      targetId: "ann-123",
      targetName: "Maintenance Notice",
      description: "Posted new announcement about server maintenance",
      status: "success",
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      adminId: "adm-1",
      adminName: "Sarah Admin",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-4.webp",
      action: "reject",
      targetType: "withdrawal",
      targetId: "wd-8890",
      targetName: "WD-8890 ($120.00)",
      description: "Invalid payment details (Bank ID not found)",
      status: "failed",
    },
    {
      id: "log-5",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      adminId: "adm-2",
      adminName: "Budi Santoso",
      adminRole: "admin",
      adminAvatar: "/avatars/avatar-2.webp",
      action: "create",
      targetType: "user",
      targetId: "user-spam01",
      targetName: "User: spammer01",
      description: "Sent warning about traffic quality",
      status: "success",
    },
  ];
}
