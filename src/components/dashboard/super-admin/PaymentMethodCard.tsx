"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Wallet,
  Building2,
  Bitcoin,
  Phone,
  Mail,
  CreditCard,
  KeyRound,
} from "lucide-react";
import clsx from "clsx";
import type { PaymentMethodTemplate } from "@/services/paymentTemplateAdminService";
import { formatAmount } from "@/services/paymentTemplateAdminService";
import { useTheme } from "next-themes";

interface PaymentMethodCardProps {
  template: PaymentMethodTemplate;
  onEdit: (template: PaymentMethodTemplate) => void;
  onDelete: (template: PaymentMethodTemplate) => void;
  onToggleActive: (template: PaymentMethodTemplate) => void;
  index: number;
}

const getTypeConfig = (type: string, isDark: boolean) => {
  switch (type) {
    case "wallet":
      return {
        icon: Wallet,
        label: "Digital Wallet",
        bg: isDark ? "bg-purple-500/20" : "bg-purple-50",
        text: isDark ? "text-purple-400" : "text-purple-700",
        border: isDark ? "border-purple-500/30" : "border-purple-200",
      };
    case "bank":
      return {
        icon: Building2,
        label: "Bank",
        bg: isDark ? "bg-blue-500/20" : "bg-blue-50",
        text: isDark ? "text-blue-400" : "text-blue-700",
        border: isDark ? "border-blue-500/30" : "border-blue-200",
      };
    case "crypto":
      return {
        icon: Bitcoin,
        label: "Crypto",
        bg: isDark ? "bg-orange-500/20" : "bg-orange-50",
        text: isDark ? "text-orange-400" : "text-orange-700",
        border: isDark ? "border-orange-500/30" : "border-orange-200",
      };
    default:
      return {
        icon: CreditCard,
        label: type,
        bg: isDark ? "bg-gray-700" : "bg-gray-50",
        text: isDark ? "text-gray-300" : "text-gray-700",
        border: isDark ? "border-gray-600" : "border-gray-200",
      };
  }
};

const getInputTypeIcon = (inputType: string) => {
  switch (inputType) {
    case "phone":
      return Phone;
    case "email":
      return Mail;
    case "account_number":
      return CreditCard;
    case "crypto_address":
      return KeyRound;
    default:
      return CreditCard;
  }
};

export default function PaymentMethodCard({
  template,
  onEdit,
  onDelete,
  onToggleActive,
  index,
}: PaymentMethodCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const typeConfig = getTypeConfig(template.type, isDark);
  const TypeIcon = typeConfig.icon;
  const InputIcon = getInputTypeIcon(template.input_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={clsx(
        "relative rounded-2xl p-5 border-2 transition-all duration-300",
        template.is_active
          ? isDark
            ? "bg-card border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1"
            : "bg-white border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
          : isDark
            ? "bg-gray-800/50 border-gray-700 opacity-70"
            : "bg-gray-50 border-gray-200 opacity-70",
      )}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => onToggleActive(template)}
          className={clsx(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[1.1em] font-medium transition-all",
            template.is_active
              ? isDark
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                : "bg-green-100 text-green-700 hover:bg-green-200"
              : isDark
                ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300",
          )}
        >
          {template.is_active ? (
            <>
              <ToggleRight className="w-4 h-4" />
              Active
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4" />
              Inactive
            </>
          )}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            typeConfig.bg,
          )}
        >
          <TypeIcon className={clsx("w-6 h-6", typeConfig.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              "text-[1.6em] font-bold truncate",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            {template.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={clsx(
                "px-2 py-0.5 rounded-md text-[1em] font-medium",
                typeConfig.bg,
                typeConfig.text,
              )}
            >
              {typeConfig.label}
            </span>
            <span
              className={clsx(
                "px-2 py-0.5 rounded-md text-[1em] font-semibold",
                isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {template.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-2 mb-4">
        {/* Input Type */}
        <div
          className={clsx(
            "flex items-center gap-2 text-[1.2em]",
            isDark ? "text-gray-400" : "text-grays",
          )}
        >
          <InputIcon
            className={clsx(
              "w-4 h-4",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
          />
          <span
            className={clsx(
              "font-medium",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            {template.input_label}
          </span>
        </div>

        {/* Fee */}
        <div className="flex items-center justify-between text-[1.2em]">
          <span className={isDark ? "text-gray-400" : "text-grays"}>Fee</span>
          <span
            className={clsx(
              "font-semibold",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            {(() => {
              const fee = Number(template.fee);
              switch (template.currency) {
                case "IDR":
                  return `Rp ${fee.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
                case "EUR":
                  return `€${fee.toLocaleString("de-DE", { minimumFractionDigits: 5 })}`;
                case "GBP":
                  return `£${fee.toLocaleString("en-GB", { minimumFractionDigits: 5 })}`;
                case "SGD":
                  return `S$${fee.toLocaleString("en-SG", { minimumFractionDigits: 5 })}`;
                case "MYR":
                  return `RM ${fee.toLocaleString("ms-MY", { minimumFractionDigits: 5 })}`;
                case "USD":
                default:
                  return `$${fee.toLocaleString("en-US", { minimumFractionDigits: 5 })}`;
              }
            })()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div
        className={clsx(
          "flex gap-2 pt-3 border-t",
          isDark ? "border-gray-700" : "border-gray-100",
        )}
      >
        <button
          onClick={() => onEdit(template)}
          className="flex-1 py-2 px-3 rounded-xl bg-bluelight text-white font-semibold text-[1.2em] hover:bg-opacity-90 transition-all flex items-center justify-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(template)}
          className={clsx(
            "py-2 px-3 rounded-xl font-semibold text-[1.2em] transition-all border",
            isDark
              ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
