"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Copy, Check, Share2 } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface ReferralHeaderProps {
  referralLink: string;
  commissionRate: number;
}

export default function ReferralHeader({
  referralLink,
  commissionRate,
}: ReferralHeaderProps) {
  const { showAlert } = useAlert();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    showAlert("Link referral berhasil disalin!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Shortlinkmu",
          text: "Daftar dan dapatkan penghasilan tambahan!",
          url: referralLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
      showAlert("Browser tidak support share, link disalin manual.", "info");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#250e60] via-90% to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200/50 dark:shadow-blue-900/30 relative overflow-hidden font-figtree"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left space-y-4 max-w-2xl">
          <h1 className="text-[3em] font-bold leading-tight">
            Ajak Teman, <span className="text-yellow-300">Dapat Cuan!</span>
          </h1>
          <p className="text-[1.6em] text-blue-100">
            Dapatkan komisi{" "}
            <span className="font-bold text-white">
              {commissionRate}% seumur hidup
            </span>{" "}
            dari setiap penghasilan teman yang Anda undang.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center gap-2 w-full lg:w-auto min-w-[300px] max-w-md">
          <div
            className={clsx(
              "px-4 py-3 rounded-xl flex-1 truncate font-medium text-[1.4em]",
              isDark
                ? "bg-slate-800/80 text-white border border-white/10"
                : "bg-white text-shortblack"
            )}
          >
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={clsx(
              "p-3 rounded-xl transition-colors",
              isDark
                ? "bg-slate-700 text-blue-400 hover:bg-slate-600 border border-white/10"
                : "bg-white text-bluelight hover:bg-blue-50"
            )}
            title="Copy Link"
          >
            {isCopied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-bluelight text-white border border-white/30 rounded-xl hover:bg-blue-700 transition-colors"
            title="Share Link"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
