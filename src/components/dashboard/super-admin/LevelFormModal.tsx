"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  Plus,
  Trash2,
  Loader2,
  Shield,
  Star,
  Trophy,
  Gem,
  Rocket,
  Crown,
  Unlock,
  Users,
  DollarSign,
  Globe,
  Link2,
} from "lucide-react";
import clsx from "clsx";
import type { LevelFormData } from "@/hooks/useManageLevels";
import { COLOR_THEMES } from "@/hooks/useManageLevels";
import type { LevelConfig } from "@/services/manageLevelsService";
import { useTheme } from "next-themes";

// Available icons for selection
const AVAILABLE_ICONS = [
  { name: "shield", label: "Shield", Icon: Shield },
  { name: "star", label: "Star", Icon: Star },
  { name: "trophy", label: "Trophy", Icon: Trophy },
  { name: "gem", label: "Gem", Icon: Gem },
  { name: "rocket", label: "Rocket", Icon: Rocket },
  { name: "crown", label: "Crown", Icon: Crown },
];

interface LevelFormModalProps {
  isOpen: boolean;
  editingLevel: LevelConfig | null;
  formData: LevelFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onUpdateField: <K extends keyof LevelFormData>(
    field: K,
    value: LevelFormData[K]
  ) => void;
  onAddBenefit: () => void;
  onRemoveBenefit: (index: number) => void;
  onUpdateBenefit: (index: number, value: string) => void;
}

