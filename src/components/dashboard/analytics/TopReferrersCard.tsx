// src/components/dashboard/analytics/TopReferrersCard.tsx
"use client";

import { useTranslations } from "next-intl";
import {
  Loader2,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Send,
  Search,
  Link2,
  Mail,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReferrerStat } from "@/types/type";
import clsx from "clsx";

interface TopReferrersCardProps {
  data: ReferrerStat[] | null;
}

// Helper to get icon and color based on referrer name
const getReferrerConfig = (referrer: string) => {
  const lower = referrer.toLowerCase();

  if (lower.includes("google"))
    return {
      icon: Search,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-200",
    };
  if (lower.includes("facebook"))
    return {
      icon: Facebook,
      bgColor: "bg-gradient-to-br from-blue-600 to-indigo-700",
      shadowColor: "shadow-blue-200",
    };
  if (lower.includes("instagram"))
    return {
      icon: Instagram,
      bgColor: "bg-gradient-to-br from-pink-500 to-purple-600",
      shadowColor: "shadow-pink-200",
    };
  if (lower.includes("youtube"))
    return {
      icon: Youtube,
      bgColor: "bg-gradient-to-br from-red-500 to-red-600",
      shadowColor: "shadow-red-200",
    };
  if (lower.includes("whatsapp"))
    return {
      icon: MessageCircle,
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      shadowColor: "shadow-green-200",
    };
  if (lower.includes("telegram"))
    return {
      icon: Send,
      bgColor: "bg-gradient-to-br from-sky-500 to-blue-600",
      shadowColor: "shadow-sky-200",
    };
  if (lower.includes("twitter") || lower.includes("x.com"))
    return {
      icon: Globe,
      bgColor: "bg-gradient-to-br from-slate-700 to-slate-900",
      shadowColor: "shadow-slate-200",
    };
  if (lower.includes("direct") || lower.includes("email"))
    return {
      icon: Mail,
      bgColor: "bg-gradient-to-br from-slate-400 to-slate-500",
      shadowColor: "shadow-slate-200",
    };

  return {
    icon: Link2,
    bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
    shadowColor: "shadow-indigo-200",
  };
};

// Get progress bar color based on rank
const getBarColor = (index: number) => {
  switch (index) {
    case 0:
      return "from-indigo-500 to-purple-500";
    case 1:
      return "from-blue-400 to-blue-500";
    case 2:
      return "from-teal-400 to-emerald-500";
    default:
      return "from-slate-400 to-slate-500";
  }
};

export default function TopReferrersCard({ data }: TopReferrersCardProps) {
  const t = useTranslations("Dashboard");

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  // Calculate total views for header
  const totalViews = data?.reduce((sum, r) => sum + r.views, 0) || 0;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[1.6em] font-bold text-shortblack">
              {t("topReferrers")}
            </h3>
            <p className="text-[1.1em] text-grays">Traffic sources</p>
          </div>
        </div>

        {/* Total badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span className="text-[1.2em] font-bold text-indigo-700">
            {formatViews(totalViews)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 relative">
        {!data ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Link2 className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-grays text-[1.3em]">Belum ada data referrer</p>
            <p className="text-gray-400 text-[1.1em]">Mulai share link kamu!</p>
          </div>
        ) : (
          <div
            className="h-full overflow-y-auto pr-2 space-y-2 custom-scrollbar-minimal"
            onWheel={(e) => e.stopPropagation()}
          >
            {data.map((referrer, index) => {
              const config = getReferrerConfig(referrer.name);
              const Icon = config.icon;
              const displayName =
                referrer.name.toLowerCase() === "direct"
                  ? t("direct")
                  : referrer.name;

              return (
                <motion.div
                  key={referrer.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  {/* Icon Badge */}
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                      config.bgColor,
                      config.shadowColor
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Referrer Name & Progress Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[1.3em] font-semibold text-shortblack truncate group-hover:text-bluelight transition-colors">
                        {displayName}
                      </span>
                      <span className="text-[1.2em] font-bold text-bluelight ml-2">
                        {formatViews(referrer.views)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={clsx(
                          "h-full rounded-full bg-gradient-to-r",
                          getBarColor(index)
                        )}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(referrer.percentage, 2)}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: index * 0.05,
                        }}
                      />
                    </div>
                  </div>

                  {/* Percentage */}
                  <span className="text-[1.15em] font-semibold text-grays w-14 text-right shrink-0">
                    {referrer.percentage.toFixed(1)}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
