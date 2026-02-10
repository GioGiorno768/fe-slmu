// src/components/dashboard/withdrawal/WithdrawalMethodCard.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Settings,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Wallet,
  Landmark,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { Link } from "@/i18n/routing";
import type { PaymentMethod } from "@/types/type";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface WithdrawalMethodCardProps {
  method: PaymentMethod | null;
}

export default function WithdrawalMethodCard({
  method,
}: WithdrawalMethodCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // State buat toggle visibility (Default: FALSE/Hidden)
  const [showDetail, setShowDetail] = useState(false);

  // State untuk track apakah logo image gagal load
  const [logoError, setLogoError] = useState(false);

  // Reset logoError when method changes
  useEffect(() => {
    setLogoError(false);
  }, [method?.provider]);

  // --- HELPER BUAT NYARI GAMBAR & CATEGORY ICON ---
  const getPaymentBrandInfo = (providerName: string | undefined) => {
    if (!providerName) return null;
    const slug = providerName.toLowerCase().replace(/\s+/g, "-");
    const logoPath = `/payment-icons/${slug}.png`;

    // Determine category icon based on known providers
    let DefaultIcon = CreditCard;
    let categoryName = "Card";

    // E-Wallets / Digital Wallets
    if (
      [
        "dana",
        "ovo",
        "gopay",
        "shopeepay",
        "paypal",
        "linkaja",
        "sakuku",
        "isaku",
        "doku",
        "jenius",
        "flip",
      ].includes(slug)
    ) {
      DefaultIcon = Wallet;
      categoryName = "E-Wallet";
    }
    // Banks
    if (
      [
        "bca",
        "bri",
        "mandiri",
        "bni",
        "jago",
        "cimb",
        "permata",
        "btpn",
        "danamon",
        "mega",
        "btn",
        "bsi",
        "ocbc",
        "hsbc",
        "uob",
        "maybank",
        "panin",
        "seabank",
        "bank-jago",
        "blu",
        "line-bank",
        "neo-bank",
        "bank-neo",
        "superbank",
      ].includes(slug)
    ) {
      DefaultIcon = Landmark;
      categoryName = "Bank";
    }

    return { logoPath, DefaultIcon, categoryName };
  };

  // --- HELPER MASKING NOMOR ---
  const getMaskedNumber = (text: string) => {
    if (!text) return "••••";

    // Cek kalau format Email
    if (text.includes("@")) {
      const [name, domain] = text.split("@");
      const maskedName = name.length > 2 ? name.slice(0, 2) + "••••" : "•••";
      return `${maskedName}@${domain}`;
    }

    // Format Nomor (Bank/E-Wallet) - Ambil 4 digit terakhir
    if (text.length > 4) {
      return `•••• •••• •••• ${text.slice(-4)}`;
    }

    return "•••• ••••";
  };

  const brandInfo = method ? getPaymentBrandInfo(method.provider) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={clsx(
        "rounded-3xl p-8 shadow-sm h-full flex flex-col",
        isDark
          ? "bg-card border border-gray-dashboard/30 shadow-black/20"
          : "bg-white border border-gray-100 shadow-slate-500/20",
      )}
    >
      {/* Header Kecil */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={clsx(
            "text-[1.8em] font-bold flex items-center gap-2",
            isDark ? "text-white" : "text-shortblack",
          )}
        >
          {t("withdrawalPage.paymentMethod")}
        </h3>
        <Link
          href="/settings#payment"
          className="p-2 text-grays hover:text-bluelight hover:bg-blues rounded-xl transition-colors"
          title={t("withdrawalPage.changeMethod")}
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {method && brandInfo ? (
          <div className="flex-1 flex flex-col justify-center">
            {/* === KARTU BIRU UTAMA === */}
            <div
              className={clsx(
                "relative bg-gradient-to-br from-bluelight to-blue-600 rounded-3xl p-8 text-white overflow-hidden group min-h-[200px] flex flex-col justify-between",
                isDark
                  ? "shadow-lg shadow-blue-900/40"
                  : "shadow-xl shadow-blue-200",
              )}
            >
              {/* Watermark Background */}
              <div className="absolute -right-8 -bottom-12 w-48 h-48 opacity-10 rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                {!logoError ? (
                  <Image
                    src={brandInfo.logoPath}
                    alt="watermark"
                    width={200}
                    height={200}
                    className="object-contain grayscale brightness-200"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <brandInfo.DefaultIcon className="w-full h-full text-white" />
                )}
              </div>

              {/* Card Header */}
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="text-[1.2em] text-blue-100 font-medium block">
                    {t("withdrawalPage.primaryAccount")}
                  </span>
                  <span className="text-[1.8em] font-bold tracking-wide mt-1 block">
                    {method.provider}
                  </span>
                </div>
                <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-80 shadow-inner border border-yellow-600/30"></div>
              </div>

              {/* Middle Icon - Updated dengan fallback ke DefaultIcon */}
              <div className="relative z-10 flex items-center justify-start my-6">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg shadow-black/10 border-4 border-white/20 backdrop-blur-sm">
                  {!logoError ? (
                    <Image
                      src={brandInfo.logoPath}
                      alt={method.provider}
                      width={40}
                      height={40}
                      className="object-contain w-10 h-10"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <brandInfo.DefaultIcon className="w-8 h-8 text-bluelight" />
                  )}
                </div>
                <div className="h-px border-t-2 border-dashed border-white/30 flex-1 ml-4"></div>
              </div>

              {/* Card Footer (Detail Akun + Toggle Visibility) */}
              <div className="relative z-10 space-y-1">
                {/* --- UPDATE DISINI: NUMBER + EYE ICON --- */}
                <div className="flex items-center gap-3">
                  <p className="text-[1.8em] font-mono tracking-widest font-bold drop-shadow-sm truncate">
                    {showDetail
                      ? method.accountNumber
                      : getMaskedNumber(method.accountNumber)}
                  </p>

                  <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                    title={
                      showDetail
                        ? t("withdrawalPage.hideNumber")
                        : t("withdrawalPage.showNumber")
                    }
                  >
                    {showDetail ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* ---------------------------------------- */}

                <div className="flex justify-between items-end">
                  <p className="text-[1.2em] text-blue-100 uppercase tracking-wide font-medium truncate max-w-[70%]">
                    {method.accountName}
                  </p>
                  <span className="text-[1em] text-white/60 font-mono">
                    {t("withdrawalPage.valid")}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Tambahan */}
            <div
              className={clsx(
                "mt-6 flex items-start gap-3 p-4 rounded-xl",
                isDark
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-green-50 border border-green-100",
              )}
            >
              <ShieldCheck
                className={clsx(
                  "w-5 h-5 mt-0.5 shrink-0",
                  isDark ? "text-green-400" : "text-green-600",
                )}
              />
              <p
                className={clsx(
                  "text-[1.2em] leading-snug",
                  isDark ? "text-green-300" : "text-green-800",
                )}
              >
                {t("withdrawalPage.accountVerified")}
              </p>
            </div>
          </div>
        ) : (
          // State Kosong (Sama kayak sebelumnya)
          <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
            <div
              className={clsx(
                "w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner",
                isDark
                  ? "bg-orange-500/10 border border-orange-500/20"
                  : "bg-orange-50 border border-orange-100",
              )}
            >
              <div
                className={clsx(
                  "w-16 h-16 rounded-full flex items-center justify-center",
                  isDark
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-orange-100 text-orange-500",
                )}
              >
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

            <h4
              className={clsx(
                "text-[1.8em] font-bold mb-2",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              {t("withdrawalPage.noPaymentMethod")}
            </h4>
            <p className="text-[1.4em] text-grays max-w-[250px] mx-auto leading-relaxed mb-8">
              {t("withdrawalPage.noMethodDesc")}
            </p>

            <Link
              href="/settings#payment"
              className={clsx(
                "px-8 py-3 rounded-xl font-semibold text-[1.4em] hover:opacity-90 hover:shadow-lg transition-all w-full max-w-[200px]",
                isDark ? "bg-bluelight text-white" : "bg-shortblack text-white",
              )}
            >
              {t("withdrawalPage.setupNow")}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
