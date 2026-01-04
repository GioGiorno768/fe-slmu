import { useState, useEffect } from "react";
import * as adLevelService from "@/services/adLevelService";
import type { AdLevelConfig } from "@/services/adLevelService";
import { useAlert } from "@/hooks/useAlert";

export function useAdLevels() {
  const [levels, setLevels] = useState<AdLevelConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  // Fetch all levels
  const fetchLevels = async () => {
    setIsLoading(true);
    try {
      const data = await adLevelService.getAdLevels();
      setLevels(data);
    } catch (error) {
      showAlert("Failed to load ad levels", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // Update existing level
  const handleUpdate = async (
    id: string,
    data: Partial<Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">>
  ) => {
    setIsSubmitting(true);
    try {
      await adLevelService.updateAdLevel(id, data);
      // Refetch to get updated data
      await fetchLevels();
      showAlert("Ad level updated successfully", "success");
    } catch (error) {
      showAlert("Failed to update ad level", "error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle enable/disable
  const handleToggleEnabled = async (id: string) => {
    try {
      const result = await adLevelService.toggleAdLevelEnabled(id);
      // Update local state
      setLevels((prev) =>
        prev.map((level) =>
          level.id === id ? { ...level, isEnabled: result.isEnabled } : level
        )
      );
      showAlert(
        result.isEnabled
          ? `"${result.name}" is now enabled`
          : `"${result.name}" is now disabled`,
        "success"
      );
    } catch (error) {
      showAlert("Failed to toggle ad level", "error");
      throw error;
    }
  };

  // Set level as default
  const handleSetDefault = async (id: string) => {
    try {
      const result = await adLevelService.setAdLevelDefault(id);
      // Update local state - remove default from all, add to this one
      setLevels((prev) =>
        prev.map((level) => ({
          ...level,
          isDefault: level.id === id,
        }))
      );
      showAlert(`"${result.name}" set as default level`, "success");
    } catch (error) {
      showAlert("Failed to set default level", "error");
      throw error;
    }
  };

  // Set level as recommended
  const handleSetRecommended = async (id: string) => {
    try {
      const result = await adLevelService.setAdLevelRecommended(id);
      // Update local state - remove recommended from all, add to this one
      setLevels((prev) =>
        prev.map((level) => ({
          ...level,
          isRecommended: level.id === id,
        }))
      );
      showAlert(`"${result.name}" set as recommended level`, "success");
    } catch (error) {
      showAlert("Failed to set recommended level", "error");
      throw error;
    }
  };

  return {
    levels,
    isLoading,
    isSubmitting,
    handleUpdate,
    handleToggleEnabled,
    handleSetDefault,
    handleSetRecommended,
    refreshLevels: fetchLevels,
  };
}
