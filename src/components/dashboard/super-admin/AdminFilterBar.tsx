"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { useTheme } from "next-themes";

interface AdminFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
}

export default function AdminFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
}: AdminFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<"status" | "role" | null>(
    null
  );
  const statusRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const hasActiveFilters =
    search || statusFilter !== "all" || roleFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    onRoleChange("all");
  };

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node) &&
        openDropdown === "status"
      ) {
        setOpenDropdown(null);
      }
      if (
        roleRef.current &&
        !roleRef.current.contains(event.target as Node) &&
        openDropdown === "role"
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const statusOptions = [
    { value: "all", label: "All Status", icon: "" },
    { value: "active", label: "Active", icon: "✓" },
    { value: "suspended", label: "Suspended", icon: "✗" },
  ];

  const roleOptions = [
    { value: "all", label: "All Roles", icon: "" },
    { value: "admin", label: "Admin", icon: "👤" },
    { value: "super-admin", label: "Super Admin", icon: "👑" },
  ];

  const getStatusLabel = () => {
    const option = statusOptions.find((opt) => opt.value === statusFilter);
    return option ? (
      <span className="flex items-center gap-2">
        {option.icon && <span>{option.icon}</span>}
        {option.label}
      </span>
    ) : (
      "All Status"
    );
  };

  const getRoleLabel = () => {
    const option = roleOptions.find((opt) => opt.value === roleFilter);
    return option ? (
      <span className="flex items-center gap-2">
        {option.icon && <span>{option.icon}</span>}
        {option.label}
      </span>
    ) : (
      "All Roles"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "rounded-2xl border shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-300",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
      )}
    >
      <div className="flex flex-col md:flex-row gap-4 text-[0.9em] font-figtree">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <Search
            className={clsx(
              "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:text-bluelight transition-colors duration-200",
              isDark ? "text-gray-500" : "text-gray-400"
            )}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or username..."
            className={clsx(
              "w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight transition-all duration-200 text-[1.6em]",
              isDark
                ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500 hover:border-gray-600"
                : "border-gray-200 hover:border-gray-300"
            )}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors duration-200",
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              )}
            >
              <X
                className={clsx(
                  "w-4 h-4",
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-400 hover:text-gray-600"
                )}
              />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div ref={statusRef} className="relative min-w-[160px] z-20">
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "status" ? null : "status")
            }
            className={clsx(
              "flex items-center justify-between gap-2 w-full text-[1.6em] px-4 py-3 rounded-xl border transition-all duration-200 font-medium",
              isDark
                ? statusFilter !== "all"
                  ? "bg-blue-500/20 border-bluelight text-bluelight"
                  : "bg-subcard border-gray-700 text-white hover:bg-gray-700"
                : statusFilter !== "all"
                ? "border-bluelight bg-blue-50"
                : "border-gray-200 bg-white hover:bg-blues"
            )}
          >
            <span
              className={clsx(
                "flex items-center gap-2",
                statusFilter !== "all" && "text-bluelight font-semibold"
              )}
            >
              <Filter className="w-4 h-4" />
              {getStatusLabel()}
            </span>
            <ChevronDown
              className={clsx(
                "w-5 h-5 transition-transform duration-200",
                openDropdown === "status" && "rotate-180",
                statusFilter !== "all"
                  ? "text-bluelight"
                  : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
              )}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "status" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className={clsx(
                  "absolute top-full right-0 mt-2 p-2 w-48 rounded-xl shadow-lg border",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-100"
                )}
              >
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onStatusChange(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={clsx(
                      "block w-full text-left text-[1.5em] px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2",
                      statusFilter === opt.value
                        ? isDark
                          ? "text-bluelight font-semibold bg-blue-500/20"
                          : "text-bluelight font-semibold bg-blue-50"
                        : isDark
                        ? "text-white hover:bg-subcard"
                        : "text-shortblack hover:bg-blues"
                    )}
                  >
                    {opt.icon && <span className="w-5">{opt.icon}</span>}
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Role Dropdown */}
        <div ref={roleRef} className="relative min-w-[180px] z-20">
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(openDropdown === "role" ? null : "role")
            }
            className={clsx(
              "flex items-center justify-between gap-2 w-full text-[1.6em] px-4 py-3 rounded-xl border transition-all duration-200 font-medium",
              isDark
                ? roleFilter !== "all"
                  ? "bg-blue-500/20 border-bluelight text-bluelight"
                  : "bg-subcard border-gray-700 text-white hover:bg-gray-700"
                : roleFilter !== "all"
                ? "border-bluelight bg-blue-50"
                : "border-gray-200 bg-white hover:bg-blues"
            )}
          >
            <span
              className={clsx(
                "flex items-center gap-2",
                roleFilter !== "all" && "text-bluelight font-semibold"
              )}
            >
              <Filter className="w-4 h-4" />
              {getRoleLabel()}
            </span>
            <ChevronDown
              className={clsx(
                "w-5 h-5 transition-transform duration-200",
                openDropdown === "role" && "rotate-180",
                roleFilter !== "all"
                  ? "text-bluelight"
                  : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
              )}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "role" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className={clsx(
                  "absolute top-full right-0 mt-2 p-2 w-52 rounded-xl shadow-lg border",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-100"
                )}
              >
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onRoleChange(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={clsx(
                      "block w-full text-left text-[1.5em] px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2",
                      roleFilter === opt.value
                        ? isDark
                          ? "text-bluelight font-semibold bg-blue-500/20"
                          : "text-bluelight font-semibold bg-blue-50"
                        : isDark
                        ? "text-white hover:bg-subcard"
                        : "text-shortblack hover:bg-blues"
                    )}
                  >
                    {opt.icon && <span className="w-5">{opt.icon}</span>}
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearFilters}
            className={clsx(
              "px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap hover:shadow-sm text-[1.6em]",
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}
          >
            <X className="w-4 h-4" />
            Clear
          </motion.button>
        )}
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={clsx(
            "mt-3 pt-3 border-t",
            isDark ? "border-gray-700" : "border-gray-100"
          )}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className={clsx(
                "text-[1.3em] font-medium",
                isDark ? "text-gray-500" : "text-gray-500"
              )}
            >
              Active filters:
            </span>
            {search && (
              <span
                className={clsx(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[1.3em] font-medium",
                  isDark
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                Search: "{search}"
              </span>
            )}
            {statusFilter !== "all" && (
              <span
                className={clsx(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[1.3em] font-medium",
                  isDark
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                Status: {statusFilter}
              </span>
            )}
            {roleFilter !== "all" && (
              <span
                className={clsx(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[1.3em] font-medium",
                  isDark
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-50 text-blue-700"
                )}
              >
                Role: {roleFilter}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
