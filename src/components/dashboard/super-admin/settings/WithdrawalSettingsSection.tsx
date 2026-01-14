"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  Wallet,
  Building2,
  Bitcoin,
  Filter,
} from "lucide-react";
import clsx from "clsx";
import { usePaymentTemplates } from "@/hooks/usePaymentTemplates";
import type { PaymentMethodTemplate } from "@/services/paymentTemplateAdminService";
import PaymentMethodCard from "../PaymentMethodCard";
import PaymentMethodModal from "../PaymentMethodModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import WithdrawalLimitsCard from "./WithdrawalLimitsCard";
import { useAlert } from "@/hooks/useAlert";
import apiClient from "@/services/apiClient";
import { useTheme } from "next-themes";

const TYPE_FILTERS = [
  { value: "all", label: "All", icon: Filter },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "bank", label: "Bank", icon: Building2 },
  { value: "crypto", label: "Crypto", icon: Bitcoin },
];

interface WithdrawalLimits {
  min_amount: number;
  max_amount: number;
  limit_count: number;
  limit_days: number;
}

export default function WithdrawalSettingsSection() {
  const { showAlert } = useAlert();
  const {
    templates,
    isLoading,
    isSubmitting,
    filter,
    setFilter,
    stats,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleActive,
  } = usePaymentTemplates();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Withdrawal Limits state - connected to backend
  const [withdrawalLimits, setWithdrawalLimits] = useState<WithdrawalLimits>({
    min_amount: 2.0,
    max_amount: 0,
    limit_count: 0,
    limit_days: 1,
  });
  const [isLimitsLoading, setIsLimitsLoading] = useState(true);

  // Fetch withdrawal limits on mount
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await apiClient.get("/admin/settings/withdrawal");
        // Backend returns {status: "success"} not {success: true}
        if (response.data.status === "success") {
          setWithdrawalLimits(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch withdrawal limits:", error);
      } finally {
        setIsLimitsLoading(false);
      }
    };
    fetchLimits();
  }, []);

  const handleUpdateLimits = async (limits: WithdrawalLimits) => {
    try {
      const response = await apiClient.put(
        "/admin/settings/withdrawal",
        limits
      );
      // Backend returns {status: "success"} not {success: true}
      if (response.data.status === "success") {
        setWithdrawalLimits(response.data.data);
        showAlert(
          "Withdrawal limits updated successfully!",
          "success",
          "Settings Saved"
        );
      }
    } catch (error) {
      console.error("Failed to update withdrawal limits:", error);
      showAlert("Failed to update withdrawal limits", "error", "Error");
      throw error;
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<PaymentMethodTemplate | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTemplate, setDeletingTemplate] =
    useState<PaymentMethodTemplate | null>(null);

  const openCreateModal = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (template: PaymentMethodTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingTemplate) {
      await handleUpdate(editingTemplate.id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleDeleteClick = (template: PaymentMethodTemplate) => {
    setDeletingTemplate(template);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingTemplate) {
      await handleDelete(deletingTemplate.id);
      setIsConfirmOpen(false);
      setDeletingTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Withdrawal Limits Card */}
      <WithdrawalLimitsCard
        limits={withdrawalLimits}
        onUpdate={handleUpdateLimits}
        isLoading={isLimitsLoading}
      />

      {/* Payment Methods Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className={clsx(
              "text-[2em] font-bold",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Payment Methods
          </h2>
          <p
            className={clsx(
              "text-[1.3em]",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Manage available payment methods for user withdrawals
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className={clsx(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[1.3em] transition-all shadow-lg",
            isDark
              ? "bg-bluelight text-white hover:bg-blue-600"
              : "bg-shortblack text-white hover:bg-opacity-90"
          )}
        >
          <Plus className="w-4 h-4" />
          Add Method
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className={clsx(
            "rounded-xl p-4 border",
            isDark ? "bg-card border-gray-800" : "bg-card border-gray-100"
          )}
        >
          <p
            className={clsx(
              "text-[2em] font-bold",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            {stats.total}
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Total Methods
          </p>
        </div>
        <div
          className={clsx(
            "rounded-xl p-4 border",
            isDark
              ? "bg-green-500/10 border-green-500/30"
              : "bg-green-50 border-green-100"
          )}
        >
          <p
            className={clsx(
              "text-[2em] font-bold",
              isDark ? "text-green-400" : "text-green-600"
            )}
          >
            {stats.active}
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-green-400" : "text-green-700"
            )}
          >
            Active
          </p>
        </div>
        <div
          className={clsx(
            "rounded-xl p-4 border",
            isDark
              ? "bg-purple-500/10 border-purple-500/30"
              : "bg-purple-50 border-purple-100"
          )}
        >
          <p
            className={clsx(
              "text-[2em] font-bold",
              isDark ? "text-purple-400" : "text-purple-600"
            )}
          >
            {stats.byType.wallet}
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-purple-400" : "text-purple-700"
            )}
          >
            Wallets
          </p>
        </div>
        <div
          className={clsx(
            "rounded-xl p-4 border",
            isDark
              ? "bg-blue-500/10 border-blue-500/30"
              : "bg-blue-50 border-blue-100"
          )}
        >
          <p
            className={clsx(
              "text-[2em] font-bold",
              isDark ? "text-blue-400" : "text-blue-600"
            )}
          >
            {stats.byType.bank}
          </p>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-blue-400" : "text-blue-700"
            )}
          >
            Banks
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_FILTERS.map((f) => {
          const isActive = (filter.type || "all") === f.value;
          return (
            <button
              key={f.value}
              onClick={() =>
                setFilter({
                  ...filter,
                  type: f.value === "all" ? undefined : f.value,
                })
              }
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-[1.2em] transition-all",
                isActive
                  ? isDark
                    ? "bg-bluelight text-white shadow-md"
                    : "bg-shortblack text-white shadow-md"
                  : isDark
                  ? "bg-card text-gray-400 border border-gray-700 hover:border-gray-600"
                  : "bg-card text-grays border border-gray-200 hover:border-gray-300"
              )}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
        </div>
      ) : templates.length === 0 ? (
        <div
          className={clsx(
            "rounded-2xl border p-12 text-center",
            isDark ? "bg-card border-gray-800" : "bg-card border-gray-100"
          )}
        >
          <div
            className={clsx(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4",
              isDark ? "bg-blue-500/10" : "bg-blue-50"
            )}
          >
            <Wallet className="w-8 h-8 text-bluelight" />
          </div>
          <h3
            className={clsx(
              "text-[1.8em] font-bold mb-2",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            No Payment Methods
          </h3>
          <p
            className={clsx(
              "text-[1.3em] mb-4",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Add your first payment method template
          </p>
          <button
            onClick={openCreateModal}
            className="bg-bluelight text-white px-6 py-2.5 rounded-xl font-semibold text-[1.3em]"
          >
            Add First Method
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <PaymentMethodCard
              key={template.id}
              template={template}
              onEdit={openEditModal}
              onDelete={handleDeleteClick}
              onToggleActive={() => handleToggleActive(template.id)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        onSubmit={handleSubmit}
        editingTemplate={editingTemplate}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingTemplate(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Payment Method?"
        description={`Are you sure you want to delete "${deletingTemplate?.name}"? Users will no longer be able to use this payment method.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
