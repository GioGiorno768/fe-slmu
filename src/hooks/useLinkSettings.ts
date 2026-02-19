// src/hooks/useLinkSettings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as linkSettingsService from "@/services/linkSettingsService";
import type { LinkSettings } from "@/services/linkSettingsService";

export function useLinkSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["linkSettings"],
    queryFn: linkSettingsService.getLinkSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: linkSettingsService.updateLinkSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linkSettings"] });
    },
  });

  return {
    settings: settings ?? {
      min_wait_seconds: 12,
      expiry_seconds: 180,
      mass_link_limit: 20,
      guest_link_limit: 3,
      guest_link_limit_days: 1,
      modal_wait_seconds: 60,
      modal_ad_clicks_required: 5,
      modal_time_reduction_per_click: 10,
    },
    isLoading,
    error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
