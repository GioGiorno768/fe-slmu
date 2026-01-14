"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Settings } from "lucide-react";
import { useAdLevels } from "@/hooks/useAdLevels";
import { useGlobalFeatures } from "@/hooks/useGlobalFeatures";
import AdLevelCard from "@/components/dashboard/super-admin/AdLevelCard";
import AdLevelModal from "@/components/dashboard/super-admin/AdLevelModal";
import GlobalFeatureModal from "@/components/dashboard/super-admin/GlobalFeatureModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import GlobalAlert from "@/components/dashboard/GlobalAlert";
import { AdLevelConfig } from "@/services/adLevelService";
import { Link } from "@/i18n/routing";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function AdsConfigurationPage() {
  const {
    levels,
    isLoading,
    isSubmitting,
    handleUpdate,
    handleToggleEnabled,
    handleSetDefault,
    handleSetRecommended,
  } = useAdLevels();

  // Global features hook
  const {
    features: globalFeatures,
    isLoading: isFeaturesLoading,
    handleCreate: handleCreateFeature,
    handleUpdate: handleUpdateFeature,
    handleDelete: handleDeleteFeature,
  } = useGlobalFeatures();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<AdLevelConfig | null>(null);

  // Pending default confirmation
  const [isDefaultConfirmOpen, setIsDefaultConfirmOpen] = useState(false);
  const [pendingDefaultLevel, setPendingDefaultLevel] =
    useState<AdLevelConfig | null>(null);

  // Pending recommended confirmation
  const [isRecommendedConfirmOpen, setIsRecommendedConfirmOpen] =
    useState(false);
  const [pendingRecommendedLevel, setPendingRecommendedLevel] =
    useState<AdLevelConfig | null>(null);

  const openEditModal = (level: AdLevelConfig) => {
    setEditingLevel(level);
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingLevel) {
      await handleUpdate(editingLevel.id, data);
    }
  };

  const handleToggle = async (level: AdLevelConfig) => {
    await handleToggleEnabled(level.id);
  };

  const onSetDefault = (level: AdLevelConfig) => {
    setPendingDefaultLevel(level);
    setIsDefaultConfirmOpen(true);
  };

  const confirmSetDefault = async () => {
    if (pendingDefaultLevel) {
      await handleSetDefault(pendingDefaultLevel.id);
      setIsDefaultConfirmOpen(false);
      setPendingDefaultLevel(null);
    }
  };

  const onSetRecommended = (level: AdLevelConfig) => {
    setPendingRecommendedLevel(level);
    setIsRecommendedConfirmOpen(true);
  };

  const confirmSetRecommended = async () => {
    if (pendingRecommendedLevel) {
      await handleSetRecommended(pendingRecommendedLevel.id);
      setIsRecommendedConfirmOpen(false);
      setPendingRecommendedLevel(null);
    }
  };

  return (
    <div className="space-y-8 pb-10 font-figtree text-[10px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className={clsx(
              "text-[2.4em] font-bold",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Ads Configuration
          </h1>
          <p
            className={clsx(
              "text-[1.4em]",
              isDark ? "text-gray-400" : "text-gray-400"
            )}
          >
            Manage ad levels, features, and enable/disable levels
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/super-admin/settings#cpc-rates"
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-[1.4em] hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            <Settings className="w-5 h-5" />
            Configure CPC
          </Link>

          <button
            onClick={() => setIsFeatureModalOpen(true)}
            className="flex items-center gap-2 bg-bluelight text-white px-6 py-3 rounded-xl font-semibold text-[1.4em] hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Add Feature
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-bluelight" />
        </div>
      ) : (
        <>
          {/* Info Banner */}
          <div
            className={clsx(
              "rounded-2xl p-4 border",
              isDark
                ? "bg-blue-500/10 border-blue-500/30"
                : "bg-blue-50 border-blue-200"
            )}
          >
            <p
              className={clsx(
                "text-[1.3em]",
                isDark ? "text-blue-300" : "text-blue-800"
              )}
            >
              <strong>Note:</strong> Ad levels are fixed (1-4). You can edit
              their settings or enable/disable them, but cannot add or delete
              levels.
            </p>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5">
            {levels.map((level, index) => (
              <AdLevelCard
                key={level.id}
                level={level}
                onEdit={openEditModal}
                onToggleEnabled={handleToggle}
                onSetDefault={onSetDefault}
                isDefault={level.isDefault || false}
                onSetPopular={onSetRecommended}
                isPopular={level.isRecommended || false}
                index={index}
                globalFeatures={globalFeatures}
              />
            ))}
          </div>

          {/* Stats Summary */}
          <div
            className={clsx(
              "rounded-2xl border p-6",
              isDark ? "bg-card border-gray-800" : "bg-white border-gray-200"
            )}
          >
            <h3
              className={clsx(
                "text-[1.6em] font-bold mb-4",
                isDark ? "text-white" : "text-shortblack"
              )}
            >
              Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={clsx(
                  "text-center p-4 rounded-xl",
                  isDark ? "bg-blue-500/20" : "bg-blue-50"
                )}
              >
                <p
                  className={clsx(
                    "text-[2.5em] font-bold",
                    isDark ? "text-blue-400" : "text-bluelight"
                  )}
                >
                  {levels.length}
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
                  "text-center p-4 rounded-xl",
                  isDark ? "bg-green-500/20" : "bg-green-50"
                )}
              >
                <p
                  className={clsx(
                    "text-[2.5em] font-bold",
                    isDark ? "text-green-400" : "text-green-600"
                  )}
                >
                  {levels.filter((l) => l.isEnabled).length}
                </p>
                <p
                  className={clsx(
                    "text-[1.2em]",
                    isDark ? "text-gray-400" : "text-grays"
                  )}
                >
                  Enabled
                </p>
              </div>
              <div
                className={clsx(
                  "text-center p-4 rounded-xl",
                  isDark ? "bg-orange-500/20" : "bg-orange-50"
                )}
              >
                <p
                  className={clsx(
                    "text-[2.5em] font-bold",
                    isDark ? "text-orange-400" : "text-orange-600"
                  )}
                >
                  {Math.min(...levels.map((l) => l.revenueShare))}%-
                  {Math.max(...levels.map((l) => l.revenueShare))}%
                </p>
                <p
                  className={clsx(
                    "text-[1.2em]",
                    isDark ? "text-gray-400" : "text-grays"
                  )}
                >
                  Revenue Range
                </p>
              </div>
              <div
                className={clsx(
                  "text-center p-4 rounded-xl",
                  isDark ? "bg-purple-500/20" : "bg-purple-50"
                )}
              >
                <p
                  className={clsx(
                    "text-[2.5em] font-bold",
                    isDark ? "text-purple-400" : "text-purple-600"
                  )}
                >
                  ${Math.min(...levels.map((l) => l.cpcRate)).toFixed(4)}
                </p>
                <p
                  className={clsx(
                    "text-[1.2em]",
                    isDark ? "text-gray-400" : "text-grays"
                  )}
                >
                  Min CPC
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal (only editing, no create) */}
      <AdLevelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLevel(null);
        }}
        onSubmit={handleSubmit}
        editingLevel={editingLevel}
        isSubmitting={isSubmitting}
        globalFeatures={globalFeatures}
      />

      {/* Set Default Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDefaultConfirmOpen}
        onClose={() => {
          setIsDefaultConfirmOpen(false);
          setPendingDefaultLevel(null);
        }}
        onConfirm={confirmSetDefault}
        title="Set as Default Ad Level?"
        description={`Set "${pendingDefaultLevel?.name}" as the default ad level for all new shortlinks?`}
        confirmLabel="Set as Default"
        cancelLabel="Cancel"
        type="info"
        isLoading={false}
      />

      {/* Set Recommended Confirmation Modal */}
      <ConfirmationModal
        isOpen={isRecommendedConfirmOpen}
        onClose={() => {
          setIsRecommendedConfirmOpen(false);
          setPendingRecommendedLevel(null);
        }}
        onConfirm={confirmSetRecommended}
        title="Set as Recommended Ad Level?"
        description={`Set "${pendingRecommendedLevel?.name}" as the recommended ad level? This will display a "RECOMMENDED" badge on this level.`}
        confirmLabel="Set as Recommended"
        cancelLabel="Cancel"
        type="info"
        isLoading={false}
      />

      {/* Global Feature Management Modal */}
      <GlobalFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        features={globalFeatures}
        onAdd={handleCreateFeature}
        onUpdate={handleUpdateFeature}
        onDelete={handleDeleteFeature}
        isLoading={isFeaturesLoading}
      />

      {/* Global Alert for notifications */}
      <GlobalAlert />
    </div>
  );
}
