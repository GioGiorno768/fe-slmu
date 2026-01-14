"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Edit2 } from "lucide-react";
import type { GlobalFeature } from "@/services/adLevelService";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface GlobalFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: GlobalFeature[];
  onAdd: (name: string, description?: string) => Promise<void>;
  onUpdate: (id: string, name: string, description?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function GlobalFeatureModal({
  isOpen,
  onClose,
  features,
  onAdd,
  onUpdate,
  onDelete,
  isLoading,
}: GlobalFeatureModalProps) {
  const [newFeature, setNewFeature] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleAdd = async () => {
    if (!newFeature.name.trim()) return;
    await onAdd(
      newFeature.name.trim(),
      newFeature.description.trim() || undefined
    );
    setNewFeature({ name: "", description: "" });
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name.trim()) return;
    await onUpdate(
      id,
      editData.name.trim(),
      editData.description.trim() || undefined
    );
    setEditingId(null);
  };

  const startEdit = (feature: GlobalFeature) => {
    setEditingId(feature.id);
    setEditData({ name: feature.name, description: feature.description || "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh]",
              isDark ? "bg-card" : "bg-white"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={clsx(
                    "text-[2.8em] font-bold",
                    isDark ? "text-white" : "text-shortblack"
                  )}
                >
                  Manage Features
                </h2>
                <p
                  className={clsx(
                    "text-[1.4em] mt-1",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  Create and manage global features for all ad levels
                </p>
              </div>
              <button
                onClick={onClose}
                className={clsx(
                  "p-2 rounded-xl transition-all",
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
              >
                <X
                  className={clsx(
                    "w-6 h-6",
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                />
              </button>
            </div>

            <div
              onWheel={(e) => e.stopPropagation()}
              className="overflow-y-auto max-h-[70vh]  "
            >
              {/* Existing Features List */}
              <div className="space-y-3 mb-6 mr-4">
                <h3
                  className={clsx(
                    "text-[1.6em] font-semibold",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Existing Features ({features.length})
                </h3>

                {features.length === 0 ? (
                  <div
                    className={clsx(
                      "text-center py-8 rounded-2xl",
                      isDark ? "bg-subcard" : "bg-gray-50"
                    )}
                  >
                    <p
                      className={clsx(
                        "text-[1.4em]",
                        isDark ? "text-gray-400" : "text-gray-400"
                      )}
                    >
                      No features yet. Add your first feature below.
                    </p>
                  </div>
                ) : (
                  features.map((feature) => (
                    <div
                      key={feature.id}
                      className={clsx(
                        "p-4 border rounded-2xl transition-all",
                        isDark
                          ? "bg-subcard border-gray-700 hover:shadow-md"
                          : "bg-gray-50 border-gray-200 hover:shadow-md"
                      )}
                    >
                      {editingId === feature.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            placeholder="Feature name"
                            className={clsx(
                              "w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluelight/30 focus:border-bluelight text-[1.4em]",
                              isDark
                                ? "bg-card border-gray-600 text-white placeholder:text-gray-500"
                                : "border-gray-300"
                            )}
                          />
                          <input
                            type="text"
                            value={editData.description}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description (optional)"
                            className={clsx(
                              "w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-bluelight/30 focus:border-bluelight text-[1.3em]",
                              isDark
                                ? "bg-card border-gray-600 text-white placeholder:text-gray-500"
                                : "border-gray-300"
                            )}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(feature.id)}
                              disabled={isLoading}
                              className="flex-1 px-4 py-2 bg-bluelight text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-[1.4em] font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className={clsx(
                                "flex-1 px-4 py-2 rounded-xl transition-colors text-[1.4em] font-medium",
                                isDark
                                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              )}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4
                              className={clsx(
                                "text-[1.5em] font-semibold",
                                isDark ? "text-white" : "text-gray-800"
                              )}
                            >
                              {feature.name}
                            </h4>
                            {feature.description && (
                              <p
                                className={clsx(
                                  "text-[1.3em] mt-1",
                                  isDark ? "text-gray-400" : "text-gray-500"
                                )}
                              >
                                {feature.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(feature)}
                              className={clsx(
                                "p-2 rounded-lg text-bluelight transition-colors",
                                isDark
                                  ? "hover:bg-blue-500/20"
                                  : "hover:bg-blue-100"
                              )}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(feature.id)}
                              disabled={isLoading}
                              className={clsx(
                                "p-2 rounded-lg text-red-600 transition-colors disabled:opacity-50",
                                isDark
                                  ? "hover:bg-red-500/20"
                                  : "hover:bg-red-100"
                              )}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add New Feature */}
              <div
                className={clsx(
                  "border-t pt-6 mr-4",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}
              >
                <h3
                  className={clsx(
                    "text-[1.6em] font-semibold mb-4",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Add New Feature
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newFeature.name}
                    onChange={(e) =>
                      setNewFeature({ ...newFeature, name: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Feature name (e.g., Faster Payout)"
                    className={clsx(
                      "w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-bluelight/30 focus:border-bluelight transition-all text-[1.5em]",
                      isDark
                        ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500 focus:bg-card"
                        : "border-gray-200"
                    )}
                  />
                  <input
                    type="text"
                    value={newFeature.description}
                    onChange={(e) =>
                      setNewFeature({
                        ...newFeature,
                        description: e.target.value,
                      })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Description (optional)"
                    className={clsx(
                      "w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-bluelight/30 focus:border-bluelight transition-all text-[1.4em]",
                      isDark
                        ? "bg-subcard border-gray-700 text-white placeholder:text-gray-500 focus:bg-card"
                        : "border-gray-200"
                    )}
                  />
                  <button
                    onClick={handleAdd}
                    disabled={isLoading || !newFeature.name.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-bluelight to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 text-[1.5em] flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {isLoading ? "Adding..." : "Add Feature"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