export default function LevelFormModal({
  isOpen,
  editingLevel,
  formData,
  isSaving,
  onClose,
  onSave,
  onUpdateField,
  onAddBenefit,
  onRemoveBenefit,
  onUpdateBenefit,
}: LevelFormModalProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const isFormValid = formData.name.trim() !== "" && formData.minEarnings >= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onWheel={(e) => e.stopPropagation()}
            className={clsx(
              "rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl",
              isDark ? "bg-card" : "bg-white"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={clsx(
                "sticky top-0 border-b px-6 py-4 rounded-t-3xl",
                isDark ? "bg-card border-gray-700" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={clsx(
                    "text-[1.8em] font-bold",
                    isDark ? "text-white" : "text-shortblack"
                  )}
                >
                  {editingLevel
                    ? `Edit "${editingLevel.name}"`
                    : "Create New Level"}
                </h2>
                <button
                  onClick={onClose}
                  className={clsx(
                    "p-2 rounded-xl transition-colors",
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                >
                  <X
                    className={clsx(
                      "w-5 h-5",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label
                  className={clsx(
                    "block text-[1.3em] font-medium mb-2",
                    isDark ? "text-white" : "text-shortblack"
                  )}
                >
                  Level Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => onUpdateField("name", e.target.value)}
                  placeholder="e.g., Elite"
                  className={clsx(
                    "w-full px-4 py-3 border rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent",
                    isDark
                      ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                      : "border-gray-200"
                  )}
                />
              </div>

              {/* Min Earnings & CPM Bonus */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={clsx(
                      "block text-[1.3em] font-medium mb-2",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    Min Earnings ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.minEarnings}
                    onChange={(e) =>
                      onUpdateField("minEarnings", Number(e.target.value))
                    }
                    min="0"
                    step="1"
                    className={clsx(
                      "w-full px-4 py-3 border rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent",
                      isDark
                        ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                        : "border-gray-200"
                    )}
                  />
                </div>
                <div>
                  <label
                    className={clsx(
                      "block text-[1.3em] font-medium mb-2",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    CPM Bonus (%) *
                  </label>
                  <input
                    type="number"
                    value={formData.cpmBonus}
                    onChange={(e) =>
                      onUpdateField("cpmBonus", Number(e.target.value))
                    }
                    min="0"
                    max="100"
                    step="1"
                    className={clsx(
                      "w-full px-4 py-3 border rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent",
                      isDark
                        ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                        : "border-gray-200"
                    )}
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label
                  className={clsx(
                    "block text-[1.3em] font-medium mb-2",
                    isDark ? "text-white" : "text-shortblack"
                  )}
                >
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ICONS.map(({ name, label, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => onUpdateField("icon", name)}
                      className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-[1.3em]",
                        formData.icon === name
                          ? isDark
                            ? "border-bluelight bg-blue-500/20 text-bluelight"
                            : "border-bluelight bg-blue-50 text-bluelight"
                          : isDark
                          ? "border-gray-700 text-white hover:border-gray-600"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <label
                  className={clsx(
                    "block text-[1.3em] font-medium mb-2",
                    isDark ? "text-white" : "text-shortblack"
                  )}
                >
                  Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onUpdateField("colorTheme", theme.id)}
                      className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-[1.3em]",
                        theme.bgColor,
                        theme.iconColor,
                        formData.colorTheme === theme.id
                          ? `${theme.borderColor} ring-2 ${
                              isDark
                                ? "ring-offset-gray-900"
                                : "ring-offset-white"
                            } ring-offset-2`
                          : isDark
                          ? "border-gray-700/50"
                          : "border-transparent"
                      )}
                    >
                      <div
                        className={clsx(
                          "w-4 h-4 rounded-full flex items-center justify-center",
                          theme.iconColor
                        )}
                      >
                        <Check
                          className={clsx(
                            "w-3 h-3",
                            formData.colorTheme === theme.id
                              ? "visible"
                              : "invisible"
                          )}
                        />
                      </div>
                      <span className={theme.iconColor}>{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={clsx(
                      "text-[1.3em] font-medium",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    Benefits
                  </label>
                  <button
                    type="button"
                    onClick={onAddBenefit}
                    className="flex items-center gap-1 text-[1.2em] text-bluelight hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Add Benefit
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => onUpdateBenefit(index, e.target.value)}
                        placeholder="e.g., Priority support"
                        className={clsx(
                          "flex-1 px-4 py-3 border rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent",
                          isDark
                            ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500"
                            : "border-gray-200"
                        )}
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveBenefit(index)}
                          className={clsx(
                            "p-3 rounded-xl transition-colors",
                            isDark ? "hover:bg-red-500/20" : "hover:bg-red-50"
                          )}
                        >
                          <Trash2
                            className={clsx(
                              "w-4 h-4",
                              isDark ? "text-red-400" : "text-red-500"
                            )}
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Unlocks Section */}
              <div
                className={clsx(
                  "border-t pt-6",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Unlock className="w-5 h-5 text-bluelight" />
                  <h3
                    className={clsx(
                      "text-[1.4em] font-semibold",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    Feature Unlocks
                  </h3>
                </div>

                {/* Toggle grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Unlock Ad Level 3 */}
                  <label
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                      isDark
                        ? "bg-subcard hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Link2 className="w-4 h-4 text-blue-500" />
                      <span
                        className={clsx(
                          "text-[1.3em]",
                          isDark ? "text-white" : "text-shortblack"
                        )}
                      >
                        Ad Level 3
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.unlockAdLevel3}
                      onChange={(e) =>
                        onUpdateField("unlockAdLevel3", e.target.checked)
                      }
                      className="w-5 h-5 rounded text-bluelight focus:ring-bluelight"
                    />
                  </label>

                  {/* Unlock Ad Level 4 */}
                  <label
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                      isDark
                        ? "bg-subcard hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Link2 className="w-4 h-4 text-purple-500" />
                      <span
                        className={clsx(
                          "text-[1.3em]",
                          isDark ? "text-white" : "text-shortblack"
                        )}
                      >
                        Ad Level 4
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.unlockAdLevel4}
                      onChange={(e) =>
                        onUpdateField("unlockAdLevel4", e.target.checked)
                      }
                      className="w-5 h-5 rounded text-bluelight focus:ring-bluelight"
                    />
                  </label>

                  {/* Unlock Top Countries */}
                  <label
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                      isDark
                        ? "bg-subcard hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span
                        className={clsx(
                          "text-[1.3em]",
                          isDark ? "text-white" : "text-shortblack"
                        )}
                      >
                        Top Countries
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.unlockTopCountries}
                      onChange={(e) =>
                        onUpdateField("unlockTopCountries", e.target.checked)
                      }
                      className="w-5 h-5 rounded text-bluelight focus:ring-bluelight"
                    />
                  </label>

                  {/* Unlock Top Referrers */}
                  <label
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                      isDark
                        ? "bg-subcard hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span
                        className={clsx(
                          "text-[1.3em]",
                          isDark ? "text-white" : "text-shortblack"
                        )}
                      >
                        Top Referrers
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.unlockTopReferrers}
                      onChange={(e) =>
                        onUpdateField("unlockTopReferrers", e.target.checked)
                      }
                      className="w-5 h-5 rounded text-bluelight focus:ring-bluelight"
                    />
                  </label>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Max Referrals */}
                  <div>
                    <label
                      className={clsx(
                        "flex items-center gap-2 text-[1.3em] font-medium mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      <Users className="w-4 h-4" />
                      Max Referrals
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.maxReferrals}
                        onChange={(e) =>
                          onUpdateField("maxReferrals", Number(e.target.value))
                        }
                        min="-1"
                        className={clsx(
                          "w-full px-4 py-3 border rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent",
                          isDark
                            ? "bg-subcard border-gray-700 text-white"
                            : "border-gray-200"
                        )}
                      />
                      <span
                        className={clsx(
                          "absolute right-4 top-1/2 -translate-y-1/2 text-[1.2em]",
                          isDark ? "text-gray-500" : "text-grays"
                        )}
                      >
                        {formData.maxReferrals === -1 ? "∞" : "users"}
                      </span>
                    </div>
                    <p
                      className={clsx(
                        "text-[1.1em] mt-1",
                        isDark ? "text-gray-500" : "text-grays"
                      )}
                    >
                      -1 = unlimited
                    </p>
                  </div>

                  {/* Monthly Withdrawal Limit */}
                  <div>
                    <label
                      className={clsx(
                        "flex items-center gap-2 text-[1.3em] font-medium mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      <DollarSign className="w-4 h-4" />
                      Monthly Withdrawal
                    </label>
                    <div className="relative">
                      <span
                        className={clsx(
                          "absolute left-4 top-1/2 -translate-y-1/2 text-[1.4em]",
                          isDark ? "text-gray-500" : "text-grays"
                        )}
                      >
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.monthlyWithdrawalLimit}
                        onChange={(e) =>
                          onUpdateField(
                            "monthlyWithdrawalLimit",
                            Number(e.target.value)
                          )
                        }
                        min="-1"
                        className={clsx(
                          "w-full pl-8 pr-4 py-3 border rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent",
                          isDark
                            ? "bg-subcard border-gray-700 text-white"
                            : "border-gray-200"
                        )}
                      />
                      {formData.monthlyWithdrawalLimit === -1 && (
                        <span
                          className={clsx(
                            "absolute right-4 top-1/2 -translate-y-1/2 text-[1.2em]",
                            isDark ? "text-gray-500" : "text-grays"
                          )}
                        >
                          ∞
                        </span>
                      )}
                    </div>
                    <p
                      className={clsx(
                        "text-[1.1em] mt-1",
                        isDark ? "text-gray-500" : "text-grays"
                      )}
                    >
                      -1 = unlimited
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={clsx(
                "sticky bottom-0 border-t px-6 py-4 rounded-b-3xl flex justify-end gap-3",
                isDark ? "bg-card border-gray-700" : "bg-white border-gray-200"
              )}
            >
              <button
                onClick={onClose}
                className={clsx(
                  "px-6 py-3 text-[1.4em] rounded-xl transition-colors",
                  isDark
                    ? "text-gray-400 hover:bg-gray-700"
                    : "text-grays hover:bg-gray-100"
                )}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={!isFormValid || isSaving}
                className="px-6 py-3 text-[1.4em] text-white bg-bluelight hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {editingLevel ? "Save Changes" : "Create Level"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
