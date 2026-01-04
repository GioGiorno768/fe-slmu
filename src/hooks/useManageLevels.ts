"use client";

import { useState, useEffect, useCallback } from "react";
import { useAlert } from "@/hooks/useAlert";
import * as manageLevelsService from "@/services/manageLevelsService";
import type { LevelConfig } from "@/services/manageLevelsService";

// Color themes
export const COLOR_THEMES = [
  {
    id: "blue",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    label: "Blue",
  },
  {
    id: "green",
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    label: "Green",
  },
  {
    id: "purple",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
    label: "Purple",
  },
  {
    id: "orange",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
    label: "Orange",
  },
  {
    id: "red",
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    label: "Red",
  },
  {
    id: "yellow",
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    label: "Yellow",
  },
];

export interface LevelFormData {
  name: string;
  icon: string;
  minEarnings: number;
  cpmBonus: number;
  benefits: string[];
  colorTheme: string;
}

const defaultFormData: LevelFormData = {
  name: "",
  icon: "shield",
  minEarnings: 0,
  cpmBonus: 0,
  benefits: [""],
  colorTheme: "blue",
};

export function useManageLevels() {
  const { showAlert } = useAlert();
  const [levels, setLevels] = useState<LevelConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingLevel, setDeletingLevel] = useState<LevelConfig | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<LevelFormData>(defaultFormData);

  // Fetch levels on mount
  const fetchLevels = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await manageLevelsService.getLevels();
      setLevels(data);
    } catch (error) {
      showAlert("Failed to load levels", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const openCreateModal = () => {
    setEditingLevel(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (level: LevelConfig) => {
    setEditingLevel(level);
    const theme =
      COLOR_THEMES.find((t) => t.iconColor === level.iconColor) ||
      COLOR_THEMES[0];
    setFormData({
      name: level.name,
      icon: level.icon,
      minEarnings: level.minEarnings,
      cpmBonus: level.cpmBonus,
      benefits: level.benefits.length > 0 ? level.benefits : [""],
      colorTheme: theme.id,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLevel(null);
  };

  const handleSave = async () => {
    const theme =
      COLOR_THEMES.find((t) => t.id === formData.colorTheme) || COLOR_THEMES[0];
    const levelData = {
      name: formData.name,
      icon: formData.icon,
      minEarnings: formData.minEarnings,
      cpmBonus: formData.cpmBonus,
      benefits: formData.benefits.filter((b) => b.trim() !== ""),
      iconColor: theme.iconColor,
      bgColor: theme.bgColor,
      borderColor: theme.borderColor,
    };

    setIsSaving(true);
    try {
      if (editingLevel) {
        await manageLevelsService.updateLevel(editingLevel.id, levelData);
        showAlert(`Level "${levelData.name}" updated successfully`, "success");
      } else {
        await manageLevelsService.createLevel(levelData);
        showAlert(`Level "${levelData.name}" created successfully`, "success");
      }
      closeModal();
      fetchLevels();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save level";
      showAlert(errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (level: LevelConfig) => {
    setDeletingLevel(level);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingLevel) return;

    setIsDeleting(true);
    try {
      await manageLevelsService.deleteLevel(deletingLevel.id);
      showAlert(`Level "${deletingLevel.name}" deleted`, "success");
      fetchLevels();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete level";
      showAlert(errorMessage, "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setDeletingLevel(null);
    }
  };

  const closeDeleteModal = () => {
    setDeleteConfirmOpen(false);
    setDeletingLevel(null);
  };

  // Form helpers
  const addBenefit = () => {
    setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => (i === index ? value : b)),
    }));
  };

  const updateFormField = <K extends keyof LevelFormData>(
    field: K,
    value: LevelFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Stats computed
  const stats = {
    totalLevels: levels.length,
    maxCpmBonus:
      levels.length > 0 ? Math.max(...levels.map((l) => l.cpmBonus)) : 0,
    maxThreshold:
      levels.length > 0 ? Math.max(...levels.map((l) => l.minEarnings)) : 0,
    totalBenefits: levels.reduce((acc, l) => acc + l.benefits.length, 0),
  };

  return {
    // Data
    levels,
    stats,
    isLoading,
    isSaving,
    isDeleting,

    // Modal state
    isModalOpen,
    editingLevel,
    formData,

    // Delete modal
    deleteConfirmOpen,
    deletingLevel,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
    confirmDelete,
    closeDeleteModal,

    // Form helpers
    addBenefit,
    removeBenefit,
    updateBenefit,
    updateFormField,
  };
}
