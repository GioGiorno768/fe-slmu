// src/services/notificationService.ts
import type { NotificationItem, NotificationCategory } from "@/types/type";
import apiClient from "./apiClient";

/**
 * Response type from notifications API
 */
export interface NotificationsResponse {
  pinned: NotificationItem[];
  notifications: NotificationItem[];
}

/**
 * Map backend notification to frontend NotificationItem type
 */
function mapNotification(notification: any): NotificationItem {
  const data = notification.data || {};

  // Map backend type to frontend type
  const typeMap: Record<string, NotificationItem["type"]> = {
    info: "info",
    success: "success",
    warning: "warning",
    danger: "alert",
    alert: "alert",
  };

  // Map category or default to "system"
  const category: NotificationCategory = data.category || "system";

  return {
    id: notification.id,
    title: data.title || data.body || "Notification",
    message: data.message || data.body || "",
    type: typeMap[data.type] || "info",
    category: category,
    isRead: notification.read_at !== null,
    timestamp: notification.created_at,
    actionUrl: data.url || undefined,
    isGlobal: data.is_global || false,
  };
}

/**
 * Get all notifications for the logged-in user
 * Returns { pinned, notifications } where pinned are global notifications
 */
export async function getNotifications(): Promise<NotificationsResponse> {
  try {
    const response = await apiClient.get("/notifications");

    // DEBUG: Log raw response to see structure
    console.log("🔔 Notifications API raw response:", response.data);

    // Handle new response format with pinned + notifications
    const pinnedRaw = response.data.data?.pinned || [];
    const notificationsRaw = response.data.data?.notifications || [];

    console.log(
      "🔔 Pinned count:",
      pinnedRaw.length,
      "Notifications count:",
      notificationsRaw.length
    );

    return {
      pinned: pinnedRaw.map(mapNotification),
      notifications: notificationsRaw.map(mapNotification),
    };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { pinned: [], notifications: [] };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const response = await apiClient.get("/notifications/unread");
    return response.data.data?.unread_count ?? 0;
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return 0;
  }
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(id: string): Promise<boolean> {
  try {
    await apiClient.post(`/notifications/${id}/read`);
    return true;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<boolean> {
  try {
    await apiClient.post("/notifications/read-all");
    return true;
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return false;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/notifications/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return false;
  }
}
