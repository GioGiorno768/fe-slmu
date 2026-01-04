"use client";

import { Plus, Loader2, Shield } from "lucide-react";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import GlobalAlert from "@/components/dashboard/GlobalAlert";
import { useManageLevels } from "@/hooks/useManageLevels";
import UserLevelCard from "@/components/dashboard/super-admin/UserLevelCard";
import LevelFormModal from "@/components/dashboard/super-admin/LevelFormModal";

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
          <h1 className="text-[2.8em] font-bold text-shortblack">
            Manage User Levels
          </h1>
          <p className="text-[1.4em] text-grays mt-1">
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
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-[2.4em] font-bold text-bluelight">
            {stats.totalLevels}
          </p>
          <p className="text-[1.2em] text-grays">Total Levels</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-[2.4em] font-bold text-green-600">
            {stats.maxCpmBonus}%
          </p>
          <p className="text-[1.2em] text-grays">Max CPM Bonus</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-[2.4em] font-bold text-purple-600">
            ${stats.maxThreshold}
          </p>
          <p className="text-[1.2em] text-grays">Max Threshold</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-[2.4em] font-bold text-orange-600">
            {stats.totalBenefits}
          </p>
          <p className="text-[1.2em] text-grays">Total Benefits</p>
        </div>
      </div>

      {/* Levels Grid */}
      {levels.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-[2em] font-bold text-shortblack mb-2">
            No Levels Yet
          </h3>
          <p className="text-[1.4em] text-grays mb-4">
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
