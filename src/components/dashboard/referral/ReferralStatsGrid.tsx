"use client";

import { motion } from "motion/react";
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import type { ReferralStats } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";
import clsx from "clsx";

interface ReferralStatsGridProps {
  stats: ReferralStats | null;
}

export default function ReferralStatsGrid({ stats }: ReferralStatsGridProps) {
  const { format: formatCurrency } = useCurrency();

  const statsData = [
    {
      icon: DollarSign,
      label: "Pendapatan Referral",
      value: formatCurrency(stats?.totalEarnings || 0),
      subLabel: "Total komisi",
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      shadowColor: "shadow-emerald-200",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
    },
    {
      icon: Users,
      label: "Total Diundang",
      value: `${stats?.totalReferred || 0}`,
      subLabel: "User terdaftar",
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      shadowColor: "shadow-blue-200",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      icon: Activity,
      label: "User Aktif",
      value: `${stats?.activeReferred || 0}`,
      subLabel: "Menghasilkan komisi",
      gradient: "from-orange-500 to-amber-600",
      bgLight: "bg-orange-50",
      shadowColor: "shadow-orange-200",
      textColor: "text-orange-600",
      borderColor: "border-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-figtree">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            className={clsx(
              "relative bg-white p-6 rounded-3xl shadow-sm border overflow-hidden",
              "hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
              stat.borderColor
            )}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 opacity-10">
              <div
                className={clsx(
                  "w-full h-full rounded-full bg-gradient-to-br",
                  stat.gradient
                )}
              />
            </div>

            <div className="relative flex items-center gap-5">
              {/* Icon */}
              <div
                className={clsx(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br",
                  stat.gradient,
                  stat.shadowColor
                )}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-[1.2em] text-grays mb-1">{stat.label}</p>
                <h3 className="text-[2.4em] font-bold text-shortblack font-manrope leading-none">
                  {stat.value}
                </h3>
                <p className={clsx("text-[1.1em] mt-1", stat.textColor)}>
                  {stat.subLabel}
                </p>
              </div>

              {/* Trend indicator */}
              <div className={clsx("p-2 rounded-xl", stat.bgLight)}>
                <TrendingUp className={clsx("w-5 h-5", stat.textColor)} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
