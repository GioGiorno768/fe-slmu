// src/hooks/useNotificationHistory.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as notifService from "@/services/notificationService";
import type { NotificationItem } from "@/types/type";

export type StatusFilterType = "all" | "unread" | "read";

// Query key for notifications (shared with useNotifications)
const NOTIFICATIONS_KEY = ["notifications"];

/**
 * Extended notification hook for the full History/List page
 * Adds client-side status filtering, search, and pagination
 */
export function useNotificationHistory() {
  const queryClient = useQueryClient();

  // Filter/Search/Page state
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch all notifications with React Query (shared cache)
  const { data, isLoading, refetch } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => notifService.getNotifications(),
    staleTime: 30 * 1000,
  });

  const pinnedNotifications = data?.pinned || [];
  const allNotifications = data?.notifications || [];

  // Client-side filter by status
  const statusFilteredNotifications = useMemo(() => {
    if (statusFilter === "all") return allNotifications;
    if (statusFilter === "unread")
      return allNotifications.filter((n: NotificationItem) => !n.isRead);
    return allNotifications.filter((n: NotificationItem) => n.isRead);
  }, [allNotifications, statusFilter]);

  // Calculate total pages based on filtered results
  const totalItems = statusFilteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Paginate
  const paginatedNotifications = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return statusFilteredNotifications.slice(start, start + itemsPerPage);
  }, [statusFilteredNotifications, page, itemsPerPage]);

  // Reset page when filter changes
  const handleStatusFilterChange = useCallback(
    (newFilter: StatusFilterType) => {
      setStatusFilter(newFilter);
      setPage(1);
    },
    []
  );

  // Reset page when search changes
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: notifService.markAsRead,
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
          notifications:
            old?.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ) || [],
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

  // Delete mutation
  const deleteMutation = useMutation({
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

  const deleteNotification = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const unreadCount = allNotifications.filter(
    (n: NotificationItem) => !n.isRead
  ).length;

  return {
    // Data
    pinnedNotifications,
    notifications: paginatedNotifications,
    allNotifications: statusFilteredNotifications,
    unreadCount,
    isLoading,

    // Pagination
    page,
    setPage,
    totalPages,

    // Filters
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    search,
    setSearch: handleSearchChange,

    // Actions
    markRead,
    deleteNotification,
    refresh: refetch,
  };
}
