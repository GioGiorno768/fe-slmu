"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Loader2,
  Trash2,
  Info,
  AlertTriangle,
  AlertCircle,
  Clock,
  Pin,
  PinOff,
} from "lucide-react";
import clsx from "clsx";
import apiClient from "@/services/apiClient";
import { useAlert } from "@/hooks/useAlert";
import { useTheme } from "next-themes";

interface GlobalNotification {
  id: number;
  title: string;
  type: "info" | "warning" | "danger";
  body: string;
  is_pinned: boolean;
  created_at: string;
}

// Type config function that uses isDark
const getTypeConfig = (isDark: boolean) => ({
  info: {
    label: "Info",
    color: isDark
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : "bg-blue-100 text-blue-600 border-blue-200",
    icon: Info,
  },
  warning: {
    label: "Warning",
    color: isDark
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : "bg-yellow-100 text-yellow-600 border-yellow-200",
    icon: AlertTriangle,
  },
  danger: {
    label: "Danger",
    color: isDark
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : "bg-red-100 text-red-600 border-red-200",
    icon: AlertCircle,
  },
});

export default function GlobalNotificationSection() {
  const { showAlert } = useAlert();
  const [notifications, setNotifications] = useState<GlobalNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingPinId, setTogglingPinId] = useState<number | null>(null);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const TYPE_CONFIG = getTypeConfig(isDark);

  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"info" | "warning" | "danger">("info");
  const [body, setBody] = useState("");

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get("/admin/global-notifications");
      if (response.data?.data) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch global notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;

    setIsSending(true);
    try {
      const response = await apiClient.post("/admin/global-notifications", {
        title,
        type,
        body,
      });
      if (response.data?.data) {
        setNotifications([response.data.data, ...notifications]);
        // Reset form
        setTitle("");
        setBody("");
        setType("info");
        showAlert("Notification sent to all users!", "success");
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
      showAlert("Failed to send notification", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/admin/global-notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
      showAlert("Notification deleted", "info");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      showAlert("Failed to delete notification", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePin = async (id: number, currentPinned: boolean) => {
    setTogglingPinId(id);
    try {
      const response = await apiClient.patch(
        `/admin/global-notifications/${id}/pin`
      );
      if (response.data?.data) {
        setNotifications(
          notifications.map((n) =>
            n.id === id ? { ...n, is_pinned: response.data.data.is_pinned } : n
          )
        );
        showAlert(
          response.data.data.is_pinned
            ? "Notification pinned"
            : "Notification unpinned",
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      showAlert("Failed to toggle pin", "error");
    } finally {
      setTogglingPinId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-[2em] font-bold text-shortblack">
          Global Notifications
        </h2>
        <p className="text-[1.3em] text-grays mt-1">
          Kirim notifikasi ke semua user (termasuk yang baru register)
        </p>
      </div>

      {/* Create Form */}
      <div className="bg-subcard rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={clsx(
              "p-2.5 rounded-xl",
              isDark ? "bg-blue-500/20" : "bg-blue-100"
            )}
          >
            <Bell
              className={clsx(
                "w-5 h-5",
                isDark ? "text-blue-400" : "text-blue-600"
              )}
            />
          </div>
          <h3 className="text-[1.5em] font-bold text-shortblack">
            Send New Notification
          </h3>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-[1.2em] font-semibold text-grays block">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul notifikasi..."
            maxLength={100}
            className={clsx(
              "w-full px-4 py-3 bg-card border rounded-xl text-[1.3em] font-medium text-shortblack placeholder:text-gray-400 focus:outline-none focus:border-blue-400",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="text-[1.2em] font-semibold text-grays block">
            Type
          </label>
          <div className="flex gap-3">
            {(["info", "warning", "danger"] as const).map((t) => {
              const config = TYPE_CONFIG[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[1.2em] font-medium border-2 transition-all",
                    type === t
                      ? config.color + " border-current"
                      : isDark
                      ? "bg-card text-gray-500 border-gray-700 hover:border-gray-600"
                      : "bg-card text-gray-500 border-gray-200 hover:border-gray-300"
                  )}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-2">
          <label className="text-[1.2em] font-semibold text-grays block">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Isi notifikasi..."
            maxLength={500}
            rows={4}
            className={clsx(
              "w-full px-4 py-3 bg-card border rounded-xl text-[1.3em] font-medium text-shortblack placeholder:text-gray-400 focus:outline-none focus:border-blue-400 resize-none",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
          />
          <p
            className={clsx(
              "text-[1.1em] text-right",
              isDark ? "text-gray-500" : "text-gray-400"
            )}
          >
            {body.length}/500
          </p>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isSending || !title.trim() || !body.trim()}
          className={clsx(
            "flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[1.4em] font-semibold transition-all",
            title.trim() && body.trim()
              ? "bg-bluelight text-white hover:bg-blue-600 shadow-md"
              : "bg-bluelight/40 text-white/50 cursor-not-allowed"
          )}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isSending ? "Sending..." : "Send Notification"}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <h3 className="text-[1.5em] font-bold text-shortblack">
          Active Notifications ({notifications.length})
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-bluelight animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 bg-subcard rounded-2xl">
            <Bell
              className={clsx(
                "w-10 h-10 mx-auto mb-3",
                isDark ? "text-gray-600" : "text-gray-300"
              )}
            />
            <p className="text-[1.4em] font-medium text-gray-400">
              No global notifications
            </p>
            <p
              className={clsx(
                "text-[1.2em] mt-1",
                isDark ? "text-gray-600" : "text-gray-300"
              )}
            >
              Send your first notification above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const config = TYPE_CONFIG[notification.type];
              return (
                <div
                  key={notification.id}
                  className={clsx(
                    "bg-card rounded-xl p-4 border shadow-sm",
                    isDark ? "border-gray-800" : "border-gray-100"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={clsx(
                        "p-2 rounded-lg shrink-0",
                        config.color.split(" ")[0]
                      )}
                    >
                      <config.icon
                        className={clsx("w-5 h-5", config.color.split(" ")[1])}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded-md text-[1em] font-medium",
                            config.color
                          )}
                        >
                          {config.label}
                        </span>
                        <span className="text-[1.1em] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-[1.4em] font-semibold text-shortblack">
                        {notification.title}
                      </p>
                      <p className="text-[1.2em] text-grays mt-1 whitespace-pre-wrap">
                        {notification.body}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          handleTogglePin(
                            notification.id,
                            notification.is_pinned
                          )
                        }
                        disabled={togglingPinId === notification.id}
                        className={clsx(
                          "p-2 rounded-lg transition-colors shrink-0",
                          notification.is_pinned
                            ? "text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        )}
                        title={
                          notification.is_pinned
                            ? "Unpin notification"
                            : "Pin notification"
                        }
                      >
                        {togglingPinId === notification.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : notification.is_pinned ? (
                          <Pin className="w-5 h-5" />
                        ) : (
                          <PinOff className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        disabled={deletingId === notification.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      >
                        {deletingId === notification.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div
        className={clsx(
          "flex items-start gap-3 p-4 rounded-xl border",
          isDark
            ? "bg-blue-500/10 border-blue-500/30"
            : "bg-blue-50 border-blue-200"
        )}
      >
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div
          className={clsx(
            "text-[1.2em]",
            isDark ? "text-blue-300" : "text-blue-700"
          )}
        >
          <p className="font-semibold mb-1">Cara kerja:</p>
          <ol
            className={clsx(
              "list-decimal list-inside space-y-1",
              isDark ? "text-blue-400" : "text-blue-600"
            )}
          >
            <li>Admin kirim notification</li>
            <li>Semua user melihatnya di notification bell 🔔</li>
            <li>User baru yang register juga melihat notifications aktif</li>
            <li>Hapus notification = hilang dari semua user</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
