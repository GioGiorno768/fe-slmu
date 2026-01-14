"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Calendar, Layers, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import type { AdminLinkFilters } from "@/types/type";
import { useTheme } from "next-themes";

interface LinkFiltersProps {
  filters: AdminLinkFilters;
  setFilters: (f: AdminLinkFilters) => void;
}

export default function LinkFilters({ filters, setFilters }: LinkFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAdsOpen, setIsAdsOpen] = useState(false);
  const [isOwnerOpen, setIsOwnerOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const sortRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const adsRef = useRef<HTMLDivElement>(null);
  const ownerRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
      if (adsRef.current && !adsRef.current.contains(event.target as Node)) {
        setIsAdsOpen(false);
      }
      if (
        ownerRef.current &&
        !ownerRef.current.contains(event.target as Node)
      ) {
        setIsOwnerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Views", value: "most_views" },
    { label: "Least Views", value: "least_views" },
    { label: "Most Earnings", value: "most_earnings" },
    { label: "Least Earnings", value: "least_earnings" },
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Blocked", value: "disabled" },
  ];

  const adsOptions = [
    { label: "All Levels", value: "all" },
    { label: "Level 1", value: "level1" },
    { label: "Level 2", value: "level2" },
    { label: "Level 3", value: "level3" },
    { label: "Level 4", value: "level4" },
  ];

  const ownerOptions = [
    { label: "All Links", value: "all" },
    { label: "Guest Only", value: "guest" },
    { label: "User Only", value: "user" },
  ];

  const getSortLabel = () => {
    return sortOptions.find((o) => o.value === filters.sort)?.label || "Newest";
  };

  const getStatusLabel = () => {
    return (
      statusOptions.find((o) => o.value === filters.status)?.label ||
      "All Status"
    );
  };

  const getAdsLabel = () => {
    return (
      adsOptions.find((o) => o.value === filters.adsLevel)?.label ||
      "All Levels"
    );
  };

  const getOwnerLabel = () => {
    return (
      ownerOptions.find((o) => o.value === filters.ownerType)?.label ||
      "All Links"
    );
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border p-6 mb-6",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
      )}
    >
      <div className="flex flex-col gap-5">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h3 className="text-[1.8em] font-bold text-shortblack">
            Manage Links
          </h3>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder="Search link, alias, or title..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className={clsx(
                "w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] transition-all",
                isDark
                  ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                  : "bg-white border-gray-200 text-shortblack"
              )}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsStatusOpen(false);
                setIsAdsOpen(false);
              }}
              className={clsx(
                "flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors text-[1.4em] min-w-[150px] justify-between",
                isDark
                  ? "bg-subcard border-gray-700 hover:bg-gray-700"
                  : "bg-white border-gray-200 hover:bg-slate-50"
              )}
            >
              <Calendar className="w-4 h-4 text-grays" />
              <span
                className={clsx(
                  "font-medium",
                  isDark ? "text-white" : "text-shortblack"
                )}
              >
                {getSortLabel()}
              </span>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-grays transition-transform",
                  isSortOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={clsx(
                    "absolute top-full left-0 mt-2 w-full rounded-xl border shadow-lg z-20 overflow-hidden",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, sort: opt.value });
                        setIsSortOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] transition-colors",
                        filters.sort === opt.value
                          ? isDark
                            ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard font-medium"
                            : "bg-blues text-bluelight font-medium"
                          : isDark
                          ? "text-grays hover:text-tx-blue-dashboard hover:bg-subcard"
                          : "text-shortblack hover:bg-blues"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsSortOpen(false);
                setIsAdsOpen(false);
              }}
              className={clsx(
                "flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors text-[1.4em] min-w-[140px] justify-between",
                isDark
                  ? "bg-subcard border-gray-700 hover:bg-gray-700"
                  : "bg-white border-gray-200 hover:bg-slate-50"
              )}
            >
              <Filter className="w-4 h-4 text-grays" />
              <span
                className={clsx(
                  "font-medium",
                  isDark ? "text-white" : "text-shortblack"
                )}
              >
                {getStatusLabel()}
              </span>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-grays transition-transform",
                  isStatusOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isStatusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={clsx(
                    "absolute top-full right-0 mt-2 w-40 rounded-xl border shadow-lg z-20 overflow-hidden",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, status: opt.value });
                        setIsStatusOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] transition-colors",
                        filters.status === opt.value
                          ? isDark
                            ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard font-medium"
                            : "bg-blues text-bluelight font-medium"
                          : isDark
                          ? "text-grays hover:text-tx-blue-dashboard hover:bg-subcard"
                          : "text-shortblack hover:bg-blues"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ads Level Filter Dropdown */}
          <div className="relative" ref={adsRef}>
            <button
              onClick={() => {
                setIsAdsOpen(!isAdsOpen);
                setIsSortOpen(false);
                setIsStatusOpen(false);
              }}
              className={clsx(
                "flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors text-[1.4em] min-w-[140px] justify-between",
                isDark
                  ? "bg-subcard border-gray-700 hover:bg-gray-700"
                  : "bg-white border-gray-200 hover:bg-slate-50"
              )}
            >
              <Layers className="w-4 h-4 text-grays" />
              <span
                className={clsx(
                  "font-medium",
                  isDark ? "text-white" : "text-shortblack"
                )}
              >
                {getAdsLabel()}
              </span>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-grays transition-transform",
                  isAdsOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isAdsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={clsx(
                    "absolute top-full right-0 mt-2 w-40 rounded-xl border shadow-lg z-20 overflow-hidden",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  {adsOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, adsLevel: opt.value });
                        setIsAdsOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] transition-colors",
                        filters.adsLevel === opt.value
                          ? isDark
                            ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard font-medium"
                            : "bg-blues text-bluelight font-medium"
                          : isDark
                          ? "text-grays hover:text-tx-blue-dashboard hover:bg-subcard"
                          : "text-shortblack hover:bg-blues"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Owner Type Filter Dropdown */}
          <div className="relative" ref={ownerRef}>
            <button
              onClick={() => {
                setIsOwnerOpen(!isOwnerOpen);
                setIsSortOpen(false);
                setIsStatusOpen(false);
                setIsAdsOpen(false);
              }}
              className={clsx(
                "flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors text-[1.4em] min-w-[140px] justify-between",
                isDark
                  ? "bg-subcard border-gray-700 hover:bg-gray-700"
                  : "bg-white border-gray-200 hover:bg-slate-50"
              )}
            >
              <Filter className="w-4 h-4 text-grays" />
              <span
                className={clsx(
                  "font-medium",
                  isDark ? "text-white" : "text-shortblack"
                )}
              >
                {getOwnerLabel()}
              </span>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-grays transition-transform",
                  isOwnerOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isOwnerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={clsx(
                    "absolute top-full right-0 mt-2 w-40 rounded-xl border shadow-lg z-20 overflow-hidden",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  {ownerOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, ownerType: opt.value });
                        setIsOwnerOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] transition-colors",
                        filters.ownerType === opt.value
                          ? isDark
                            ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard font-medium"
                            : "bg-blues text-bluelight font-medium"
                          : isDark
                          ? "text-grays hover:text-tx-blue-dashboard hover:bg-subcard"
                          : "text-shortblack hover:bg-blues"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
