"use client";

import { useState, useEffect } from "react";
import { X, Wallet, Building2, Bitcoin } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import type {
  PaymentMethodTemplate,
  CreatePaymentTemplateData,
} from "@/services/paymentTemplateAdminService";
import {
  PAYMENT_TYPES,
  INPUT_TYPES,
  CURRENCIES,
  getInputTypesForPaymentType,
} from "@/services/paymentTemplateAdminService";
import { useTheme } from "next-themes";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentTemplateData) => Promise<void>;
  editingTemplate?: PaymentMethodTemplate | null;
  isSubmitting: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "wallet":
      return Wallet;
    case "bank":
      return Building2;
    case "crypto":
      return Bitcoin;
    default:
      return Wallet;
  }
};

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSubmit,
  editingTemplate,
  isSubmitting,
}: PaymentMethodModalProps) {
  const [formData, setFormData] = useState<CreatePaymentTemplateData>({
    name: "",
    type: "wallet",
    currency: "IDR",
    input_type: "phone",
    input_label: "",
    icon: null,
    fee: 0.5,
    min_amount: 50000,
    max_amount: 10000000,
    is_active: true,
    sort_order: 0,
  });

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Initialize form with editing data
  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        name: editingTemplate.name,
        type: editingTemplate.type,
        currency: editingTemplate.currency,
        input_type: editingTemplate.input_type,
        input_label: editingTemplate.input_label,
        icon: editingTemplate.icon,
        fee: editingTemplate.fee,
        min_amount: editingTemplate.min_amount,
        max_amount: editingTemplate.max_amount,
        is_active: editingTemplate.is_active,
        sort_order: editingTemplate.sort_order,
      });
    } else {
      setFormData({
        name: "",
        type: "wallet",
        currency: "IDR",
        input_type: "phone",
        input_label: "",
        icon: null,
        fee: 0.5,
        min_amount: 50000,
        max_amount: 10000000,
        is_active: true,
        sort_order: 0,
      });
    }
  }, [editingTemplate, isOpen]);

  // Update input_type when type changes
  useEffect(() => {
    const validInputTypes = getInputTypesForPaymentType(formData.type);
    if (!validInputTypes.find((it) => it.value === formData.input_type)) {
      setFormData((prev) => ({
        ...prev,
        input_type: validInputTypes[0]?.value || "phone",
      }));
    }
  }, [formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const availableInputTypes = getInputTypesForPaymentType(formData.type);
  const TypeIcon = getTypeIcon(formData.type);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 h-screen bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={clsx(
                "w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto font-figtree text-[10px]",
                isDark ? "bg-card" : "bg-white"
              )}
            >
              {/* Header */}
              <div
                className={clsx(
                  "flex justify-between items-center px-8 py-6 border-b",
                  isDark ? "border-gray-700" : "border-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isDark ? "bg-bluelight/20" : "bg-bluelight/10"
                    )}
                  >
                    <TypeIcon className="w-5 h-5 text-bluelight" />
                  </div>
                  <div>
                    <h2
                      className={clsx(
                        "text-[2em] font-bold",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      {editingTemplate
                        ? "Edit Payment Method"
                        : "Add Payment Method"}
                    </h2>
                    <p
                      className={clsx(
                        "text-[1.2em]",
                        isDark ? "text-gray-400" : "text-grays"
                      )}
                    >
                      Configure payment method template for users
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={clsx(
                    "p-2 rounded-full transition-colors",
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                >
                  <X
                    className={clsx(
                      "w-5 h-5",
                      isDark ? "text-gray-400" : "text-grays"
                    )}
                  />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                onWheel={(e) => e.stopPropagation()}
                className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
              >
                {/* Provider Name */}
                <div>
                  <label
                    className={clsx(
                      "block text-[1.3em] font-bold mb-2",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    Provider Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={clsx(
                      "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight outline-none transition-all text-[1.3em]",
                      isDark
                        ? "bg-subcard text-white placeholder:text-gray-500 focus:bg-card"
                        : "bg-gray-50 focus:bg-white"
                    )}
                    placeholder="e.g., GoPay, BCA, Bitcoin"
                    required
                  />
                </div>

                {/* Type & Currency Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Payment Type */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Payment Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as any,
                        })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight outline-none transition-all text-[1.3em] cursor-pointer",
                        isDark
                          ? "bg-subcard text-white focus:bg-card"
                          : "bg-gray-50 focus:bg-white"
                      )}
                    >
                      {PAYMENT_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight outline-none transition-all text-[1.3em] cursor-pointer",
                        isDark
                          ? "bg-subcard text-white focus:bg-card"
                          : "bg-gray-50 focus:bg-white"
                      )}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Input Type & Label Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Input Type */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Input Type
                    </label>
                    <select
                      value={formData.input_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          input_type: e.target.value as any,
                        })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight outline-none transition-all text-[1.3em] cursor-pointer",
                        isDark
                          ? "bg-subcard text-white focus:bg-card"
                          : "bg-gray-50 focus:bg-white"
                      )}
                    >
                      {availableInputTypes.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.label}
                        </option>
                      ))}
                    </select>
                    <p
                      className={clsx(
                        "text-[1.1em] mt-1",
                        isDark ? "text-gray-500" : "text-grays"
                      )}
                    >
                      Type of input user will fill
                    </p>
                  </div>

                  {/* Input Label */}
                  <div>
                    <label
                      className={clsx(
                        "block text-[1.3em] font-bold mb-2",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Input Label
                    </label>
                    <input
                      type="text"
                      value={formData.input_label}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          input_label: e.target.value,
                        })
                      }
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight outline-none transition-all text-[1.3em]",
                        isDark
                          ? "bg-subcard text-white placeholder:text-gray-500 focus:bg-card"
                          : "bg-gray-50 focus:bg-white"
                      )}
                      placeholder="e.g., Nomor HP GoPay"
                      required
                    />
                    <p
                      className={clsx(
                        "text-[1.1em] mt-1",
                        isDark ? "text-gray-500" : "text-grays"
                      )}
                    >
                      Label shown to user
                    </p>
                  </div>
                </div>

                {/* Fee */}
                <div>
                  <label
                    className={clsx(
                      "block text-[1.3em] font-bold mb-2",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    Fee (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.fee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={clsx(
                      "w-full px-4 py-3 rounded-xl border-2 border-transparent focus:border-bluelight outline-none transition-all text-[1.3em]",
                      isDark
                        ? "bg-subcard text-white focus:bg-card"
                        : "bg-gray-50 focus:bg-white"
                    )}
                  />
                  <p
                    className={clsx(
                      "text-[1.1em] mt-1",
                      isDark ? "text-gray-500" : "text-grays"
                    )}
                  >
                    Admin fee charged to user for each withdrawal
                  </p>
                </div>

                {/* Active Toggle */}
                <div
                  className={clsx(
                    "flex items-center justify-between p-4 rounded-xl",
                    isDark ? "bg-subcard" : "bg-gray-50"
                  )}
                >
                  <div>
                    <p
                      className={clsx(
                        "text-[1.3em] font-bold",
                        isDark ? "text-white" : "text-shortblack"
                      )}
                    >
                      Active Status
                    </p>
                    <p
                      className={clsx(
                        "text-[1.1em]",
                        isDark ? "text-gray-500" : "text-grays"
                      )}
                    >
                      Users can select this payment method
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        is_active: !formData.is_active,
                      })
                    }
                    className={clsx(
                      "w-14 h-7 rounded-full transition-all relative",
                      formData.is_active
                        ? "bg-green-500"
                        : isDark
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm",
                        formData.is_active ? "right-1" : "left-1"
                      )}
                    />
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={clsx(
                    "w-full py-4 rounded-2xl font-bold text-[1.5em] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    isDark
                      ? "bg-bluelight text-white"
                      : "bg-linear-to-r from-shortblack to-gray-800 text-white"
                  )}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingTemplate
                    ? "Update Payment Method"
                    : "Create Payment Method"}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
