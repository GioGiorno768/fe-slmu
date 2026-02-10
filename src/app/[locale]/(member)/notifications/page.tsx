// src/app/[locale]/(member)/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { NotificationHistoryList } from "@/components/dashboard/notifications";
import { useNotificationHistory } from "@/hooks/useNotificationHistory";

export default function NotificationsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const { showAlert } = useAlert();
  const t = useTranslations("Dashboard");

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
          <div
            className={clsx(
              "p-3 rounded-2xl text-bluelight relative",
              isDark ? "bg-blue-500/20" : "bg-blue-100",
            )}
          >
            <Bell className="w-8 h-8" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[0.8em] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          {t("notificationsPage.pageTitle")}
        </h1>
        <p className="text-[1.6em] text-grays mt-2 ml-2">
          {t("notificationsPage.pageDesc")}
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
