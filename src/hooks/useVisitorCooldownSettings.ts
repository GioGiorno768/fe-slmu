// src/hooks/useVisitorCooldownSettings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as visitorCooldownService from "@/services/visitorCooldownService";
import type { VisitorCooldownSettings } from "@/services/visitorCooldownService";

export function useVisitorCooldownSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["visitorCooldownSettings"],
    queryFn: visitorCooldownService.getVisitorCooldownSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: visitorCooldownService.updateVisitorCooldownSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitorCooldownSettings"] });
    },
  });

  return {
    settings: settings ?? {
      enabled: true,
      max_links_per_user: 3,
      cooldown_hours: 24,
    },
    isLoading,
    error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
