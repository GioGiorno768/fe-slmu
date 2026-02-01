"use client";

import { useState, useEffect } from "react";
import { Edit2, DollarSign, Timer, Hash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface WithdrawalLimits {
  min_amount: number;
  max_amount: number;
  limit_count: number;
  limit_days: number;
}

interface WithdrawalLimitsCardProps {
  limits: WithdrawalLimits;
  onUpdate: (limits: WithdrawalLimits) => Promise<void>;
  isLoading?: boolean;
}

export default function WithdrawalLimitsCard({
  limits,
  onUpdate,
  isLoading,
}: WithdrawalLimitsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WithdrawalLimits>(limits);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Separate string states for flexible decimal input
  const [minAmountStr, setMinAmountStr] = useState("");
  const [maxAmountStr, setMaxAmountStr] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Sync form with props when modal opens
  const openModal = () => {
    setFormData(limits);
    setMinAmountStr(String(limits.min_amount));
    setMaxAmountStr(String(limits.max_amount));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Parse string values before submit
      const submitData = {
        ...formData,
        min_amount: parseFloat(minAmountStr) || 0,
        max_amount: parseFloat(maxAmountStr) || 0,
      };
      await onUpdate(submitData);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-select on focus for better UX
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <>
      {/* Card Display */}
      <div
        className={clsx(
          "rounded-2xl p-5 border",
          isDark
            ? "bg-linear-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/30"
            : "bg-linear-to-br from-purple-50 to-indigo-50 border-purple-100",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                isDark ? "bg-purple-500/20" : "bg-purple-100",
              )}
            >
              <DollarSign
                className={clsx(
                  "w-5 h-5",
                  isDark ? "text-purple-400" : "text-purple-600",
                )}
              />
            </div>
            <div>
              <h3
                className={clsx(
                  "text-[1.6em] font-bold",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                Withdrawal Limits
              </h3>
              <p
                className={clsx(
                  "text-[1.1em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Global settings for all payment methods
              </p>
            </div>
          </div>
          <button
            onClick={openModal}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-medium text-[1.2em] hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={clsx(
              "bg-card rounded-xl p-3 border",
              isDark ? "border-purple-500/30" : "border-purple-100",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign
                className={clsx(
                  "w-4 h-4",
                  isDark ? "text-purple-400" : "text-purple-500",
                )}
              />
              <span
                className={clsx(
                  "text-[1.1em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Min Withdrawal
              </span>
            </div>
            <p
              className={clsx(
                "text-[1.6em] font-bold",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              $
              {limits.min_amount.toLocaleString("en-US", {
                minimumFractionDigits: 5,
              })}
            </p>
          </div>
          <div
            className={clsx(
              "bg-card rounded-xl p-3 border",
              isDark ? "border-purple-500/30" : "border-purple-100",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign
                className={clsx(
                  "w-4 h-4",
                  isDark ? "text-purple-400" : "text-purple-500",
                )}
              />
              <span
                className={clsx(
                  "text-[1.1em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Max Withdrawal
              </span>
            </div>
            <p
              className={clsx(
                "text-[1.6em] font-bold",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              {limits.max_amount > 0
                ? `$${limits.max_amount.toLocaleString("en-US", { minimumFractionDigits: 5 })}`
                : "Unlimited"}
            </p>
          </div>
          <div
            className={clsx(
              "bg-card rounded-xl p-3 border",
              isDark ? "border-purple-500/30" : "border-purple-100",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Hash
                className={clsx(
                  "w-4 h-4",
                  isDark ? "text-purple-400" : "text-purple-500",
                )}
              />
              <span
                className={clsx(
                  "text-[1.1em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Limit Count
              </span>
            </div>
            <p
              className={clsx(
                "text-[1.6em] font-bold",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              {limits.limit_count > 0 ? `${limits.limit_count}x` : "Unlimited"}
            </p>
          </div>
          <div
            className={clsx(
              "bg-card rounded-xl p-3 border",
              isDark ? "border-purple-500/30" : "border-purple-100",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Timer
                className={clsx(
                  "w-4 h-4",
                  isDark ? "text-purple-400" : "text-purple-500",
                )}
              />
              <span
                className={clsx(
                  "text-[1.1em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Per Days
              </span>
            </div>
            <p
              className={clsx(
                "text-[1.6em] font-bold",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              {limits.limit_days} day{limits.limit_days > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 h-screen bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={clsx(
                  "w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto font-figtree text-[10px]",
                  isDark
                    ? "bg-card border border-gray-800"
                    : "bg-card border-t",
                )}
              >
                {/* Header */}
                <div
                  className={clsx(
                    "px-6 py-5 border-b",
                    isDark
                      ? "border-gray-700 bg-linear-to-r from-purple-500/10 to-indigo-500/10"
                      : "border-gray-100 bg-linear-to-r from-purple-50 to-indigo-50",
                  )}
                >
                  <h2
                    className={clsx(
                      "text-[2em] font-bold",
                      isDark ? "text-white" : "text-shortblack",
                    )}
                  >
                    Edit Withdrawal Limits
                  </h2>
                  <p
                    className={clsx(
                      "text-[1.2em]",
                      isDark ? "text-gray-400" : "text-grays",
                    )}
                  >
                    Set global limits for all withdrawals
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Min Amount */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack",
                      )}
                    >
                      Minimum Withdrawal (USD)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={minAmountStr}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        const parts = value.split(".");
                        const sanitized =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : value;
                        setMinAmountStr(sanitized);
                      }}
                      onFocus={handleFocus}
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-purple-500 outline-none transition-all text-[1.3em]",
                        isDark
                          ? "bg-subcard text-white focus:bg-card"
                          : "bg-subcard focus:bg-card text-shortblack",
                      )}
                      placeholder="e.g., 2.00000"
                    />
                    <p
                      className={clsx(
                        "text-[1.1em] mt-1",
                        isDark ? "text-gray-500" : "text-grays",
                      )}
                    >
                      User must have at least this amount to withdraw
                    </p>
                  </div>

                  {/* Max Amount */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack",
                      )}
                    >
                      Maximum Withdrawal (USD)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={maxAmountStr}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        const parts = value.split(".");
                        const sanitized =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : value;
                        setMaxAmountStr(sanitized);
                      }}
                      onFocus={handleFocus}
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-purple-500 outline-none transition-all text-[1.3em]",
                        isDark
                          ? "bg-subcard text-white focus:bg-card"
                          : "bg-subcard focus:bg-card text-shortblack",
                      )}
                      placeholder="e.g., 100.00000 or 0 for unlimited"
                    />
                    <p
                      className={clsx(
                        "text-[1.1em] mt-1",
                        isDark ? "text-gray-500" : "text-grays",
                      )}
                    >
                      Set to 0 for unlimited
                    </p>
                  </div>

                  {/* Frequency Limit Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={clsx(
                          "block text-[1.3em] font-bold mb-2",
                          isDark ? "text-white" : "text-shortblack",
                        )}
                      >
                        Limit Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.limit_count}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limit_count: parseInt(e.target.value) || 0,
                          })
                        }
                        onFocus={handleFocus}
                        className={clsx(
                          "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-purple-500 outline-none transition-all text-[1.3em]",
                          isDark
                            ? "bg-subcard text-white focus:bg-card"
                            : "bg-subcard focus:bg-card text-shortblack",
                        )}
                      />
                      <p
                        className={clsx(
                          "text-[1.1em] mt-1",
                          isDark ? "text-gray-500" : "text-grays",
                        )}
                      >
                        0 = unlimited
                      </p>
                    </div>
                    <div>
                      <label
                        className={clsx(
                          "block text-[1.3em] font-bold mb-2",
                          isDark ? "text-white" : "text-shortblack",
                        )}
                      >
                        Per Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.limit_days}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limit_days: parseInt(e.target.value) || 1,
                          })
                        }
                        onFocus={handleFocus}
                        className={clsx(
                          "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-purple-500 outline-none transition-all text-[1.3em]",
                          isDark
                            ? "bg-subcard text-white focus:bg-card"
                            : "bg-subcard focus:bg-card text-shortblack",
                        )}
                      />
                      <p
                        className={clsx(
                          "text-[1.1em] mt-1",
                          isDark ? "text-gray-500" : "text-grays",
                        )}
                      >
                        Time window
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={clsx(
                        "flex-1 py-3 px-4 rounded-xl border-2 font-semibold text-[1.3em] transition-all",
                        isDark
                          ? "border-gray-700 text-gray-400 hover:bg-subcard"
                          : "border-gray-200 text-grays hover:bg-subcard",
                      )}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-purple-600 text-white font-semibold text-[1.3em] hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
