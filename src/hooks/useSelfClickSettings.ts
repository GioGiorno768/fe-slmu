// src/hooks/useSelfClickSettings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as selfClickService from "@/services/selfClickService";
import type { SelfClickSettings } from "@/services/selfClickService";

export function useSelfClickSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["selfClickSettings"],
    queryFn: selfClickService.getSelfClickSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: selfClickService.updateSelfClickSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["selfClickSettings"] });
    },
  });

  return {
    settings: settings ?? {
      enabled: true,
      cpc_percentage: 30,
      daily_limit: 1,
    },
    isLoading,
    error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
