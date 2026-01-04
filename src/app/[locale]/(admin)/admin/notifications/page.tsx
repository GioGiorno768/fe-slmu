// src/app/[locale]/(admin)/admin/notifications/page.tsx
"use client";

import { Loader2, Bell } from "lucide-react";
import { NotificationHistoryList } from "@/components/dashboard/notifications";
import { useNotificationHistory } from "@/hooks/useNotificationHistory";

export default function AdminNotificationsPage() {
  const {
    notifications,
    pinnedNotifications,
    isLoading,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    markRead,
    deleteNotification,
    unreadCount,
  } = useNotificationHistory();

  // Initial Loading Screen
  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      {/* Header Page */}
      <div className="mb-8">
        <h1 className="text-[2.5em] font-bold text-shortblack flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl text-bluelight relative">
            <Bell className="w-8 h-8" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[0.8em] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          Notifikasi Admin
        </h1>
        <p className="text-[1.6em] text-grays mt-2 ml-2">
          Lihat semua notifikasi sistem dan laporan penting.
        </p>
      </div>

      {/* List Component */}
      <NotificationHistoryList
        notifications={notifications}
        pinnedNotifications={pinnedNotifications}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onMarkRead={markRead}
        onDelete={deleteNotification}
      />
    </div>
  );
}
