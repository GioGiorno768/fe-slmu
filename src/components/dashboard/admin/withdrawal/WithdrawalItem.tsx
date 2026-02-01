"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Copy,
  ThumbsUp,
  Send,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Link2,
} from "lucide-react";
import clsx from "clsx";
import type { RecentWithdrawal } from "@/types/type";
import { useTheme } from "next-themes";

interface WithdrawalItemProps {
  trx: RecentWithdrawal;
  onApprove: (id: string, currentStatus: string) => void;
  onReject: (id: string, reason: string) => void;
  onAddProof: (id: string, url: string) => void;
  // Modal triggers
  openRejectModal: (id: string) => void;
  // Current admin ID for checking processor match
  currentUserId?: string | number;
}

export default function WithdrawalItem({
  trx,
  onApprove,
  openRejectModal,
  currentUserId,
}: WithdrawalItemProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Check if current admin is the one who processed this withdrawal
  const isCurrentProcessor =
    currentUserId &&
    trx.processedById &&
    String(currentUserId) === String(trx.processedById);

  // Format currency based on currency code
  const formatCurrency = (val: number, currency?: string) => {
    if (currency === "IDR") {
      return `Rp ${val.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
    }
    // Default to USD with 5 decimal places
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 5 });
  };

  // Helper to format USD amount
  const formatUSD = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 5 });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className={clsx(
        "rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md group relative",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
      )}
    >
      {/* HEADER SECTION */}
      <div className="p-5 flex items-start gap-4">
        {/* Status Icon Indicator */}
        <div
          className={clsx(
            "mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            trx.status === "paid"
              ? isDark
                ? "bg-green-500/20 text-green-400"
                : "bg-green-100 text-green-600"
              : trx.status === "approved"
                ? isDark
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-blue-100 text-blue-600"
                : trx.status === "rejected"
                  ? isDark
                    ? "bg-red-500/20 text-red-400"
                    : "bg-red-100 text-red-600"
                  : isDark
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-yellow-100 text-yellow-600",
          )}
        >
          {trx.status === "paid" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : trx.status === "approved" ? (
            <ThumbsUp className="w-5 h-5" />
          ) : trx.status === "rejected" ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Row: User & Amount */}
          <div className="flex justify-between items-start mb-1">
            <div className="min-w-0">
              <p className="text-[1.1em] text-grays truncate mb-0.5">
                {trx.user.name}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[1.6em] font-bold text-shortblack truncate">
                  {/* Show local currency as main if available, otherwise USD */}
                  {trx.localAmount && trx.currency && trx.currency !== "USD"
                    ? formatCurrency(trx.localAmount, trx.currency)
                    : formatUSD(trx.amount)}
                </span>
                {/* Show USD equivalent as secondary when using local currency */}
                {trx.localAmount && trx.currency && trx.currency !== "USD" && (
                  <span className="text-[1.2em] text-grays font-medium bg-gray-100 px-2 py-0.5 rounded">
                    ≈ {formatUSD(trx.amount)}
                  </span>
                )}
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded text-[1em] font-bold uppercase tracking-wide",
                    trx.status === "paid"
                      ? isDark
                        ? "bg-green-500/20 text-green-400"
                        : "bg-green-100 text-green-700"
                      : trx.status === "approved"
                        ? isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-100 text-blue-700"
                        : trx.status === "rejected"
                          ? isDark
                            ? "bg-red-500/20 text-red-400"
                            : "bg-red-100 text-red-700"
                          : isDark
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-yellow-100 text-yellow-700",
                  )}
                >
                  {trx.status}
                </span>
              </div>
            </div>

            {/* Actions Area: Inline Buttons */}
            <div className="flex items-center gap-2">
              {/* PRIMARY ACTION BUTTON (Outside Dropdown) - DESKTOP ONLY */}
              {trx.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove(trx.id, trx.status)}
                    className="hidden md:flex px-4 py-2 rounded-xl font-bold text-[0.9em] bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all items-center gap-1.5"
                  >
                    <ThumbsUp className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(trx.id)}
                    className="hidden md:flex px-4 py-2 rounded-xl font-bold text-[0.9em] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              {trx.status === "approved" && (
                <>
                  {/* Show action buttons only if current admin is the processor, else show "In Process" */}
                  {isCurrentProcessor ? (
                    <>
                      <button
                        onClick={() => onApprove(trx.id, trx.status)}
                        className="hidden md:flex px-4 py-2 rounded-xl font-bold text-[0.9em] bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" /> Pay Now
                      </button>
                      <button
                        onClick={() => openRejectModal(trx.id)}
                        className="hidden md:flex px-4 py-2 rounded-xl font-bold text-[0.9em] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  ) : trx.processedByName ? (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-[0.9em]">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>In Process by {trx.processedByName}</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onApprove(trx.id, trx.status)}
                        className="hidden md:flex px-4 py-2 rounded-xl font-bold text-[0.9em] bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" /> Pay Now
                      </button>
                      <button
                        onClick={() => openRejectModal(trx.id)}
                        className="hidden md:flex px-4 py-2 rounded-xl font-bold text-[0.9em] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                </>
              )}

              {/* Detail dropdown removed - not needed as list view is comprehensive */}
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="flex items-center gap-2 text-[1.2em] text-grays mb-4 group/link flex-wrap">
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <p className="truncate max-w-[80%]">
              {trx.method}
              {trx.accountName && ` - ${trx.accountName}`}
              {" - "}
              {trx.accountNumber}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(trx.accountNumber)}
              className="opacity-0 group-hover/link:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-bluelight"
              title="Copy Account Number"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div
            className={clsx(
              "h-px w-full mb-4",
              isDark ? "bg-gray-800" : "bg-gray-100",
            )}
          />

          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[1.2em]">
            {/* User */}
            <div className="flex items-center gap-3">
              {trx.user.avatar ? (
                <Image
                  src={trx.user.avatar}
                  alt={trx.user.name}
                  width={32}
                  height={32}
                  className="rounded-full bg-gray-100 border border-white shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {trx.user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-shortblack truncate">
                  {trx.user.email}
                </p>
                <p className="text-grays text-[0.9em] truncate">
                  Level: {trx.user.level}
                </p>
              </div>
            </div>

            {/* Fee & Total */}
            <div className="space-y-1">
              <p className="text-grays text-[0.9em]">
                Fee:{" "}
                <span className="font-bold text-orange-600">
                  {/* Show local fee as main if available */}
                  {trx.localAmount &&
                  trx.exchangeRate &&
                  trx.currency &&
                  trx.currency !== "USD"
                    ? formatCurrency(trx.fee * trx.exchangeRate, trx.currency)
                    : formatUSD(trx.fee)}
                  {/* Show USD equivalent as secondary */}
                  {trx.localAmount &&
                    trx.exchangeRate &&
                    trx.currency &&
                    trx.currency !== "USD" && (
                      <span className="text-grays font-normal ml-1">
                        (≈ {formatUSD(trx.fee)})
                      </span>
                    )}
                </span>
              </p>
              <p className="text-shortblack font-bold">
                Total: {/* Show local total as main if available */}
                {trx.localAmount &&
                trx.exchangeRate &&
                trx.currency &&
                trx.currency !== "USD"
                  ? formatCurrency(
                      (trx.amount + trx.fee) * trx.exchangeRate,
                      trx.currency,
                    )
                  : formatUSD(trx.amount + trx.fee)}
                {/* Show USD equivalent as secondary */}
                {trx.localAmount &&
                  trx.exchangeRate &&
                  trx.currency &&
                  trx.currency !== "USD" && (
                    <span className="text-grays font-normal ml-1 text-[0.9em]">
                      (≈ {formatUSD(trx.amount + trx.fee)})
                    </span>
                  )}
              </p>
            </div>

            {/* Date & Transaction ID */}
            <div className="space-y-1 text-grays">
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Date:{" "}
                {formatDate(trx.date)}
              </p>
              <p className="text-[0.9em] font-mono text-bluelight">
                ID: {trx.transactionId}
              </p>
            </div>

            {/* Risk Score */}
            <div className="flex items-center">
              <span
                className={clsx(
                  "px-3 py-1 rounded-full text-[0.9em] font-bold border flex items-center gap-1",
                  trx.riskScore === "safe"
                    ? "bg-green-50 border-green-200 text-green-600"
                    : trx.riskScore === "medium"
                      ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                      : "bg-red-50 border-red-200 text-red-600",
                )}
              >
                <AlertTriangle className="w-3 h-3" /> Risk: {trx.riskScore}
              </span>
            </div>

            {/* Proof Link if exists */}
            {trx.proofUrl && (
              <div className="flex items-center">
                <a
                  href={trx.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full text-[0.9em] font-bold border bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1 hover:bg-blue-100 transition-colors"
                >
                  <Link2 className="w-3 h-3" /> View Proof
                </a>
              </div>
            )}

            {/* Send Payment Proof Option (Dropdown) */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden p-1 hidden">
              {/* This is just a placeholder to ensure I didn't miss the dropdown content logic which is actually inside the main return block above.
                   Wait, the dropdown is defined around line 135. Let me check the file content again.
                   Ah, I see the dropdown content is inside the `isMenuOpen` block.
                   I need to target the "Attach Proof" button inside the dropdown.
               */}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ACTION BUTTON (Bottom Full Width) */}
      <div className="md:hidden px-5 pb-5 pt-0">
        {trx.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(trx.id, trx.status)}
              className="w-full py-3 rounded-xl font-bold text-[1em] bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ThumbsUp className="w-5 h-5" /> Approve Withdrawal
            </button>
            <button
              onClick={() => openRejectModal(trx.id)}
              className="w-full px-4 py-2 mt-4 rounded-xl font-bold text-[0.9em] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </>
        )}
        {trx.status === "approved" && (
          <>
            {isCurrentProcessor ? (
              <button
                onClick={() => onApprove(trx.id, trx.status)}
                className="w-full py-3 rounded-xl font-bold text-[1em] bg-green-600 hover:bg-green-700 text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Process Payment
              </button>
            ) : trx.processedByName ? (
              <div className="w-full py-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-[1em] flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 animate-pulse" />
                <span>In Process by {trx.processedByName}</span>
              </div>
            ) : (
              <button
                onClick={() => onApprove(trx.id, trx.status)}
                className="w-full py-3 rounded-xl font-bold text-[1em] bg-green-600 hover:bg-green-700 text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Process Payment
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
