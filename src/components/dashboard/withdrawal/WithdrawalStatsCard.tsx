// src/components/dashboard/withdrawal/WithdrawalStatsCard.tsx
"use client";

import { motion } from "motion/react";
import {
  Wallet,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Wallet2,
} from "lucide-react";
import type { WithdrawalStats } from "@/types/type";
import { useCurrency } from "@/contexts/CurrencyContext";

interface WithdrawalStatsCardProps {
  stats: WithdrawalStats | null;
  onOpenModal: () => void;
  minWithdrawal?: number; // USD - from withdrawal settings
}

export default function WithdrawalStatsCard({
  stats,
  onOpenModal,
  minWithdrawal = 2, // Default $2 if not passed
}: WithdrawalStatsCardProps) {
  // 💱 Use global currency context
  const { format: formatCurrency, symbol, currency } = useCurrency();

  // 🔄 Round minimum withdrawal up to a clean number per currency
  const roundMinimumUp = (amountUSD: number): number => {
    // First convert USD to local currency using formatCurrency internals
    // formatCurrency already handles conversion, so we need to get the converted value
    // For simplicity, we'll import the conversion function
    const { convertFromUSD } = require("@/utils/currency");
    const convertedAmount = convertFromUSD(amountUSD, currency);

    switch (currency) {
      case "IDR":
        // Round up to nearest 1000 (e.g., 16695 → 17000)
        return Math.ceil(convertedAmount / 1000) * 1000;
      case "MYR":
      case "SGD":
        // Round up to nearest 1 (e.g., 8.15 → 9)
        return Math.ceil(convertedAmount);
      case "EUR":
      case "GBP":
        // Round up to nearest 0.5 (e.g., 1.84 → 2)
        return Math.ceil(convertedAmount * 2) / 2;
      default:
        // USD: Keep as is
        return convertedAmount;
    }
  };

  // Get the rounded minimum in local currency
  const displayMinWithdrawal = roundMinimumUp(minWithdrawal);

  // Format with symbol based on currency
  const formatLocalAmount = (amount: number): string => {
    if (currency === "IDR") {
      return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
    }
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm shadow-slate-500/20 border border-gray-100 h-full flex flex-col relative overflow-hidden font-figtree"
    >
      {/* Header Section (Judul & Tombol) */}
      <div className="p-8 pb-4 flex justify-between items-start z-10">
        <div>
          <h2 className="text-[1.8em] font-bold text-shortblack flex items-center gap-2">
            <Wallet className="w-6 h-6 text-bluelight" />
            Finance Overview
          </h2>
          <p className="text-[1.3em] text-grays mt-1">
            Manage your earnings and payouts.
          </p>
        </div>

        {/* Tombol Request Payout ditaruh di atas biar gampang dijangkau */}
        <button
          onClick={onOpenModal}
          className="hidden bg-bluelight text-white px-6 py-3 rounded-xl font-bold text-[1.4em] 
                   hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
                   md:flex items-center gap-2 shadow-blue-200 shadow-md"
        >
          <span>Request Payout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Balance Section ( Tengah - Flex Grow biar ngisi ruang kosong ) */}
      <div className="px-8  flex-1 flex flex-col justify-center z-10">
        <div className="bg-white rounded-2xl gap-8 flex flex-col md:flex-row justify-between items-center p-6 shadow-sm shadow-slate-400/50 relative overflow-hidden">
          {/* Dekorasi blob kecil */}
          <div className="w-24 h-24 md:order-2 bg-blue-50 rounded-full flex items-center mr-4 justify-center border border-blue-100 shadow-inner">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-bluelight">
              <Wallet2 className="w-8 h-8" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[1.4em] font-medium text-grays mb-1 flex items-center gap-2">
              Available Balance
              <span className="bg-green-100 text-green-700 text-[0.8em] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Ready
              </span>
            </p>
            <h1 className="text-[4.5em] font-bold text-bluelight tracking-tight leading-none my-2">
              {formatCurrency(stats?.availableBalance || 0)}
            </h1>
            <p className="text-[1.3em] text-grays opacity-80">
              Minimum payout threshold:{" "}
              <span className="font-semibold text-shortblack">
                {formatLocalAmount(displayMinWithdrawal)}
              </span>
            </p>
          </div>
          {/* Tombol Request Payout ditaruh di atas biar gampang dijangkau */}
          <button
            onClick={onOpenModal}
            className="md:hidden lg:hidden bg-bluelight text-white px-6 py-3 rounded-xl font-bold text-[1.4em] 
                   hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
                   flex items-center gap-2 shadow-blue-200 shadow-md"
          >
            <span>Request Payout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Stats Grid (Bawah) */}
      <div className="mt-auto p-8 z-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Pending */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 flex-shrink-0 border border-orange-100">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[1.2em] text-grays uppercase font-semibold tracking-wider mb-0.5">
                Pending
              </p>
              <p className="text-[1.8em] font-bold text-shortblack leading-none">
                {formatCurrency(stats?.pendingWithdrawn || 0)}
              </p>
            </div>
          </div>
          <div className="w-[0.15em] bg-blue-100 rounded-full"></div>
          {/* Total Withdrawn */}
          <div className="flex items-center gap-4 pr-10">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0 border border-green-100">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[1.2em] text-grays uppercase font-semibold tracking-wider mb-0.5">
                Withdrawn
              </p>
              <p className="text-[1.8em] font-bold text-shortblack leading-none">
                {formatCurrency(stats?.totalWithdrawn || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
