"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  Activity,
  Megaphone,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import type { MemberLinkFilters } from "@/types/type";

interface LinkFiltersProps {
  filters: MemberLinkFilters;
  setFilters: (f: MemberLinkFilters) => void;
}

export default function LinkFilters({ filters, setFilters }: LinkFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

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
      if (
        levelRef.current &&
        !levelRef.current.contains(event.target as Node)
      ) {
        setIsLevelOpen(false);
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
    { label: "Disabled", value: "disabled" },
    { label: "Expired", value: "expired" },
    { label: "Password Protected", value: "password" },
  ];

  const levelOptions = [
    { label: "All Levels", value: "all" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Aggressive", value: "aggressive" },
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

  const getLevelLabel = () => {
    return (
      levelOptions.find((o) => o.value === filters.adsLevel)?.label ||
      "All Levels"
    );
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 mb-6 shadow-sm shadow-slate-500/50">
      <div className="flex flex-col gap-5">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h3 className="text-[1.8em] font-bold text-shortblack">My Links</h3>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
            <input
              type="text"
              placeholder="Search by title, URL, or alias..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-subcard border border-gray-dashboard/30 focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-[1.4em] text-shortblack placeholder:text-grays transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsStatusOpen(false);
                setIsLevelOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-dashboard/30 bg-subcard hover:bg-blues transition-colors text-[1.4em] min-w-[130px] justify-between"
            >
              <Calendar className="w-4 h-4 text-grays" />
              <span className="text-shortblack font-medium">
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
                  className="absolute top-full left-0 mt-2 w-44 bg-card rounded-xl border border-gray-dashboard/30 shadow-lg z-20 overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, sort: opt.value });
                        setIsSortOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-subcard transition-colors",
                        filters.sort === opt.value
                          ? "bg-subcard text-bluelight font-medium"
                          : "text-shortblack"
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
                setIsLevelOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-dashboard/30 bg-subcard hover:bg-blues transition-colors text-[1.4em] min-w-[140px] justify-between"
            >
              <Activity className="w-4 h-4 text-grays" />
              <span className="text-shortblack font-medium">
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
                  className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl border border-gray-dashboard/30 shadow-lg z-20 overflow-hidden"
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, status: opt.value });
                        setIsStatusOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-subcard transition-colors",
                        filters.status === opt.value
                          ? "bg-subcard text-bluelight font-medium"
                          : "text-shortblack"
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
          <div className="relative" ref={levelRef}>
            <button
              onClick={() => {
                setIsLevelOpen(!isLevelOpen);
                setIsSortOpen(false);
                setIsStatusOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-dashboard/30 bg-subcard hover:bg-blues transition-colors text-[1.4em] min-w-[140px] justify-between"
            >
              <Megaphone className="w-4 h-4 text-grays" />
              <span className="text-shortblack font-medium">
                {getLevelLabel()}
              </span>
              <ChevronDown
                className={clsx(
                  "w-4 h-4 text-grays transition-transform",
                  isLevelOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {isLevelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-card rounded-xl border border-gray-dashboard/30 shadow-lg z-20 overflow-hidden"
                >
                  {levelOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters({ ...filters, adsLevel: opt.value });
                        setIsLevelOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-3 text-left text-[1.3em] hover:bg-subcard transition-colors",
                        filters.adsLevel === opt.value
                          ? "bg-subcard text-bluelight font-medium"
                          : "text-shortblack"
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
