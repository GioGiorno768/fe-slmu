"use client";

import { useAlert } from "@/hooks/useAlert";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function GlobalAlert() {
  const { isOpen, message, title, type, hideAlert } = useAlert();

  // Mapping icon & warna berdasarkan tipe
  const alertConfig = {
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      borderColor: "border-l-4 border-green-500",
      titleColor: "text-green-600 dark:text-green-400",
    },
    error: {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      borderColor: "border-l-4 border-red-500",
      titleColor: "text-red-600 dark:text-red-400",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      borderColor: "border-l-4 border-yellow-500",
      titleColor: "text-yellow-600 dark:text-yellow-400",
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-500" />,
      borderColor: "border-l-4 border-blue-500",
      titleColor: "text-blue-600 dark:text-blue-400",
    },
  };

  const config = alertConfig[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] font-figtree  text-[10px] w-full max-w-md px-4 pointer-events-none flex justify-center"
        >
          <div
            className={`
              pointer-events-auto flex items-center gap-4 p-4 rounded-lg shadow-2xl 
              bg-subcard ${config.borderColor} border border-gray-dashboard/30 w-full
            `}
          >
            <div className="shrink-0 mt-0.5">{config.icon}</div>
            <div className="flex-1 min-w-0">
              {title && (
                <h3
                  className={`text-[1.6em] font-bold mb-1 ${config.titleColor}`}
                >
                  {title}
                </h3>
              )}
              <p className="text-[1.6em] text-grays leading-snug">{message}</p>
            </div>
            <button
              onClick={hideAlert}
              className="shrink-0 text-grays hover:text-shortblack transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
