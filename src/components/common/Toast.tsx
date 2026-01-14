// Toast Notification Component
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Info, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const colorMap = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500",
};

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  const Icon = iconMap[type];

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-subcard border border-gray-dashboard/30 min-w-[300px] max-w-md"
        >
          <div className={`${colorMap[type]} rounded-full p-1`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <p className="flex-1 text-sm font-medium text-shortblack">
            {message}
          </p>
          <button
            onClick={onClose}
            className="text-grays hover:text-shortblack transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
