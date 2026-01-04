// Modal/Popup Component - For critical notifications
"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "warning" | "info";
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
  buttonLabel = "Mengerti",
  onButtonClick,
}: ModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const typeConfig = {
    error: {
      bgIcon: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bgIcon: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bgIcon: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const config = typeConfig[type];

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-[3em] relative text-[10px]"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-[1.5em] right-[1.5em] text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icon */}
              <div
                className={`w-[5em] h-[5em] ${config.bgIcon} rounded-full flex items-center justify-center mx-auto mb-[2em]`}
              >
                <AlertTriangle
                  className={`w-[2.5em] h-[2.5em] ${config.iconColor}`}
                />
              </div>

              {/* Title */}
              <h2 className="text-[2.2em] font-bold text-center text-shortblack mb-[1em]">
                {title}
              </h2>

              {/* Message */}
              <p className="text-[1.6em] text-center text-grays mb-[3em] leading-relaxed">
                {message}
              </p>

              {/* Button */}
              <button
                onClick={onButtonClick ?? onClose}
                className={`w-full ${config.buttonBg} text-white text-[1.6em] font-semibold py-[1.2em] rounded-full transition-colors`}
              >
                {buttonLabel}
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
