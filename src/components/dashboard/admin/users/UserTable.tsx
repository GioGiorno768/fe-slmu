"use client";

import { Search, ChevronDown, Filter, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import type { AdminUser, UserStatus } from "@/types/type";
import { useClickOutside } from "@/hooks/useClickOutside";
import UserListCard from "./UserListCard";
import Pagination from "@/components/dashboard/Pagination";
import Spinner from "../../Spinner";
import { useTheme } from "next-themes";

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onToggleStatus: (id: string, status: UserStatus) => void;
  // Selection Props
  selectedIds: Set<string>;
  isAllSelected: boolean; // <--- New Prop
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onViewDetail?: (userId: string) => void; // <--- Add this
  detailBasePath?: string; // <--- Add this for Link-based navigation (e.g., "/super-admin/manage-user")
  onSuspend?: (userId: string, currentStatus: UserStatus) => void; // <--- Add for suspend/unsuspend
}

export default function UserTable({
  users,
  isLoading,
  page,
  setPage,
  totalPages,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onToggleStatus,
  selectedIds,
  isAllSelected, // <--- Destructure
  onToggleSelection,
  onSelectAll,
  onViewDetail, // <--- Add this
  detailBasePath, // <--- Add this
  onSuspend, // <--- Add this
}: UserTableProps) {
  // Theme
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Filter Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useClickOutside(filterRef, () => setIsFilterOpen(false));

  const filterOptions = [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Aktif Aja" },
    { value: "suspended", label: "Yg Kena Suspend" },
  ];

  const currentFilterLabel =
    filterOptions.find((o) => o.value === statusFilter)?.label ||
    "Semua Status";

  // const isAllSelected = users.length > 0 && selectedIds.size === users.length; // REMOVE THIS LOCAL CALC

  return (
    <div className="space-y-6 font-figtree">
      {/* HEADER & FILTERS */}
      <div
        className={clsx(
          "rounded-3xl shadow-sm border p-8 flex flex-col md:flex-row justify-between items-center gap-6",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
        )}
      >
        <h3 className="text-[1.8em] font-bold text-shortblack">
          User Management
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto ">
          {/* Custom Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={clsx(
                "flex items-center gap-3 px-5 py-3 rounded-xl border text-[1.4em] font-medium transition-colors w-full sm:w-auto justify-between",
                isDark
                  ? "bg-subcard border-gray-700 text-white hover:bg-gray-700"
                  : "bg-blues border-blue-100 text-shortblack hover:bg-blue-50"
              )}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-bluelight" />
                <span>{currentFilterLabel}</span>
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
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={clsx(
                    "absolute top-full mt-2 left-0 w-full sm:w-56 rounded-xl shadow-xl border overflow-hidden p-1.5 z-40",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-100"
                  )}
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsFilterOpen(false);
                      }}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-lg text-[1.3em] font-medium transition-colors flex items-center justify-between",
                        statusFilter === option.value
                          ? isDark
                            ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard"
                            : "bg-blue-50 text-bluelight"
                          : isDark
                          ? "text-grays hover:text-tx-blue-dashboard hover:bg-subcard"
                          : "text-shortblack hover:bg-slate-50"
                      )}
                    >
                      {option.label}
                      {statusFilter === option.value && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={clsx(
                "w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] transition-all",
                isDark
                  ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                  : "bg-white border-gray-200 text-shortblack"
              )}
            />
          </div>
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <div
            className={clsx(
              "p-12 text-center text-grays rounded-3xl border text-[1.4em]",
              isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
            )}
          >
            Gak nemu user yang dicari.
          </div>
        ) : (
          users.map((user) => (
            <UserListCard
              key={user.id}
              user={user}
              isSelected={isAllSelected || selectedIds.has(user.id)}
              onClick={() => onToggleSelection(user.id)}
              onViewDetail={
                onViewDetail ? () => onViewDetail(user.id) : undefined
              }
              detailHref={
                detailBasePath ? `${detailBasePath}/${user.id}` : undefined
              }
              onSuspend={onSuspend} // <--- Pass suspend handler
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && users.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
