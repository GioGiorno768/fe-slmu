// src/components/dashboard/notifications/NotificationDetailModal.tsx
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Megaphone,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import type { NotificationItem } from "@/types/type";

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificationItem | null;
  onDelete: () => void;
  isDeleting?: boolean;
}

export default function NotificationDetailModal({
  isOpen,
  onClose,
  notification,
  onDelete,
  isDeleting = false,
}: NotificationDetailModalProps) {
  // Close on ESC
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
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!notification) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-8 h-8 text-orange-500" />;
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "alert":
        return <ShieldAlert className="w-8 h-8 text-red-500" />;
      default:
        return <Megaphone className="w-8 h-8 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-orange-50";
      case "success":
        return "bg-green-50";
      case "alert":
        return "bg-red-50";
      default:
        return "bg-blue-50";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      payment: "Pembayaran",
      link: "Link",
      account: "Akun",
      event: "Event",
      system: "Sistem",
    };
    return labels[category] || category;
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-[1.8em] font-bold text-shortblack">
                Detail Notifikasi
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-grays transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex flex-col gap-6">
                {/* Icon & Time */}
                <div className="flex items-start justify-between">
                  <div
                    className={clsx(
                      "w-16 h-16 rounded-2xl flex items-center justify-center",
                      getBgColor(notification.type)
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="text-right">
                    <span className="text-[1.1em] text-gray-400 block">
                      {formatDateTime(notification.timestamp)}
                    </span>
                    <span
                      className={clsx(
                        "text-[1em] font-bold px-2 py-0.5 rounded mt-1 inline-block",
                        notification.isRead
                          ? "bg-gray-100 text-gray-600"
                          : "bg-blue-100 text-blue-700"
                      )}
                    >
                      {notification.isRead ? "Sudah Dibaca" : "Belum Dibaca"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-[2em] font-bold text-shortblack leading-tight mb-2">
                    {notification.title}
                  </h3>
                  <span className="text-[1.1em] font-bold px-3 py-1 rounded-full bg-slate-100 text-grays uppercase tracking-wide">
                    {getCategoryLabel(notification.category)}
                  </span>
                </div>

                {/* Message */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[1.4em] text-shortblack leading-relaxed whitespace-pre-wrap">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center">
              {notification.isGlobal ? (
                <p className="text-[1.2em] text-gray-400 italic">
                  📌 Pengumuman dari Admin
                </p>
              ) : (
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className={clsx(
                    "text-[1.3em] font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                    isDeleting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "text-red-500 hover:bg-red-50"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-[1.3em] font-semibold text-grays hover:text-shortblack px-4 py-2 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
