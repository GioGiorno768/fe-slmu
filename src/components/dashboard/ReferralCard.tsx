// src/components/dashboard/ReferralCard.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Copy,
  Check,
  Loader2,
  Users,
  Gift,
  ArrowRight,
  Share2,
  ExternalLink,
} from "lucide-react";
import type { ReferralCardData } from "@/types/type";
import clsx from "clsx";

// Terima data lewat props
interface ReferralCardProps {
  data: ReferralCardData | null;
}

export default function ReferralCard({ data }: ReferralCardProps) {
  const t = useTranslations("Dashboard");

  // State lokal cuma buat interaksi UI (Copy status)
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenericShare = async () => {
    if (navigator.share && data?.referralLink) {
      try {
        await navigator.share({
          title: "Join Shortlinkmu",
          text: "Daftar dan dapatkan penghasilan tambahan!",
          url: data.referralLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  // Loading State handled in render
  const isLoading = !data;

  // Extract referral code from link for display
  const referralCode = data?.referralLink?.split("ref=")[1] || "";

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[1.6em] font-bold text-shortblack">
              {t("referralTitle")}
            </h3>
            <p className="text-[1.1em] text-grays">Ajak teman, dapat komisi!</p>
          </div>
        </div>

        {/* User Count Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
          <Users className="w-4 h-4 text-bluelight" />
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-bluelight" />
          ) : (
            <span className="text-[1.3em] font-bold text-bluelight">
              {data?.totalUsers || 0}
            </span>
          )}
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl p-4 border border-slate-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-bluelight" />
            </div>
          ) : (
            <>
              {/* Link Display */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[1em] text-grays mb-1">Link Referral</p>
                  <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-slate-200">
                    <input
                      type="text"
                      readOnly
                      value={data?.referralLink || ""}
                      className="flex-1 text-[1.25em] font-medium text-shortblack bg-transparent border-none outline-none truncate"
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      onClick={handleCopy}
                      className={clsx(
                        "shrink-0 p-2 rounded-lg transition-all duration-200",
                        isCopied
                          ? "bg-green-100 text-green-600"
                          : "bg-blues text-bluelight hover:bg-blue-100"
                      )}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  disabled={isCopied}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[1.2em] font-semibold transition-all duration-200",
                    isCopied
                      ? "bg-green-500 text-white"
                      : "bg-bluelight text-white hover:bg-bluelight/90 shadow-lg shadow-blue-200"
                  )}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleGenericShare}
                  className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <Link
                  href="/referral"
                  className="p-3 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  title="Lihat Detail"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <Link
          href="/referral"
          className="flex items-center justify-between group"
        >
          <span className="text-[1.2em] text-grays group-hover:text-bluelight transition-colors">
            Lihat semua detail referral
          </span>
          <ArrowRight className="w-4 h-4 text-grays group-hover:text-bluelight group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
