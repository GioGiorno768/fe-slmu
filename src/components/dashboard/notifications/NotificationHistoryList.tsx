// src/components/dashboard/notifications/NotificationHistoryList.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Filter, Search, ChevronDown, Check, BellOff } from "lucide-react";
import NotificationHistoryItem from "./NotificationHistoryItem";
import NotificationDetailModal from "./NotificationDetailModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Pagination from "@/components/dashboard/Pagination";
import type { NotificationItem } from "@/types/type";
import clsx from "clsx";
import { useAlert } from "@/hooks/useAlert";

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
  const { showAlert } = useAlert();

  // State UI lokal
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const filters: { id: StatusFilterType; label: string }[] = [
    { id: "all", label: "Semua Notifikasi" },
    { id: "unread", label: "Belum Dibaca" },
    { id: "read", label: "Sudah Dibaca" },
  ];

  // Combine pinned + regular and filter by search locally (quick filter)
  const allNotifications = useMemo(() => {
    const combined = [...pinnedNotifications, ...notifications];
    if (!search.trim()) return combined;

    const searchLower = search.toLowerCase();
    return combined.filter(
      (n) =>
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower)
    );
  }, [pinnedNotifications, notifications, search]);

  // Group by date
  const groupedData = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {};
    allNotifications.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString("id-ID", {
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
      showAlert("Notifikasi berhasil dihapus.", "success");

      // Close modals
      if (selectedNotif?.id === deleteTarget.id) {
        setSelectedNotif(null);
      }
      setDeleteTarget(null);
    } catch {
      showAlert("Gagal menghapus notifikasi.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-8 font-figtree">
        {/* --- Header: Search & Filter --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {/* Search Input */}
          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder="Cari notifikasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight text-[1.4em] text-shortblack placeholder:text-gray-400 transition-all shadow-sm"
            />
          </div>

          {/* Dropdown Filter */}
          <div className="relative w-full md:w-auto z-20" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between w-full md:w-[220px] px-4 py-3 bg-blues rounded-xl text-[1.4em] font-medium text-shortblack hover:bg-blue-100/50 transition-colors border border-transparent focus:border-bluelight focus:ring-2 focus:ring-bluelight/20"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-bluelight" />
                <span className="truncate">{activeLabel}</span>
              </div>
              <ChevronDown
                className={clsx(
                  "w-5 h-5 text-grays transition-transform duration-200",
                  isFilterOpen && "rotate-180"
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
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1.5 min-w-[220px]"
                >
                  {filters.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setStatusFilter(f.id);
                        setIsFilterOpen(false);
                      }}
                      className={clsx(
                        "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[1.3em] transition-colors text-left",
                        statusFilter === f.id
                          ? "bg-blue-50 text-bluelight font-bold"
                          : "text-shortblack hover:bg-gray-50"
                      )}
                    >
                      <span>{f.label}</span>
                      {statusFilter === f.id && <Check className="w-4 h-4" />}
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
              Loading notifications...
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
                  <div className="sticky top-[80px] z-10 py-4 bg-slate-50/95 backdrop-blur-sm mb-4">
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
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                <BellOff className="w-10 h-10" />
              </div>
              <h3 className="text-[2em] font-bold text-shortblack mb-2">
                Tidak ada notifikasi
              </h3>
              <p className="text-[1.5em] text-grays max-w-md leading-relaxed">
                {search
                  ? `Tidak ada hasil untuk "${search}"`
                  : statusFilter !== "all"
                  ? `Tidak ada notifikasi ${
                      statusFilter === "unread"
                        ? "yang belum dibaca"
                        : "yang sudah dibaca"
                    }`
                  : "Belum ada notifikasi untuk ditampilkan."}
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
                  Reset Filter
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
