"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Edit2,
  Crown,
  ExternalLink,
  Check,
  Power,
  PowerOff,
  MoreVertical,
  Star,
  ShieldCheck,
  Zap,
  Flame,
  Bomb,
  X,
} from "lucide-react";
import clsx from "clsx";
import type { AdLevelConfig, GlobalFeature } from "@/services/adLevelService";

interface AdLevelCardProps {
  level: AdLevelConfig;
  onEdit: (level: AdLevelConfig) => void;
  onToggleEnabled: (level: AdLevelConfig) => void;
  onSetDefault?: (level: AdLevelConfig) => void;
  isDefault?: boolean;
  onSetPopular?: (level: AdLevelConfig) => void;
  isPopular?: boolean;
  index: number;
  globalFeatures: GlobalFeature[];
}

const getThemeStyles = (theme: string) => {
  switch (theme) {
    case "green":
      return {
        border: "border-green-200",
        bg: "bg-green-50",
        text: "text-green-700",
        badge: "bg-green-100 text-green-800",
        Icon: ShieldCheck,
      };
    case "orange":
      return {
        border: "border-orange-200",
        bg: "bg-orange-50",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-800",
        Icon: Flame,
      };
    case "red":
      return {
        border: "border-red-200",
        bg: "bg-red-50",
        text: "text-red-700",
        badge: "bg-red-100 text-red-800",
        Icon: Bomb,
      };
    default: // blue
      return {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-800",
        Icon: Zap,
      };
  }
};

export default function AdLevelCard({
  level,
  onEdit,
  onToggleEnabled,
  onSetDefault,
  isDefault = false,
  onSetPopular,
  isPopular = false,
  index,
  globalFeatures,
}: AdLevelCardProps) {
  const theme = getThemeStyles(level.colorTheme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFeatureEnabled = (featureId: string) => {
    return level.enabledFeatures?.includes(featureId) || false;
  };

  const handleDropdownAction = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={clsx(
        "relative bg-white rounded-3xl p-6 flex flex-col border-2 transition-all duration-300",
        !level.isEnabled && "opacity-60 grayscale",
        isPopular && level.isEnabled
          ? "border-bluelight shadow-xl shadow-blue-100 scale-105 z-10"
          : "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Top Right Dropdown Menu */}
      <div className="absolute top-4 right-4" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-all"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          >
            {/* Enable/Disable */}
            <button
              onClick={() => handleDropdownAction(() => onToggleEnabled(level))}
              className={clsx(
                "w-full px-4 py-2.5 text-left text-[1.2em] font-medium flex items-center gap-3 transition-all",
                level.isEnabled
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-green-50"
              )}
            >
              {level.isEnabled ? (
                <>
                  <PowerOff className="w-4 h-4" />
                  Disable Level
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  Enable Level
                </>
              )}
            </button>

            {/* Set as Default - only if enabled */}
            {level.isEnabled && (
              <button
                onClick={() =>
                  handleDropdownAction(() => onSetDefault?.(level))
                }
                disabled={isDefault}
                className={clsx(
                  "w-full px-4 py-2.5 text-left text-[1.2em] font-medium flex items-center gap-3 transition-all",
                  isDefault
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-emerald-600 hover:bg-emerald-50"
                )}
              >
                <Check className="w-4 h-4" />
                {isDefault ? "Current Default" : "Set as Default"}
              </button>
            )}

            {/* Set as Recommended - only if enabled */}
            {level.isEnabled && (
              <button
                onClick={() =>
                  handleDropdownAction(() => onSetPopular?.(level))
                }
                disabled={isPopular}
                className={clsx(
                  "w-full px-4 py-2.5 text-left text-[1.2em] font-medium flex items-center gap-3 transition-all",
                  isPopular
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-purple-600 hover:bg-purple-50"
                )}
              >
                <Star className="w-4 h-4" />
                {isPopular ? "Current Recommended" : "Set as Recommended"}
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Recommended Badge */}
      {isPopular && level.isEnabled && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bluelight text-white px-4 py-1 rounded-full text-[1.1em] font-semibold shadow-md flex items-center gap-1">
          <Crown className="w-3.5 h-3.5" />
          <span>RECOMMENDED</span>
        </div>
      )}

      {/* Default Badge */}
      {isDefault && level.isEnabled && !isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[1.1em] font-semibold shadow-md flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>DEFAULT</span>
        </div>
      )}

      {/* Disabled Badge */}
      {!level.isEnabled && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded-full text-[1.1em] font-semibold shadow-md flex items-center gap-1">
          <PowerOff className="w-3.5 h-3.5" />
          <span>DISABLED</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4 pt-2">
        <div
          className={clsx(
            "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3",
            theme.bg
          )}
        >
          <theme.Icon className={clsx("w-7 h-7", theme.text)} />
        </div>
        <h3 className="text-[2em] font-bold text-shortblack mb-1">
          {level.name}
        </h3>
        <p className="text-[1.2em] text-grays leading-snug min-h-[2.5em]">
          {level.description}
        </p>
      </div>

      {/* Revenue Info */}
      <div className="mb-4 p-4 bg-slate-50 rounded-xl text-center">
        <div className="flex justify-center items-baseline gap-1">
          <span className="text-[2.5em] font-bold text-shortblack">
            {level.revenueShare}%
          </span>
          <span className="text-[1.2em] text-grays font-medium">
            Revenue Share
          </span>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-2 mb-4 flex-1">
        {globalFeatures.length > 0 ? (
          globalFeatures.slice(0, 5).map((feature) => {
            const enabled = isFeatureEnabled(feature.id);
            return (
              <li
                key={feature.id}
                className="flex items-start gap-2 text-[1.2em]"
              >
                {enabled ? (
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <X className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                )}
                <span className={enabled ? "text-shortblack" : "text-gray-400"}>
                  {feature.name}
                </span>
              </li>
            );
          })
        ) : (
          <li className="text-[1.2em] text-gray-400 italic">
            No features available
          </li>
        )}
        {globalFeatures.length > 5 && (
          <li className="text-[1.1em] text-grays ml-6">
            +{globalFeatures.length - 5} more features...
          </li>
        )}
      </ul>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(level)}
        className="w-full py-3 px-4 rounded-xl bg-bluelight text-white font-semibold text-[1.3em] hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
      >
        <Edit2 className="w-4 h-4" />
        Edit Level
      </button>

      {/* Demo Link */}
      {level.demoUrl && (
        <a
          href={level.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-center text-[1.1em] text-bluelight hover:underline flex items-center justify-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Demo
        </a>
      )}
    </motion.div>
  );
}
