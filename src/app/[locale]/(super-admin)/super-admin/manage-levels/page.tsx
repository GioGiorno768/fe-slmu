"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Shield } from "lucide-react";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import GlobalAlert from "@/components/dashboard/GlobalAlert";
import { useManageLevels } from "@/hooks/useManageLevels";
import UserLevelCard from "@/components/dashboard/super-admin/UserLevelCard";
import LevelFormModal from "@/components/dashboard/super-admin/LevelFormModal";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function ManageLevelsPage() {
  const {
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
  } = useManageLevels();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 font-figtree text-[10px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={clsx(
              "text-[2.8em] font-bold",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Manage User Levels
          </h1>
          <p
            className={clsx(
              "text-[1.4em] mt-1",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Configure progression levels, CPM bonuses, and benefits for users
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 bg-bluelight text-white rounded-xl hover:bg-blue-600 transition-colors text-[1.4em] font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Level
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={clsx(
            "rounded-2xl border p-5 text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-200"
          )}
        >
          <p className="text-[2.4em] font-bold text-bluelight">
            {stats.totalLevels}
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Total Levels
          </p>
        </div>
        <div
          className={clsx(
            "rounded-2xl border p-5 text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-200"
          )}
        >
          <p
            className={clsx(
              "text-[2.4em] font-bold",
              isDark ? "text-green-400" : "text-green-600"
            )}
          >
            {stats.maxCpmBonus}%
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Max CPM Bonus
          </p>
        </div>
        <div
          className={clsx(
            "rounded-2xl border p-5 text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-200"
          )}
        >
          <p
            className={clsx(
              "text-[2.4em] font-bold",
              isDark ? "text-purple-400" : "text-purple-600"
            )}
          >
            ${stats.maxThreshold}
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Max Threshold
          </p>
        </div>
        <div
          className={clsx(
            "rounded-2xl border p-5 text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-200"
          )}
        >
          <p
            className={clsx(
              "text-[2.4em] font-bold",
              isDark ? "text-orange-400" : "text-orange-600"
            )}
          >
            {stats.totalBenefits}
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Total Benefits
          </p>
        </div>
      </div>

      {/* Levels Grid */}
      {levels.length === 0 ? (
        <div
          className={clsx(
            "text-center py-16 rounded-2xl border",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-200"
          )}
        >
          <Shield
            className={clsx(
              "w-16 h-16 mx-auto mb-4",
              isDark ? "text-gray-600" : "text-gray-300"
            )}
          />
          <h3
            className={clsx(
              "text-[2em] font-bold mb-2",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            No Levels Yet
          </h3>
          <p
            className={clsx(
              "text-[1.4em] mb-4",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Create your first level to get started
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-3 bg-bluelight text-white rounded-xl hover:bg-blue-600 transition-colors text-[1.4em] font-medium"
          >
            <Plus className="w-5 h-5" />
            Create First Level
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {levels.map((level, index) => (
            <UserLevelCard
              key={level.id}
              level={level}
              index={index}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      <LevelFormModal
        isOpen={isModalOpen}
        editingLevel={editingLevel}
        formData={formData}
        isSaving={isSaving}
        onClose={closeModal}
        onSave={handleSave}
        onUpdateField={updateFormField}
        onAddBenefit={addBenefit}
        onRemoveBenefit={removeBenefit}
        onUpdateBenefit={updateBenefit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Level?"
        description={`Are you sure you want to delete "${deletingLevel?.name}"? Users at this level will need to be migrated.`}
        confirmLabel="Delete Level"
        cancelLabel="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Global Alert */}
      <GlobalAlert />
    </div>
  );
}
