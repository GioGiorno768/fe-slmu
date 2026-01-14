"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import clsx from "clsx";
import type {
  AdLevelConfig,
  AdFeature,
  GlobalFeature,
} from "@/services/adLevelService";
import { formatCPM } from "@/services/adLevelService";
import { motion, AnimatePresence } from "motion/react";
import FeatureSelector from "./FeatureSelector";
import { useTheme } from "next-themes";

interface AdLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  editingLevel?: AdLevelConfig | null;
  isSubmitting: boolean;
  globalFeatures: GlobalFeature[];
}

const COLOR_THEMES = [
  {
    value: "green",
    label: "Green",
    gradient: "from-emerald-500 to-green-600",
    icon: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    value: "blue",
    label: "Blue",
    gradient: "from-blue-500 to-indigo-600",
    icon: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    value: "orange",
    label: "Orange",
    gradient: "from-orange-500 to-amber-600",
    icon: "bg-orange-50",
    text: "text-orange-700",
  },
  {
    value: "red",
    label: "Red",
    gradient: "from-red-500 to-rose-600",
    icon: "bg-red-50",
    text: "text-red-700",
  },
] as const;

export default function AdLevelModal({
  isOpen,
  onClose,
  onSubmit,
  editingLevel,
  isSubmitting,
  globalFeatures,
}: AdLevelModalProps) {
  const [formData, setFormData] = useState({
    levelNumber: 1,
    name: "",
    description: "",
    revenueShare: 50,
    colorTheme: "blue" as "green" | "blue" | "orange" | "red",
    demoUrl: "",
    isEnabled: true,
  });

  // Legacy features (for backward compatibility)
  const [features, setFeatures] = useState<AdFeature[]>([
    {
      id: "1",
      label: "Interstitial Ads",
      included: true,
      value: "1x per visit",
    },
  ]);

  // New global features selection
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);

  // Per-level feature descriptions
  const [featureValues, setFeatureValues] = useState<Record<string, string>>(
    {}
  );

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Initialize form with editing data
  useEffect(() => {
    if (editingLevel) {
      setFormData({
        levelNumber: editingLevel.levelNumber,
        name: editingLevel.name,
        description: editingLevel.description,
        revenueShare: editingLevel.revenueShare,
        colorTheme: editingLevel.colorTheme,
        demoUrl: editingLevel.demoUrl,
        isEnabled: editingLevel.isEnabled,
      });
      setFeatures(editingLevel.features);
      setEnabledFeatures(editingLevel.enabledFeatures || []);

      // Initialize featureValues - migrate from legacy features if featureValues is empty
      let initialFeatureValues = editingLevel.featureValues || {};

      // If featureValues is empty, try to extract from legacy features array
      if (
        Object.keys(initialFeatureValues).length === 0 &&
        editingLevel.features?.length > 0
      ) {
        const migratedValues: Record<string, string> = {};

        // Try to match legacy features with global features by name
        editingLevel.features.forEach((legacyFeature) => {
          if (legacyFeature.value && typeof legacyFeature.value === "string") {
            // Find matching global feature by name
            const matchingGlobal = globalFeatures.find(
              (gf) =>
                gf.name.toLowerCase() === legacyFeature.label?.toLowerCase()
            );
            if (matchingGlobal) {
              migratedValues[matchingGlobal.id] = legacyFeature.value;
            }
          }
        });

        initialFeatureValues = migratedValues;
      }

      setFeatureValues(initialFeatureValues);
    }
  }, [editingLevel, isOpen, globalFeatures]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      cpcRate: editingLevel?.cpcRate || 0.005, // CPC is managed in Settings
      isPopular: editingLevel?.isPopular || false,
      features,
      enabledFeatures,
      featureValues,
    };

    await onSubmit(data);
    onClose();
  };

  const toggleFeature = (id: string) => {
    setEnabledFeatures((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const updateFeatureValue = (id: string, value: string) => {
    setFeatureValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Get current theme style
  const selectedTheme =
    COLOR_THEMES.find((t) => t.value === formData.colorTheme) ||
    COLOR_THEMES[1];

  // Get enabled feature names for preview
  const enabledFeatureNames = globalFeatures
    .filter((f) => enabledFeatures.includes(f.id))
    .map((f) => f.name);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 h-screen bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={clsx(
                "w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row max-h-[90vh] font-figtree text-[10px]",
                isDark ? "bg-card" : "bg-white"
              )}
            >
              {/* LEFT: Form */}
              <div
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 p-8 overflow-y-auto"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2
                      className={clsx(
                        "text-[2.2em] font-bold",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Edit Level {formData.levelNumber}
                    </h2>
                    <p
                      className={clsx(
                        "text-[1.3em] mt-1",
                        isDark ? "text-gray-400" : "text-grays"
                      )}
                    >
                      Configure settings for this ad level
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className={clsx(
                      "p-2.5 rounded-full transition-colors",
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <X
                      className={clsx(
                        "w-6 h-6",
                        isDark ? "text-gray-400" : "text-grays"
                      )}
                    />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]",
                        isDark
                          ? "bg-subcard text-white focus:bg-card placeholder:text-gray-500"
                          : "bg-gray-50 focus:bg-white"
                      )}
                      placeholder="e.g., Medium"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em] resize-none",
                        isDark
                          ? "bg-subcard text-white focus:bg-card placeholder:text-gray-500"
                          : "bg-gray-50 focus:bg-white"
                      )}
                      rows={2}
                      placeholder="Brief description..."
                      required
                    />
                  </div>

                  {/* Revenue & CPC */}
                  {/* Revenue Share */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Revenue Share (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.revenueShare}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            revenueShare: parseInt(e.target.value),
                          })
                        }
                        className={clsx(
                          "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]",
                          isDark
                            ? "bg-subcard text-white focus:bg-card"
                            : "bg-gray-50 focus:bg-white"
                        )}
                        required
                        min="0"
                        max="100"
                      />
                    </div>
                    <p
                      className={clsx(
                        "text-[1.1em] mt-2",
                        isDark ? "text-gray-400" : "text-grays"
                      )}
                    >
                      CPC rates are configured in Settings → CPC Rates
                    </p>
                  </div>

                  {/* Color Theme */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-3",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Color Theme
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {COLOR_THEMES.map((theme) => (
                        <button
                          key={theme.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              colorTheme: theme.value,
                            })
                          }
                          className={clsx(
                            "p-4 rounded-2xl border-2 transition-all group relative overflow-hidden",
                            formData.colorTheme === theme.value
                              ? isDark
                                ? "border-white shadow-lg scale-105"
                                : "border-shortblack shadow-lg scale-105"
                              : isDark
                              ? "border-gray-700 hover:border-gray-600"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div
                            className={clsx(
                              "w-full h-12 rounded-xl mb-2 bg-gradient-to-br",
                              theme.gradient
                            )}
                          />
                          <p
                            className={clsx(
                              "text-[1.2em] font-bold",
                              isDark ? "text-white" : "text-shortblack"
                            )}
                          >
                            {theme.label}
                          </p>
                          {formData.colorTheme === theme.value && (
                            <div
                              className={clsx(
                                "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center",
                                isDark ? "bg-white" : "bg-shortblack"
                              )}
                            >
                              <Check
                                className={clsx(
                                  "w-4 h-4",
                                  isDark ? "text-shortblack" : "text-white"
                                )}
                              />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Article/Demo URL */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Article/Demo Page URL
                    </label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, demoUrl: e.target.value })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none transition-all text-[1.3em]",
                        isDark
                          ? "bg-subcard text-white focus:bg-card placeholder:text-gray-500"
                          : "bg-gray-50 focus:bg-white"
                      )}
                      placeholder="https://artikel.shortlink.com/demo-level-1"
                    />
                    <p
                      className={clsx(
                        "text-[1.1em] mt-2",
                        isDark ? "text-gray-400" : "text-grays"
                      )}
                    >
                      Link to article page with ads setup (separate project)
                    </p>
                  </div>

                  {/* Global Features Selector */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-3",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Features ({enabledFeatures.length} selected)
                    </label>
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="max-h-80 overflow-y-auto pr-2"
                    >
                      <FeatureSelector
                        features={globalFeatures}
                        selectedIds={enabledFeatures}
                        onToggle={toggleFeature}
                        featureValues={featureValues}
                        onValueChange={updateFeatureValue}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className={clsx(
                        "w-full py-4 rounded-2xl font-bold text-[1.6em] hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-xl text-white",
                        isDark
                          ? "bg-bluelight hover:bg-blue-600"
                          : "bg-gradient-to-r from-shortblack to-gray-800"
                      )}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Update Level"}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: Live Preview */}
              <div
                className={clsx(
                  "hidden md:flex flex-1 p-8 flex-col items-center justify-center border-l",
                  isDark
                    ? "bg-subcard border-gray-700"
                    : "bg-gradient-to-br from-gray-50 to-blue-50/30 border-gray-200"
                )}
              >
                <h3
                  className={clsx(
                    "text-[1.5em] font-bold mb-8 uppercase tracking-wider",
                    isDark ? "text-gray-500" : "text-gray-400"
                  )}
                >
                  Live Preview
                </h3>

                {/* Card Preview */}
                <div
                  className={clsx(
                    "relative w-full max-w-sm rounded-3xl p-8 transition-all duration-500 border-2 shadow-xl",
                    isDark
                      ? "bg-card border-gray-700 shadow-black/20"
                      : "bg-white border-gray-100"
                  )}
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div
                      className={clsx(
                        "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
                        selectedTheme.icon
                      )}
                    >
                      <span
                        className={clsx(
                          "text-[2.5em] font-bold",
                          selectedTheme.text
                        )}
                      >
                        {formData.levelNumber}
                      </span>
                    </div>
                    <h3
                      className={clsx(
                        "text-[2.2em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      {formData.name || "Level Name"}
                    </h3>
                    <p
                      className={clsx(
                        "text-[1.3em] leading-snug min-h-[3em]",
                        isDark ? "text-gray-400" : "text-grays"
                      )}
                    >
                      {formData.description ||
                        "Your description will appear here"}
                    </p>
                  </div>

                  {/* Revenue Info */}
                  <div
                    className={clsx(
                      "mb-6 p-4 rounded-xl text-center space-y-2",
                      isDark ? "bg-subcard" : "bg-slate-50"
                    )}
                  >
                    <div className="flex justify-center items-baseline gap-1">
                      <span
                        className={clsx(
                          "text-[2.8em] font-bold",
                          isDark ? "text-white" : "text-shortblack"
                        )}
                      >
                        {formData.revenueShare}%
                      </span>
                      <span
                        className={clsx(
                          "text-[1.2em] font-medium",
                          isDark ? "text-gray-400" : "text-grays"
                        )}
                      >
                        Revenue
                      </span>
                    </div>
                  </div>

                  {/* Features Preview */}
                  <div className="mb-4">
                    <p
                      className={clsx(
                        "text-[1.2em] font-semibold mb-3",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Features
                    </p>
                    <div className="space-y-2">
                      {enabledFeatureNames.length > 0 ? (
                        <>
                          {enabledFeatureNames.slice(0, 3).map((name, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-[1.2em]"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              <span
                                className={
                                  isDark ? "text-white" : "text-shortblack"
                                }
                              >
                                {name}
                              </span>
                            </div>
                          ))}
                          {enabledFeatureNames.length > 3 && (
                            <p
                              className={clsx(
                                "text-[1.1em] italic",
                                isDark ? "text-gray-500" : "text-grays"
                              )}
                            >
                              +{enabledFeatureNames.length - 3} more...
                            </p>
                          )}
                        </>
                      ) : (
                        <p
                          className={clsx(
                            "text-[1.2em] italic",
                            isDark ? "text-gray-500" : "text-gray-400"
                          )}
                        >
                          No features selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-gray-400 text-center max-w-xs text-[1.2em]">
                  This is how the level will appear on user ads-info page.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
