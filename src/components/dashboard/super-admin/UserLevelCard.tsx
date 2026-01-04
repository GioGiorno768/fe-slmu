"use client";

import { motion } from "motion/react";
import {
  Pencil,
  Trash2,
  Check,
  DollarSign,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { Shield, Star, Trophy, Gem, Rocket, Crown } from "lucide-react";
import clsx from "clsx";
import type { LevelConfig } from "@/services/manageLevelsService";

// Icon map
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

interface UserLevelCardProps {
  level: LevelConfig;
  index: number;
  onEdit: (level: LevelConfig) => void;
  onDelete: (level: LevelConfig) => void;
}

export default function UserLevelCard({
  level,
  index,
  onEdit,
  onDelete,
}: UserLevelCardProps) {
  const Icon = getIcon(level.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onEdit(level)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          title="Edit Level"
        >
          <Pencil className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => onDelete(level)}
          className="p-2 rounded-xl hover:bg-red-50 transition-colors"
          title="Delete Level"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* Level Header */}
      <div className="text-center mb-5">
        <div
          className={clsx(
            "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 shadow-inner",
            level.bgColor
          )}
        >
          <Icon className={clsx("w-8 h-8", level.iconColor)} />
        </div>
        <h3 className="text-[2em] font-bold text-shortblack">{level.name}</h3>
        <p className="text-[1.2em] text-grays">ID: {level.id}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-gray-100">
          <DollarSign className="w-4 h-4 mx-auto text-gray-400 mb-1" />
          <p className="text-[1.6em] font-bold text-shortblack">
            ${level.minEarnings}
          </p>
          <p className="text-[1em] text-grays">Min Earnings</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-gray-100">
          <TrendingUp className="w-4 h-4 mx-auto text-gray-400 mb-1" />
          <p className={clsx("text-[1.6em] font-bold", level.iconColor)}>
            +{level.cpmBonus}%
          </p>
          <p className="text-[1em] text-grays">CPM Bonus</p>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <p className="text-[1.2em] font-semibold text-grays uppercase tracking-wider mb-2">
          Benefits ({level.benefits.length})
        </p>
        <ul className="space-y-2">
          {level.benefits.slice(0, 4).map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-[1.3em]">
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span className="text-shortblack">{benefit}</span>
            </li>
          ))}
          {level.benefits.length > 4 && (
            <li className="text-[1.2em] text-grays pl-6">
              +{level.benefits.length - 4} more benefits...
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
