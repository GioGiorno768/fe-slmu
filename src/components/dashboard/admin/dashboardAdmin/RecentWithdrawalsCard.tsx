"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  Copy,
  Check,
} from "lucide-react";
import clsx from "clsx";
import type { RecentWithdrawal } from "@/types/type";
import { Link, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

interface RecentWithdrawalsCardProps {
  withdrawals: RecentWithdrawal[];
  isLoading: boolean;
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
  onApprove?: (id: string) => void;
}

export default function RecentWithdrawalsCard({
  withdrawals,
  isLoading,
  currentFilter = "all",
  onFilterChange,
  onApprove,
}: RecentWithdrawalsCardProps) {
  const t = useTranslations("AdminDashboard.RecentWithdrawals");
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onApprove) {
      onApprove(id);
    }
  };

  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
    setActiveDropdown(false);
  };

  // Limit to 7 items
  const displayedWithdrawals = withdrawals.slice(0, 7);

  if (isLoading) {
    return (
      <div
        className={clsx(
          "p-8 rounded-3xl border h-[400px] animate-pulse",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
        )}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className={clsx(
        "p-6 md:p-8 rounded-3xl border shadow-sm relative flex flex-col h-full text-[10px]",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
      )}
    >
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-[2em] md:text-[2em] font-bold text-shortblack">
          {t("title")}
        </h3>
        <Link
          href="/admin/withdrawals"
          className="text-[1.4em] font-medium text-bluelight hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          <span>{t("viewAll")}</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div
        onWheel={(e) => e.stopPropagation()}
        className={clsx(
          "space-y-3 overflow-y-auto pr-2 h-[400px] scrollbar-thin scrollbar-track-transparent",
          isDark ? "scrollbar-thumb-gray-700" : "scrollbar-thumb-gray-200"
        )}
      >
        {displayedWithdrawals.length === 0 ? (
          <p className="text-center text-grays py-8 text-[1.4em]">
            {t("noRequests")}
          </p>
        ) : (
          displayedWithdrawals.map((wd) => (
            <div
              key={wd.id}
              onClick={() => router.push(`/admin/withdrawals?id=${wd.id}`)}
              className={clsx(
                "flex items-center justify-between p-3 md:p-4 rounded-2xl transition-colors group cursor-pointer border border-transparent",
                isDark
                  ? "hover:bg-subcard hover:border-gray-800"
                  : "hover:bg-gray-50 hover:border-gray-100"
              )}
            >
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                {/* Avatar with fallback */}
                {wd.user.avatar ? (
                  <img
                    src={wd.user.avatar}
                    alt={wd.user.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                    {wd.user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[1.4em] md:text-[1.6em] font-bold text-shortblack group-hover:text-bluelight transition-colors truncate">
                      {wd.user.name}
                    </h4>
                    <button
                      onClick={(e) => handleCopy(e, wd.id, wd.id)}
                      className="text-gray-400 hover:text-blue-500 transition-colors shrink-0"
                      title="Copy Transaction ID"
                    >
                      {copiedId === wd.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[1.2em] md:text-[1.4em] text-grays mt-0.5">
                    <span className="capitalize truncate max-w-[80px]">
                      {wd.method}
                    </span>
                    <span>•</span>
                    <span
                      title={formatFullDate(wd.date)}
                      className="whitespace-nowrap"
                    >
                      {formatDate(wd.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-3 shrink-0 ml-2">
                <div className="flex flex-col items-end">
                  <p className="text-[1.4em] md:text-[1.6em] font-bold text-shortblack">
                    {formatCurrency(wd.amount)}
                  </p>
                  <div
                    className={clsx(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[1.2em] font-medium mt-1",
                      wd.status === "pending"
                        ? "bg-yellow-50 text-yellow-600"
                        : wd.status === "approved"
                        ? "bg-blue-50 text-blue-600"
                        : wd.status === "paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {wd.status === "pending" && <Clock className="w-3 h-3" />}
                    {wd.status === "approved" && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {wd.status === "paid" && <Banknote className="w-3 h-3" />}
                    {wd.status === "rejected" && (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span className="capitalize hidden sm:inline">
                      {wd.status}
                    </span>
                  </div>
                  {wd.processedByName && (
                    <span className="text-[1em] text-grays mt-0.5 hidden sm:inline-block">
                      {t("by")} {wd.processedByName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        href="/admin/withdrawals"
        className={clsx(
          "w-full mt-4 py-3 text-[1.4em] md:text-[1.6em] font-medium rounded-xl transition-all flex items-center justify-center gap-2 shrink-0",
          isDark
            ? "text-grays hover:text-tx-blue-dashboard hover:bg-subcard"
            : "text-grays hover:text-bluelight hover:bg-blue-50"
        )}
      >
        <span>{t("viewAll")}</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
