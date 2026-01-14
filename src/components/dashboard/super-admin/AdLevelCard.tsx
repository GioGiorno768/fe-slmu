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
import { useTheme } from "next-themes";

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

const getThemeStyles = (theme: string, isDark: boolean) => {
  switch (theme) {
    case "green":
      return {
        border: isDark ? "border-green-500/30" : "border-green-200",
        bg: isDark ? "bg-green-500/20" : "bg-green-50",
        text: isDark ? "text-green-400" : "text-green-700",
        badge: isDark
          ? "bg-green-500/20 text-green-400"
          : "bg-green-100 text-green-800",
        Icon: ShieldCheck,
      };
    case "orange":
      return {
        border: isDark ? "border-orange-500/30" : "border-orange-200",
        bg: isDark ? "bg-orange-500/20" : "bg-orange-50",
        text: isDark ? "text-orange-400" : "text-orange-700",
        badge: isDark
          ? "bg-orange-500/20 text-orange-400"
          : "bg-orange-100 text-orange-800",
        Icon: Flame,
      };
    case "red":
      return {
        border: isDark ? "border-red-500/30" : "border-red-200",
        bg: isDark ? "bg-red-500/20" : "bg-red-50",
        text: isDark ? "text-red-400" : "text-red-700",
        badge: isDark
          ? "bg-red-500/20 text-red-400"
          : "bg-red-100 text-red-800",
        Icon: Bomb,
      };
    default: // blue
      return {
        border: isDark ? "border-blue-500/30" : "border-blue-200",
        bg: isDark ? "bg-blue-500/20" : "bg-blue-50",
        text: isDark ? "text-blue-400" : "text-blue-700",
        badge: isDark
          ? "bg-blue-500/20 text-blue-400"
          : "bg-blue-100 text-blue-800",
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const theme = getThemeStyles(level.colorTheme, isDark);
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
        "relative rounded-3xl p-6 flex flex-col border-2 transition-all duration-300",
        isDark ? "bg-card" : "bg-white",
        !level.isEnabled && "opacity-60 grayscale",
        isPopular && level.isEnabled
          ? isDark
            ? "border-bluelight shadow-xl shadow-blue-500/20 scale-105 z-10"
            : "border-bluelight shadow-xl shadow-blue-100 scale-105 z-10"
          : isDark
          ? "border-gray-700 shadow-md shadow-black/20 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-1"
          : "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Top Right Dropdown Menu */}
      <div className="absolute top-4 right-4" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={clsx(
            "p-2 rounded-xl transition-all",
            isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
          )}
        >
          <MoreVertical
            className={clsx(
              "w-5 h-5",
              isDark ? "text-gray-400" : "text-gray-500"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={clsx(
              "absolute right-0 top-10 w-48 rounded-xl shadow-xl border py-2 z-50",
              isDark ? "bg-card border-gray-700" : "bg-white border-gray-100"
            )}
          >
            {/* Enable/Disable */}
            <button
              onClick={() => handleDropdownAction(() => onToggleEnabled(level))}
              className={clsx(
                "w-full px-4 py-2.5 text-left text-[1.2em] font-medium flex items-center gap-3 transition-all",
                level.isEnabled
                  ? isDark
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-red-600 hover:bg-red-50"
                  : isDark
                  ? "text-green-400 hover:bg-green-500/10"
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
                    : isDark
                    ? "text-emerald-400 hover:bg-emerald-500/10"
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
                    : isDark
                    ? "text-purple-400 hover:bg-purple-500/10"
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
        <h3
          className={clsx(
            "text-[2em] font-bold mb-1",
            isDark ? "text-white" : "text-shortblack"
          )}
        >
          {level.name}
        </h3>
        <p
          className={clsx(
            "text-[1.2em] leading-snug min-h-[2.5em]",
            isDark ? "text-gray-400" : "text-grays"
          )}
        >
          {level.description}
        </p>
      </div>

      {/* Revenue Info */}
      <div
        className={clsx(
          "mb-4 p-4 rounded-xl text-center",
          isDark ? "bg-subcard" : "bg-slate-50"
        )}
      >
        <div className="flex justify-center items-baseline gap-1">
          <span
            className={clsx(
              "text-[2.5em] font-bold",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            {level.revenueShare}%
          </span>
          <span
            className={clsx(
              "text-[1.2em] font-medium",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
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
                  <X
                    className={clsx(
                      "w-4 h-4 shrink-0 mt-0.5",
                      isDark ? "text-gray-600" : "text-gray-300"
                    )}
                  />
                )}
                <span
                  className={
                    enabled
                      ? isDark
                        ? "text-white"
                        : "text-shortblack"
                      : "text-gray-400"
                  }
                >
                  {feature.name}
                </span>
              </li>
            );
          })
        ) : (
          <li
            className={clsx(
              "text-[1.2em] italic",
              isDark ? "text-gray-500" : "text-gray-400"
            )}
          >
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
