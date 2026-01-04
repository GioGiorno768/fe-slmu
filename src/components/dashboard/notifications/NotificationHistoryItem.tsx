// src/components/dashboard/notifications/NotificationHistoryItem.tsx
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Megaphone,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import clsx from "clsx";
import type { NotificationItem } from "@/types/type";

interface NotificationHistoryItemProps {
  item: NotificationItem;
  onClick: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export default function NotificationHistoryItem({
  item,
  onClick,
  onDelete,
  isDeleting = false,
}: NotificationHistoryItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Helper Icon
  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
        );
      case "success":
        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />;
      case "alert":
        return <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />;
      default:
        return <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
    }
  };

  // Helper Color
  const getBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-orange-100 border-orange-200";
      case "success":
        return "bg-green-100 border-green-200";
      case "alert":
        return "bg-red-100 border-red-200";
      default:
        return "bg-blue-100 border-blue-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment":
        return "bg-green-100 text-green-700";
      case "link":
        return "bg-blue-100 text-blue-700";
      case "account":
        return "bg-purple-100 text-purple-700";
      case "event":
        return "bg-orange-100 text-orange-700";
      case "system":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={clsx(
        "relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer group",
        item.isRead
          ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
          : "bg-blue-50/50 border-blue-100 hover:border-blue-200 hover:shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={clsx(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 border",
            getBgColor(item.type)
          )}
        >
          {getIcon(item.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h4
                className={clsx(
                  "text-[1.5em] font-bold leading-tight truncate",
                  item.isRead ? "text-shortblack" : "text-bluelight"
                )}
              >
                {item.title}
              </h4>
              {!item.isRead && (
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              )}
            </div>
            <span className="text-[1.2em] font-mono text-grays bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
              {formatTime(item.timestamp)}
            </span>
          </div>

          <p className="text-[1.3em] text-grays leading-snug mb-3 line-clamp-2">
            {item.message}
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  "text-[1em] font-bold px-2 py-0.5 rounded uppercase tracking-wide",
                  getCategoryColor(item.category)
                )}
              >
                {item.category}
              </span>
              {item.isGlobal && (
                <span className="text-[1em] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 uppercase tracking-wide">
                  📌 Global
                </span>
              )}
            </div>

            {/* Delete Button - Show on hover */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered && !item.isGlobal ? 1 : 0,
                scale: isHovered && !item.isGlobal ? 1 : 0.8,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleting || item.isGlobal}
              className={clsx(
                "p-2 rounded-lg transition-colors flex-shrink-0",
                isDeleting
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              )}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
