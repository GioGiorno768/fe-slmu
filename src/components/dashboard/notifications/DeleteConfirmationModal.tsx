// src/components/dashboard/notifications/DeleteConfirmationModal.tsx
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import clsx from "clsx";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  message?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Hapus Notifikasi?",
  message = "Notifikasi yang sudah dihapus tidak dapat dikembalikan.",
}: DeleteConfirmationModalProps) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, isDeleting]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && onClose()}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-[1.8em] font-bold text-shortblack mb-2">
                  {title}
                </h3>
                <p className="text-[1.3em] text-grays leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className={clsx(
                    "flex-1 py-3 rounded-xl text-[1.4em] font-semibold transition-colors",
                    isDeleting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-slate-100 text-shortblack hover:bg-slate-200"
                  )}
                >
                  Batal
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className={clsx(
                    "flex-1 py-3 rounded-xl text-[1.4em] font-semibold transition-colors",
                    isDeleting
                      ? "bg-red-300 text-white cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
