"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Info,
  Trash2,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "next-themes";

export type ConfirmType = "danger" | "warning" | "info" | "success";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmType;
  isLoading?: boolean;
  showReasonInput?: boolean;
  reasonPlaceholder?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "danger",
  isLoading = false,
  showReasonInput = false,
  reasonPlaceholder = "Please provide a reason...",
}: ConfirmationModalProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Reset reason when modal opens/closes
  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  // Config Icon & Warna berdasarkan Tipe
  const config = {
    danger: {
      icon: Trash2,
      iconColor: isDark ? "text-red-400" : "text-red-500",
      iconBg: isDark
        ? "bg-red-500/20 border-red-500/30"
        : "bg-red-50 border-red-100",
      btnColor: isDark
        ? "bg-red-600 hover:bg-red-500 shadow-red-900/30"
        : "bg-red-500 hover:bg-red-600 shadow-red-200",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: isDark ? "text-orange-400" : "text-orange-500",
      iconBg: isDark
        ? "bg-orange-500/20 border-orange-500/30"
        : "bg-orange-50 border-orange-100",
      btnColor: isDark
        ? "bg-orange-600 hover:bg-orange-500 shadow-orange-900/30"
        : "bg-orange-500 hover:bg-orange-600 shadow-orange-200",
    },
    info: {
      icon: Info,
      iconColor: "text-bluelight",
      iconBg: isDark
        ? "bg-blue-500/20 border-blue-500/30"
        : "bg-blue-50 border-blue-100",
      btnColor: isDark
        ? "bg-bluelight hover:bg-blue-500 shadow-blue-900/30"
        : "bg-bluelight hover:bg-blue-700 shadow-blue-200",
    },
    success: {
      icon: CheckCircle,
      iconColor: isDark ? "text-green-400" : "text-green-500",
      iconBg: isDark
        ? "bg-green-500/20 border-green-500/30"
        : "bg-green-50 border-green-100",
      btnColor: isDark
        ? "bg-green-600 hover:bg-green-500 shadow-green-900/30"
        : "bg-green-600 hover:bg-green-700 shadow-green-200",
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm font-figtree h-screen"
          onClick={!isLoading ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "w-full max-w-[40em] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col items-center text-center p-8",
              isDark ? "bg-card" : "bg-white"
            )}
          >
            {/* Icon Bubble */}
            <div
              className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center border-4 mb-6",
                currentConfig.iconBg
              )}
            >
              <Icon className={clsx("w-10 h-10", currentConfig.iconColor)} />
            </div>

            {/* Text Content */}
            <h3
              className={clsx(
                "text-[2.2em] font-bold mb-3 leading-tight",
                isDark ? "text-white" : "text-shortblack"
              )}
            >
              {title}
            </h3>
            <p className="text-[1.5em] text-grays leading-relaxed mb-8 px-4">
              {description}
            </p>

            {showReasonInput && (
              <div className="w-full px-4 mb-8">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={reasonPlaceholder}
                  className={clsx(
                    "w-full p-4 text-[1.2em] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none",
                    isDark
                      ? "bg-subcard border-gray-dashboard/50 text-white placeholder:text-gray-500"
                      : "border-gray-200 text-shortblack"
                  )}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 w-full">
              <button
                onClick={onClose}
                disabled={isLoading}
                className={clsx(
                  "flex-1 py-4 rounded-xl text-[1.5em] font-semibold transition-colors disabled:opacity-50",
                  isDark
                    ? "text-gray-300 bg-gray-dashboard/50 hover:bg-gray-dashboard"
                    : "text-shortblack bg-gray-100 hover:bg-gray-200"
                )}
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => onConfirm(reason)}
                disabled={isLoading || (showReasonInput && !reason.trim())}
                className={clsx(
                  "flex-1 py-4 rounded-xl text-[1.5em] font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50",
                  currentConfig.btnColor
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
