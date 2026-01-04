// src/components/dashboard/levels/LevelsGrid.tsx
"use client";

import { motion } from "motion/react";
import {
  Shield,
  Star,
  Trophy,
  Gem,
  Rocket,
  Crown,
  Check,
  Lock,
  LucideIcon,
  Sparkles,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import type { UserLevel, LevelConfig } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";

interface LevelsGridProps {
  currentLevel: UserLevel;
  levels: LevelConfig[];
}

// Icon mapper
const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  star: Star,
  trophy: Trophy,
  gem: Gem,
  rocket: Rocket,
  crown: Crown,
};

const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Shield;
};

export default function LevelsGrid({ currentLevel, levels }: LevelsGridProps) {
  const { format: formatCurrency } = useCurrency();
  const currentIndex = levels.findIndex((l) => l.id === currentLevel);

  return (
    <div className="mt-10">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-[1.2em] font-semibold text-indigo-600">
            All Levels
          </span>
        </div>
        <h2 className="text-[2.2em] font-bold text-shortblack">
          Level & Benefits
        </h2>
        <p className="text-[1.4em] text-grays mt-2">
          Unlock higher levels for better CPM rates and exclusive perks
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {levels.map((level, index) => {
          const isUnlocked = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = getIcon(level.icon);

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={clsx(
                "relative rounded-3xl p-7 border-2 transition-all duration-200",
                "hover:shadow-lg hover:-translate-y-1",
                isCurrent
                  ? "bg-white border-bluelight shadow-[0_4px_24px_rgba(59,130,246,0.2)]"
                  : isUnlocked
                  ? "bg-white border-gray-200 shadow-md"
                  : "bg-gray-50/50 border-gray-200/50 shadow-sm"
              )}
            >
              {/* Current Level Badge */}
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-bluelight text-white px-4 py-1 rounded-full text-[1.1em] font-bold shadow-lg">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    CURRENT
                  </span>
                </div>
              )}

              {/* Lock Icon */}
              {!isUnlocked && (
                <div className="absolute top-4 right-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-5">
                <div
                  className={clsx(
                    "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg",
                    isUnlocked ? level.bgColor : "bg-gray-100"
                  )}
                >
                  <Icon
                    className={clsx(
                      "w-8 h-8",
                      isUnlocked ? level.iconColor : "text-gray-400"
                    )}
                    fill={
                      level.id === "mythic" && isUnlocked
                        ? "currentColor"
                        : "none"
                    }
                  />
                </div>
                <h3
                  className={clsx(
                    "text-[2em] font-bold mb-1",
                    isUnlocked ? "text-shortblack" : "text-gray-400"
                  )}
                >
                  {level.name}
                </h3>
                <p
                  className={clsx(
                    "text-[1.3em]",
                    isUnlocked ? "text-grays" : "text-gray-400"
                  )}
                >
                  Min. Earnings {formatCurrency(level.minEarnings)}
                </p>
              </div>

              {/* CPM Bonus Card */}
              <div
                className={clsx(
                  "rounded-2xl p-4 text-center mb-5 border",
                  isUnlocked
                    ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
                    : "bg-gray-100/50 border-gray-200/50"
                )}
              >
                <p
                  className={clsx(
                    "text-[1.1em] uppercase font-semibold tracking-wider mb-1",
                    isUnlocked ? "text-grays" : "text-gray-400"
                  )}
                >
                  CPM Bonus
                </p>
                <p
                  className={clsx(
                    "text-[2.2em] font-bold",
                    isUnlocked ? level.iconColor : "text-gray-400"
                  )}
                >
                  +{level.cpmBonus}%
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-2.5">
                {level.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-[1.3em]">
                    <div
                      className={clsx(
                        "p-1 rounded-full shrink-0 mt-0.5",
                        isUnlocked
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-400"
                      )}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span
                      className={clsx(
                        isUnlocked ? "text-shortblack" : "text-gray-400"
                      )}
                    >
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
