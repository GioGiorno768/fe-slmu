"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import clsx from "clsx";
import type { GlobalFeature } from "@/services/adLevelService";
import { useTheme } from "next-themes";

interface FeatureSelectorProps {
  features: GlobalFeature[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  featureValues?: Record<string, string>;
  onValueChange?: (id: string, value: string) => void;
  disabled?: boolean;
}

export default function FeatureSelector({
  features,
  selectedIds,
  onToggle,
  featureValues = {},
  onValueChange,
  disabled = false,
}: FeatureSelectorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const isSelected = (id: string) => selectedIds.includes(id);

  if (features.length === 0) {
    return (
      <div
        className={clsx(
          "text-center py-8 px-4 rounded-2xl border-2 border-dashed",
          isDark ? "bg-subcard border-gray-700" : "bg-gray-50 border-gray-300"
        )}
      >
        <p
          className={clsx(
            "text-[1.4em]",
            isDark ? "text-gray-500" : "text-gray-400"
          )}
        >
          No features available. Add features from the global feature
          management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {features.map((feature) => {
        const selected = isSelected(feature.id);

        return (
          <motion.div
            key={feature.id}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            className={clsx(
              "rounded-2xl border-2 transition-all duration-200 overflow-hidden",
              selected
                ? isDark
                  ? "bg-blue-500/10 border-bluelight shadow-md"
                  : "bg-blue-50 border-bluelight shadow-md"
                : isDark
                ? "bg-subcard border-gray-700 hover:border-gray-600 hover:shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {/* Toggle Row */}
            <div
              onClick={() => !disabled && onToggle(feature.id)}
              className={clsx(
                "p-4 cursor-pointer flex items-center gap-4",
                disabled && "cursor-not-allowed"
              )}
            >
              {/* Checkmark Icon */}
              <div
                className={clsx(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                  selected
                    ? "bg-bluelight text-white scale-100"
                    : isDark
                    ? "bg-gray-700 text-transparent scale-90"
                    : "bg-gray-200 text-transparent scale-90"
                )}
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </div>

              {/* Feature Info */}
              <div className="flex-1">
                <h4
                  className={clsx(
                    "text-[1.5em] font-semibold transition-colors",
                    selected
                      ? "text-bluelight"
                      : isDark
                      ? "text-white"
                      : "text-gray-800"
                  )}
                >
                  {feature.name}
                </h4>
                {feature.description && (
                  <p
                    className={clsx(
                      "text-[1.2em] mt-0.5",
                      isDark ? "text-gray-500" : "text-gray-400"
                    )}
                  >
                    Global: {feature.description}
                  </p>
                )}
              </div>

              {/* Selected Badge */}
              {selected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1 bg-bluelight text-white rounded-full text-[1.2em] font-medium shrink-0"
                >
                  Enabled
                </motion.div>
              )}
            </div>

            {/* Description Input (only when selected) */}
            {selected && onValueChange && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4"
              >
                <div
                  className={clsx(
                    "pt-3 border-t",
                    isDark ? "border-blue-500/30" : "border-blue-100"
                  )}
                >
                  <label
                    className={clsx(
                      "block text-[1.2em] font-medium mb-2",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    Custom description for this level:
                  </label>
                  <input
                    type="text"
                    value={featureValues[feature.id] || ""}
                    onChange={(e) => onValueChange(feature.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="e.g., Max, Standard, 3 / 24h"
                    className={clsx(
                      "w-full px-4 py-2.5 rounded-xl border-2 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]",
                      isDark
                        ? "bg-card border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white border-blue-200"
                    )}
                    disabled={disabled}
                  />
                  <p
                    className={clsx(
                      "text-[1.1em] mt-1.5",
                      isDark ? "text-gray-500" : "text-gray-400"
                    )}
                  >
                    Leave empty to use global description
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
