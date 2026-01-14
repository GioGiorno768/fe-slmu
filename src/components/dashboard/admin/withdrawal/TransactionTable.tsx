"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  CreditCard,
  Copy,
  Link2,
  ThumbsUp, // Icon Approve
  Send, // Icon Pay Now
} from "lucide-react";
import clsx from "clsx";
import type { RecentWithdrawal } from "@/types/type";
import WithdrawalActionModal from "./WithdrawalActionModal";

interface Props {
  transactions: RecentWithdrawal[];
  isLoading: boolean;
  // Callback onApprove sekarang nerima currentStatus buat logic toggle
  onApprove: (id: string, currentStatus: string) => void;
  onReject: (id: string, reason: string) => void;
  onAddProof: (id: string, url: string) => void;
}

export default function TransactionTable({
  transactions,
  isLoading,
  onApprove,
  onReject,
  onAddProof,
}: Props) {
  // State UI Lokal
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "reject" | "proof" | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  const [isProcessing, setIsProcessing] = useState(false);

  // Helper Formatters
  const formatCurrency = (val: number) => "$" + val.toFixed(5);
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Handle Modal Submit (Bridge ke Parent Function)
  const handleModalSubmit = async (value: string) => {
    if (!modalState.id) return;
    setIsProcessing(true);
    try {
      if (modalState.type === "reject") {
        await onReject(modalState.id, value);
      } else {
        await onAddProof(modalState.id, value);
      }
      setModalState({ isOpen: false, type: null, id: null });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-figtree">
        {/* Header Table */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-[1.5em] font-bold text-shortblack">
            Transaction Queue
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-grays uppercase text-[1.1em] font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount & Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Risk Score</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[1.3em]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-grays">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-grays">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* 1. User Info */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Image
                          src={trx.user.avatar || "/avatars/default.png"}
                          alt={trx.user.name}
                          width={40}
                          height={40}
                          className="rounded-full bg-gray-100 object-cover"
                        />
                        <div>
                          <p className="font-bold text-shortblack">
                            {trx.user.name}
                          </p>
                          <p className="text-grays text-[0.85em]">
                            {trx.user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Amount & Method */}
                    <td className="px-6 py-5">
                      <p className="font-mono font-bold text-shortblack text-[1.1em]">
                        {formatCurrency(trx.amount)}
                      </p>
                      <div className="flex items-center gap-1.5 text-grays text-[0.85em] mt-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{trx.method}</span>
                        {/* Tombol copy rekening (Visual Only for now) */}
                        <button
                          className="hover:text-bluelight transition-colors ml-1"
                          title="Copy Account Number"
                          onClick={() =>
                            navigator.clipboard.writeText("12345678")
                          } // Logic copy simple
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* 3. Date */}
                    <td className="px-6 py-5 text-grays text-[0.9em]">
                      {formatDate(trx.date)}
                    </td>

                    {/* 4. Risk Score Badge */}
                    <td className="px-6 py-5 text-center">
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-lg text-[0.8em] font-bold uppercase tracking-wide",
                          trx.riskScore === "safe"
                            ? "bg-green-50 text-green-600"
                            : trx.riskScore === "medium"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                        )}
                      >
                        {trx.riskScore}
                      </span>
                    </td>

                    {/* 5. Status Badge (Updated with Approved logic) */}
                    <td className="px-6 py-5 text-center">
                      {trx.status === "paid" ? (
                        <div className="flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-[0.85em]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                          </span>
                          {/* Link Proof kalau ada */}
                          {trx.proofUrl && (
                            <a
                              href={trx.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[0.75em] text-blue-500 hover:underline mt-1 flex items-center gap-1"
                            >
                              <Link2 className="w-3 h-3" /> Proof
                            </a>
                          )}
                        </div>
                      ) : trx.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-[0.85em]">
                          <ThumbsUp className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : trx.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-[0.85em]">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-3 py-1 rounded-full text-[0.85em]">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>

                    {/* 6. Actions (Dynamic Buttons) */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        {/* BUTTON 1: APPROVE (Muncul pas Pending) */}
                        {trx.status === "pending" && (
                          <button
                            onClick={() => onApprove(trx.id, trx.status)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-[0.9em] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <ThumbsUp className="w-4 h-4" /> Approve
                          </button>
                        )}

                        {/* BUTTON 2: PAY NOW (Muncul pas Approved) */}
                        {trx.status === "approved" && (
                          <button
                            onClick={() => onApprove(trx.id, trx.status)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-[0.9em] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Send className="w-4 h-4" /> Pay Now
                          </button>
                        )}

                        {/* DROPDOWN MENU (Titik Tiga) */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === trx.id ? null : trx.id
                              )
                            }
                            className="p-2 text-grays hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>

                          {activeMenu === trx.id && (
                            <>
                              {/* Backdrop invisible buat nutup menu */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenu(null)}
                              />

                              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden p-1">
                                {/* Detail Link */}
                                <Link
                                  href={`/admin/withdrawals/${trx.id}`}
                                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg text-shortblack font-medium text-[0.95em] flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4 text-grays" />{" "}
                                  Detail
                                </Link>

                                {/* Attach Proof (Bisa kapan aja) */}
                                <button
                                  onClick={() => {
                                    setModalState({
                                      isOpen: true,
                                      type: "proof",
                                      id: trx.id,
                                    });
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 rounded-lg text-blue-600 font-medium text-[0.95em] flex items-center gap-2"
                                >
                                  <Link2 className="w-4 h-4" /> Send Payment
                                  Proof
                                </button>

                                {/* Reject (Cuma bisa kalau belum Paid/Rejected) */}
                                {(trx.status === "pending" ||
                                  trx.status === "approved") && (
                                  <button
                                    onClick={() => {
                                      setModalState({
                                        isOpen: true,
                                        type: "reject",
                                        id: trx.id,
                                      });
                                      setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 rounded-lg text-red-600 font-medium text-[0.95em] flex items-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4" /> Reject
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (Reusable for Reject & Proof) */}
      <WithdrawalActionModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSubmit={handleModalSubmit}
        isLoading={isProcessing}
      />
    </>
  );
}
