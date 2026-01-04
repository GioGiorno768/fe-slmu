"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as notifService from "@/services/notificationService";
import type { NotificationItem } from "@/types/type";

// Query key for notifications (shared across all components using this hook)
const NOTIFICATIONS_KEY = ["notifications"];

/**
 * Notification hook with React Query for shared caching
 * - All components using this hook share the same cache
 * - Mutations auto-invalidate cache so changes sync everywhere
 * - Returns pinned (global) and personal notifications separately
 */
export function useNotifications() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<string>("all");

  // Fetch all notifications with React Query (shared cache)
  const { data, isLoading, refetch } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => notifService.getNotifications(),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Extract pinned and notifications from response
  const pinnedNotifications = data?.pinned || [];
  const allNotifications = data?.notifications || [];

  // Filter personal notifications by category (client-side, instant)
  const filteredNotifications =
    category === "all"
      ? allNotifications
      : allNotifications.filter(
          (n: NotificationItem) => n.category === category
        );

  // Change filter (instant, no loading)
  const filterByCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  // Refresh - refetch from server
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Mark single notification as read
  const markReadMutation = useMutation({
    mutationFn: notifService.markAsRead,
    onMutate: async (id: string) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous =
        queryClient.getQueryData<notifService.NotificationsResponse>(
          NOTIFICATIONS_KEY
        );

      queryClient.setQueryData<notifService.NotificationsResponse>(
        NOTIFICATIONS_KEY,
        (old) => ({
          pinned: old?.pinned || [],
          notifications:
            old?.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ) || [],
        })
      );

      return { previous };
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
    },
  });

  // Mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: notifService.markAllAsRead,
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous =
        queryClient.getQueryData<notifService.NotificationsResponse>(
          NOTIFICATIONS_KEY
        );

      queryClient.setQueryData<notifService.NotificationsResponse>(
        NOTIFICATIONS_KEY,
        (old) => ({
          pinned: old?.pinned || [],
          notifications:
            old?.notifications.map((n) => ({ ...n, isRead: true })) || [],
        })
      );

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
    },
  });

  // Remove notification
  const removeMutation = useMutation({
    mutationFn: notifService.deleteNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous =
        queryClient.getQueryData<notifService.NotificationsResponse>(
          NOTIFICATIONS_KEY
        );

      queryClient.setQueryData<notifService.NotificationsResponse>(
        NOTIFICATIONS_KEY,
        (old) => ({
          pinned: old?.pinned || [],
          notifications: old?.notifications.filter((n) => n.id !== id) || [],
        })
      );

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
    },
  });

  const markRead = (id: string) => markReadMutation.mutate(id);
  const markAllRead = () => markAllReadMutation.mutate();
  const removeNotification = (id: string) => removeMutation.mutate(id);

  // Only count personal notifications as unread (pinned don't have read status)
  const unreadCount = allNotifications.filter(
    (n: NotificationItem) => !n.isRead
  ).length;

  return {
    pinnedNotifications, // Global notifications (always show at top)
    notifications: filteredNotifications, // Personal notifications (filtered)
    allNotifications, // Raw personal notifications
    unreadCount,
    isLoading,
    category,
    markRead,
    markAllRead,
    removeNotification,
    filterByCategory,
    refresh,
  };
}
