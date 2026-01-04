"use client";

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
} from "lucide-react";
import clsx from "clsx";
import type { LevelFormData } from "@/hooks/useManageLevels";
import { COLOR_THEMES } from "@/hooks/useManageLevels";
import type { LevelConfig } from "@/services/manageLevelsService";

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
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-[1.8em] font-bold text-shortblack">
                  {editingLevel
                    ? `Edit "${editingLevel.name}"`
                    : "Create New Level"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-[1.3em] font-medium text-shortblack mb-2">
                  Level Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => onUpdateField("name", e.target.value)}
                  placeholder="e.g., Elite"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent"
                />
              </div>

              {/* Min Earnings & CPM Bonus */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[1.3em] font-medium text-shortblack mb-2">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[1.3em] font-medium text-shortblack mb-2">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent"
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-[1.3em] font-medium text-shortblack mb-2">
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
                          ? "border-bluelight bg-blue-50 text-bluelight"
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
                <label className="block text-[1.3em] font-medium text-shortblack mb-2">
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
                        formData.colorTheme === theme.id
                          ? `${theme.borderColor} ring-2 ring-offset-1`
                          : "border-transparent"
                      )}
                    >
                      <div
                        className={clsx(
                          "w-4 h-4 rounded-full",
                          theme.bgColor,
                          theme.iconColor
                        )}
                      >
                        <Check
                          className={clsx(
                            "w-4 h-4",
                            formData.colorTheme === theme.id
                              ? "visible"
                              : "invisible"
                          )}
                        />
                      </div>
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[1.3em] font-medium text-shortblack">
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
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-[1.4em] focus:ring-2 focus:ring-bluelight focus:border-transparent"
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveBenefit(index)}
                          className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-[1.4em] text-grays hover:bg-gray-100 rounded-xl transition-colors"
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
