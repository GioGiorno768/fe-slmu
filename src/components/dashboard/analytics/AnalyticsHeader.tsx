// src/components/dashboard/analytics/AnalyticsHeader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BarChart3, ChevronDown, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { StatsRange } from "@/hooks/useAnalytics";

interface AnalyticsHeaderProps {
  range: StatsRange;
  onRangeChange: (range: StatsRange) => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

type FilterOption = {
  value: StatsRange;
  label: string;
};

export default function AnalyticsHeader({
  range,
  onRangeChange,
  onRefresh,
  isRefetching,
}: AnalyticsHeaderProps) {
  const t = useTranslations("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔧 Added 'lifetime' option for All Time
  const filterOptions: FilterOption[] = [
    { value: "lifetime", label: t("allTime") },
    { value: "perWeek", label: t("perWeek") },
    { value: "perMonth", label: t("perMonth") },
    { value: "perYear", label: t("perYear") },
  ];

  const currentLabel = filterOptions.find((o) => o.value === range)?.label;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 font-figtree">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Description */}
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[2.4em] font-bold text-shortblack flex items-center gap-3"
          >
            <BarChart3 className="w-7 h-7 text-bluelight" />
            {t("analytics")}
          </motion.h1>
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 text-[1.3em] text-grays"
          >
            {t("analyticsDescription")}
          </motion.p>
        </div>

        {/* Right: Filter Dropdown + Refresh Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={isRefetching}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 hover:bg-bluelight/10 border border-gray-200 hover:border-bluelight/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <motion.div
              animate={{ rotate: isRefetching ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: isRefetching ? Infinity : 0,
                ease: "linear",
              }}
            >
              <RefreshCw
                className={`w-5 h-5 ${
                  isRefetching ? "text-bluelight" : "text-grays"
                }`}
              />
            </motion.div>
          </motion.button>

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 text-[1.4em] font-semibold text-shortblack bg-gray-50 hover:bg-bluelight/10 px-6 py-3.5 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-bluelight/30"
            >
              <span>{currentLabel}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-grays" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu with Animation */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-3 p-2.5 w-max min-w-[160px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 z-20"
                >
                  {filterOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4, backgroundColor: "#f8fafc" }}
                      onClick={() => {
                        onRangeChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full text-left text-[1.3em] px-4 py-3 rounded-xl transition-colors duration-150 ${
                        range === option.value
                          ? "text-bluelight font-semibold bg-blue-50"
                          : "text-shortblack"
                      }`}
                    >
                      <span>{option.label}</span>
                      {range === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-4 h-4 text-bluelight" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
