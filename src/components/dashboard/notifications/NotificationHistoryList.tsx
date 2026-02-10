// src/components/dashboard/notifications/NotificationHistoryList.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Filter, Search, ChevronDown, Check, BellOff } from "lucide-react";
import { useTheme } from "next-themes";
import NotificationHistoryItem from "./NotificationHistoryItem";
import NotificationDetailModal from "./NotificationDetailModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Pagination from "@/components/dashboard/Pagination";
import type { NotificationItem } from "@/types/type";
import clsx from "clsx";
import { useAlert } from "@/hooks/useAlert";
import { useLocale, useTranslations } from "next-intl";

export type StatusFilterType = "all" | "unread" | "read";

interface NotificationHistoryListProps {
  notifications: NotificationItem[];
  pinnedNotifications?: NotificationItem[];
  // Filter state dari parent
  statusFilter: StatusFilterType;
  setStatusFilter: (val: StatusFilterType) => void;
  search: string;
  setSearch: (val: string) => void;
  page: number;
  setPage: (val: number) => void;
  totalPages: number;
  isLoading: boolean;
  // Actions
  onMarkRead?: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function NotificationHistoryList({
  notifications,
  pinnedNotifications = [],
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
  page,
  setPage,
  totalPages,
  isLoading,
  onMarkRead,
  onDelete,
}: NotificationHistoryListProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const { showAlert } = useAlert();
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  // State UI lokal
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const filters: { id: StatusFilterType; label: string }[] = [
    { id: "all", label: t("notificationsPage.filterAll") },
    { id: "unread", label: t("notificationsPage.filterUnread") },
    { id: "read", label: t("notificationsPage.filterRead") },
  ];

  // Combine pinned + regular and filter by search locally (quick filter)
  const allNotifications = useMemo(() => {
    const combined = [...pinnedNotifications, ...notifications];
    if (!search.trim()) return combined;

    const searchLower = search.toLowerCase();
    return combined.filter(
      (n) =>
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower),
    );
  }, [pinnedNotifications, notifications, search]);

  // Group by date
  const groupedData = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {};
    allNotifications.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString(dateLocale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }, [allNotifications]);

  // Click outside filter dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLabel = filters.find((f) => f.id === statusFilter)?.label;

  // Handle item click -> open detail modal
  const handleItemClick = (notif: NotificationItem) => {
    if (!notif.isRead && onMarkRead) {
      onMarkRead(notif.id);
    }
    setSelectedNotif(notif);
  };

  // Handle delete confirmation
  const handleDeleteClick = (notif: NotificationItem) => {
    setDeleteTarget(notif);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteTarget.id);
      showAlert(t("notificationsPage.deleteSuccess"), "success");

      // Close modals
      if (selectedNotif?.id === deleteTarget.id) {
        setSelectedNotif(null);
      }
      setDeleteTarget(null);
    } catch {
      showAlert(t("notificationsPage.deleteFailed"), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-8 font-figtree">
        {/* --- Header: Search & Filter --- */}
        <div
          className={clsx(
            "flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-6 rounded-2xl shadow-sm",
            isDark
              ? "bg-card border border-gray-800"
              : "bg-white border border-gray-100",
          )}
        >
          {/* Search Input */}
          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder={t("notificationsPage.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={clsx(
                "w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight text-[1.4em] text-shortblack placeholder:text-gray-400 transition-all shadow-sm",
                isDark
                  ? "bg-card border border-gray-700"
                  : "bg-white border border-gray-200",
              )}
            />
          </div>

          {/* Dropdown Filter */}
          <div className="relative w-full md:w-auto z-20" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={clsx(
                "flex items-center justify-between w-full md:w-[220px] px-4 py-3 rounded-xl text-[1.4em] font-medium text-shortblack transition-colors border focus:ring-2 focus:ring-bluelight/20",
                isDark
                  ? "bg-subcard border-transparent hover:bg-gray-dashboard/50 focus:border-bluelight"
                  : "bg-blues border-transparent hover:bg-blue-100/50 focus:border-bluelight",
              )}
            >
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-bluelight" />
                <span className="truncate">{activeLabel}</span>
              </div>
              <ChevronDown
                className={clsx(
                  "w-5 h-5 text-grays transition-transform duration-200",
                  isFilterOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className={clsx(
                    "absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl overflow-hidden p-1.5 min-w-[220px]",
                    isDark
                      ? "bg-card border border-gray-800"
                      : "bg-white border border-gray-100",
                  )}
                >
                  {filters.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setStatusFilter(f.id);
                        setIsFilterOpen(false);
                      }}
                      className={clsx(
                        "w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-[1.3em] transition-all duration-300 text-left",
                        statusFilter === f.id
                          ? isDark
                            ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard font-semibold"
                            : "bg-bluelight/10 text-bluelight font-semibold"
                          : isDark
                            ? "text-grays hover:text-tx-blue-dashboard hover:bg-subcard"
                            : "text-shortblack hover:text-bluelight hover:bg-gray-50",
                      )}
                    >
                      {statusFilter === f.id && (
                        <span
                          className={clsx(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            isDark ? "bg-tx-blue-dashboard" : "bg-bluelight",
                          )}
                        />
                      )}
                      <span className={statusFilter !== f.id ? "ml-3.5" : ""}>
                        {f.label}
                      </span>
                      {statusFilter === f.id && (
                        <Check
                          className={clsx(
                            "w-4 h-4 ml-auto",
                            isDark
                              ? "text-tx-blue-dashboard"
                              : "text-bluelight",
                          )}
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- Notification List --- */}
        <div className="space-y-6 min-h-[400px]">
          {isLoading ? (
            <div className="text-center py-20 text-[1.4em] text-grays">
              {t("notificationsPage.loading")}
            </div>
          ) : allNotifications.length > 0 ? (
            <>
              {Object.entries(groupedData).map(([date, items], groupIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  {/* Date Header */}
                  <div
                    className={clsx(
                      "sticky top-[80px] z-10 py-4 backdrop-blur-sm mb-4",
                      isDark ? "bg-background/95" : "bg-slate-50/95",
                    )}
                  >
                    <h3 className="text-[1.4em] font-bold text-shortblack uppercase tracking-wider flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-bluelight" />
                      {date}
                    </h3>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <NotificationHistoryItem
                          key={item.id}
                          item={item}
                          onClick={() => handleItemClick(item)}
                          onDelete={() => handleDeleteClick(item)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className={clsx(
                  "w-24 h-24 rounded-full flex items-center justify-center mb-6 text-gray-400",
                  isDark ? "bg-gray-800" : "bg-gray-100",
                )}
              >
                <BellOff className="w-10 h-10" />
              </div>
              <h3 className="text-[2em] font-bold text-shortblack mb-2">
                {t("notificationsPage.noNotifications")}
              </h3>
              <p className="text-[1.5em] text-grays max-w-md leading-relaxed">
                {search
                  ? t("notificationsPage.noSearchResults", { query: search })
                  : statusFilter !== "all"
                    ? statusFilter === "unread"
                      ? t("notificationsPage.noUnreadNotifs")
                      : t("notificationsPage.noReadNotifs")
                    : t("notificationsPage.noNotifsYet")}
              </p>
              {(search || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setSearch("");
                    setPage(1);
                  }}
                  className="mt-6 text-[1.4em] font-semibold text-bluelight hover:underline"
                >
                  {t("notificationsPage.resetFilter")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <NotificationDetailModal
        isOpen={!!selectedNotif}
        onClose={() => setSelectedNotif(null)}
        notification={selectedNotif}
        onDelete={() => {
          if (selectedNotif) {
            handleDeleteClick(selectedNotif);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
