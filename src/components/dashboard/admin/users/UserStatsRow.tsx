"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import type { AdminUserStats } from "@/types/type";
import { useTheme } from "next-themes";

interface UserStatsRowProps {
  stats: AdminUserStats | null;
  isLoading: boolean;
}

export default function UserStatsRow({ stats, isLoading }: UserStatsRowProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const formatNumber = (num: number) => num.toLocaleString("en-US");
  const formatCompact = (num: number) =>
    Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);

  const cards = [
    {
      title: "Total Users",
      value: stats ? formatCompact(stats.totalUsers.count) : "...",
      trend: stats?.totalUsers.trend,
      icon: Users,
      color: "blue",
      desc: "Registered Accounts",
    },
    {
      title: "Active Today",
      value: stats ? formatNumber(stats.activeToday.count) : "...",
      trend: stats?.activeToday.trend,
      icon: UserCheck,
      color: "green",
      desc: "Login in 24h",
    },
    {
      title: "Suspended Users",
      value: stats ? formatNumber(stats.suspendedUsers.count) : "...",
      trend: stats?.suspendedUsers.trend,
      icon: UserX,
      color: "red",
      desc: "Restricted Access",
    },
  ];

  // Helper Styles
  const getStyles = (color: string) => {
    switch (color) {
      case "blue":
        return {
          text: isDark ? "text-blue-400" : "text-blue-600",
          bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
          border: isDark ? "border-blue-500/20" : "border-blue-100",
          iconBg: isDark ? "bg-blue-500/20" : "bg-blue-100",
        };
      case "green":
        return {
          text: isDark ? "text-emerald-400" : "text-emerald-600",
          bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
          border: isDark ? "border-emerald-500/20" : "border-emerald-100",
          iconBg: isDark ? "bg-emerald-500/20" : "bg-emerald-100",
        };
      case "red":
        return {
          text: isDark ? "text-red-400" : "text-red-600",
          bg: isDark ? "bg-red-500/10" : "bg-red-50",
          border: isDark ? "border-red-500/20" : "border-red-100",
          iconBg: isDark ? "bg-red-500/20" : "bg-red-100",
        };
      case "orange":
        return {
          text: isDark ? "text-amber-400" : "text-amber-600",
          bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
          border: isDark ? "border-amber-500/20" : "border-amber-100",
          iconBg: isDark ? "bg-amber-500/20" : "bg-amber-100",
        };
      default:
        return {
          text: isDark ? "text-gray-400" : "text-gray-600",
          bg: isDark ? "bg-gray-500/10" : "bg-gray-50",
          border: isDark ? "border-gray-500/20" : "border-gray-100",
          iconBg: isDark ? "bg-gray-500/20" : "bg-gray-100",
        };
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={clsx(
              "h-[120px] rounded-2xl border shadow-sm flex items-center justify-center",
              isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
            )}
          >
            <Loader2 className="w-6 h-6 animate-spin text-bluelight/30" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 font-figtree">
      {cards.map((card, index) => {
        const style = getStyles(card.color);
        const isPositive = card.trend && card.trend > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        const trendColor = isPositive ? "text-emerald-600" : "text-red-500";

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={clsx(
              "relative p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group",
              isDark ? "bg-card" : "bg-white",
              style.border
            )}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={clsx("p-3 rounded-xl", style.iconBg, style.text)}>
                <card.icon className="w-6 h-6" />
              </div>

              {/* Trend Badge */}
              {card.trend !== undefined && (
                <div
                  className={clsx(
                    "flex items-center gap-1 text-[1.1em] font-bold px-2 py-1 rounded-lg bg-white/80 border border-gray-100 shadow-sm",
                    trendColor
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  {Math.abs(card.trend)}%
                </div>
              )}
            </div>

            <div className="relative z-10">
              <h3 className="text-[2.8em] font-bold text-shortblack leading-none mb-1 font-manrope">
                {card.value}
              </h3>
              <p className="text-[1.3em] text-grays font-medium">
                {card.title}
              </p>
              {/* Optional: Deskripsi kecil */}
              {/* <p className="text-[1em] text-gray-400 mt-1">{card.desc}</p> */}
            </div>

            {/* Dekorasi Circle di pojok */}
            <div
              className={clsx(
                "absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 pointer-events-none transition-transform duration-500 group-hover:scale-125",
                style.bg.replace("bg-", "bg-")
              )}
              style={{ backgroundColor: `var(--color-${card.color}-500)` }}
            ></div>
          </motion.div>
        );
      })}
    </div>
  );
}
