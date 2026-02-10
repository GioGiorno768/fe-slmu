// src/components/dashboard/withdrawal/WithdrawalRequestModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Smartphone,
  Bitcoin,
  ChevronDown,
  Landmark,
  User,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { PaymentMethod } from "@/types/type";
import clsx from "clsx";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertFromUSD, getExchangeRates } from "@/utils/currency";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

// --- KONFIGURASI PAYMENT (Tetap di sini sesuai request lu) ---
const PAYMENT_CONFIG = {
  wallet: {
    label: "Digital Wallet",
    icon: Smartphone,
    methods: [
      {
        id: "DANA",
        label: "DANA",
        inputType: "number",
        inputLabel: "DANA Phone Number",
        placeholder: "0812xxxx",
      },
      {
        id: "OVO",
        label: "OVO",
        inputType: "number",
        inputLabel: "OVO Phone Number",
        placeholder: "0812xxxx",
      },
      {
        id: "GoPay",
        label: "GoPay",
        inputType: "number",
        inputLabel: "GoPay Phone Number",
        placeholder: "0812xxxx",
      },
      {
        id: "ShopeePay",
        label: "ShopeePay",
        inputType: "number",
        inputLabel: "ShopeePay Number",
        placeholder: "0812xxxx",
      },
      {
        id: "PayPal",
        label: "PayPal",
        inputType: "email",
        inputLabel: "PayPal Email Address",
        placeholder: "name@email.com",
      },
    ],
  },
  bank: {
    label: "Bank Transfer",
    icon: Landmark,
    methods: [
      {
        id: "BCA",
        label: "Bank BCA",
        inputType: "number",
        inputLabel: "Rekening BCA",
        placeholder: "1234567890",
      },
      {
        id: "BRI",
        label: "Bank BRI",
        inputType: "number",
        inputLabel: "Rekening BRI",
        placeholder: "1234567890",
      },
      {
        id: "Mandiri",
        label: "Bank Mandiri",
        inputType: "number",
        inputLabel: "Rekening Mandiri",
        placeholder: "1234567890",
      },
      {
        id: "BNI",
        label: "Bank BNI",
        inputType: "number",
        inputLabel: "Rekening BNI",
        placeholder: "1234567890",
      },
      {
        id: "Jago",
        label: "Bank Jago",
        inputType: "number",
        inputLabel: "Rekening Jago",
        placeholder: "1234567890",
      },
    ],
  },
  crypto: {
    label: "Crypto",
    icon: Bitcoin,
    methods: [
      {
        id: "USDT-TRC20",
        label: "USDT (TRC20)",
        inputType: "text",
        inputLabel: "Wallet Address (TRC20)",
        placeholder: "Txr...",
      },
      {
        id: "USDT-ERC20",
        label: "USDT (ERC20)",
        inputType: "text",
        inputLabel: "Wallet Address (ERC20)",
        placeholder: "0x...",
      },
      {
        id: "BTC",
        label: "Bitcoin (BTC)",
        inputType: "text",
        inputLabel: "Bitcoin Wallet Address",
        placeholder: "1A1z...",
      },
      {
        id: "LTC",
        label: "Litecoin (LTC)",
        inputType: "text",
        inputLabel: "Litecoin Wallet Address",
        placeholder: "L...",
      },
    ],
  },
};

type CategoryKey = keyof typeof PAYMENT_CONFIG;

import type { SavedPaymentMethod } from "@/types/type";
import { Link } from "@/i18n/routing";

interface WithdrawalSettings {
  minWithdrawal: number;
  maxWithdrawal: number;
  limitCount: number;
  limitDays: number;
}

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMethod: PaymentMethod | null;
  allMethods: SavedPaymentMethod[];
  availableBalance: number;
  withdrawalSettings?: WithdrawalSettings | null;
  onSuccess: (amount: number, method: PaymentMethod) => Promise<void>;
}

export default function WithdrawalRequestModal({
  isOpen,
  onClose,
  defaultMethod,
  allMethods,
  availableBalance,
  withdrawalSettings,
  onSuccess,
}: WithdrawalRequestModalProps) {
  const { showAlert } = useAlert();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // 💱 Use global currency context
  const { format: formatCurrency, symbol, currency } = useCurrency();

  // --- CURRENCY CONVERSION HELPERS ---
  // Convert USD to local currency
  const toLocalCurrency = (amountUSD: number): number => {
    return convertFromUSD(amountUSD, currency);
  };

  // Convert local currency back to USD
  const toUSD = (amountLocal: number): number => {
    const rates = getExchangeRates();
    return amountLocal / rates[currency];
  };

  // 🔄 Round minimum withdrawal up to a clean number per currency
  const roundMinimumUp = (amount: number): number => {
    switch (currency) {
      case "IDR":
        // Round up to nearest 1000 (e.g., 33478 → 34000)
        return Math.ceil(amount / 1000) * 1000;
      case "MYR":
      case "SGD":
        // Round up to nearest 1 (e.g., 8.15 → 9)
        return Math.ceil(amount);
      case "EUR":
      case "GBP":
        // Round up to nearest 0.5 (e.g., 1.84 → 2)
        return Math.ceil(amount * 2) / 2;
      default:
        // USD: Keep as is (already $2)
        return amount;
    }
  };

  // Get min/max from settings (defaults: min $2, max = balance)
  const minWithdrawalUSD = withdrawalSettings?.minWithdrawal ?? 2;
  const maxWithdrawalUSD = withdrawalSettings?.maxWithdrawal ?? 0; // 0 = unlimited

  // Get minimum withdrawal in local currency (rounded up for clean display)
  const minWithdrawalLocal = roundMinimumUp(toLocalCurrency(minWithdrawalUSD));
  // Max withdrawal: use the LOWER of (balance, admin max setting)
  const balanceUSD = Number(availableBalance) || 0;
  const effectiveMaxUSD =
    maxWithdrawalUSD > 0 ? Math.min(balanceUSD, maxWithdrawalUSD) : balanceUSD;
  const maxWithdrawalLocal = toLocalCurrency(effectiveMaxUSD);

  // --- STATE UTAMA ---
  const [step, setStep] = useState(1);
  const [useDefault, setUseDefault] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>(""); // In local currency

  // --- STATE FOR "Use Different Method" ---
  // Store the ID of selected non-default method
  const [selectedOtherMethodId, setSelectedOtherMethodId] = useState<
    string | null
  >(null);

  // Get list of other methods (exclude default)
  const otherMethods = allMethods.filter((m) => !m.isDefault);

  // Get selected other method object
  const selectedOtherMethod =
    otherMethods.find((m) => m.id === selectedOtherMethodId) || null;

  // Reset state pas modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUseDefault(!!defaultMethod);
      setWithdrawAmount("");
      setIsLoading(false);
      // Set first other method as default selection
      setSelectedOtherMethodId(
        otherMethods.length > 0 ? otherMethods[0].id : null,
      );
    }
  }, [isOpen, defaultMethod]);

  // --- LOGIC STEP 1: VALIDASI METODE ---
  const handleNextStep = () => {
    if (!useDefault) {
      if (!selectedOtherMethod) {
        showAlert(t("withdrawalPage.selectValidMethod"), "warning");
        return;
      }
    } else if (!defaultMethod) {
      showAlert(t("withdrawalPage.defaultNotSet"), "error");
      return;
    }
    setStep(2);
  };

  // --- LOGIC STEP 2: SUBMIT ---
  const handleSubmit = async () => {
    // Get selected method for PM currency
    const selectedMethod =
      useDefault && defaultMethod ? defaultMethod : selectedOtherMethod;

    // Get PM currency from method, fallback to user preference
    const pmCurrency = selectedMethod?.currency || currency;
    const pmRates = getExchangeRates();
    const pmRate = pmRates[pmCurrency as keyof typeof pmRates] || 1;

    // Calculate min/max in PM currency using settings
    const minWithdrawalPM =
      pmCurrency === "IDR"
        ? Math.ceil((minWithdrawalUSD * pmRate) / 1000) * 1000
        : minWithdrawalUSD * pmRate;

    // Max withdrawal: use the LOWER of (balance, admin max setting)
    const balanceUSD = Number(availableBalance) || 0;
    const effectiveMaxUSD =
      maxWithdrawalUSD > 0
        ? Math.min(balanceUSD, maxWithdrawalUSD)
        : balanceUSD;
    const maxWithdrawalPM = effectiveMaxUSD * pmRate;

    const amountPM = parseFloat(withdrawAmount);

    // Validate minimum in PM currency
    if (isNaN(amountPM) || amountPM < minWithdrawalPM) {
      const pmSymbol =
        pmCurrency === "IDR"
          ? "Rp "
          : pmCurrency === "USD"
            ? "$"
            : pmCurrency + " ";
      const minFormatted =
        pmCurrency === "IDR"
          ? Math.round(minWithdrawalPM).toLocaleString("id-ID")
          : minWithdrawalPM.toFixed(2);
      showAlert(
        t("withdrawalPage.minWithdrawal", {
          amount: `${pmSymbol}${minFormatted}`,
        }),
        "error",
      );
      return;
    }

    // Validate max in PM currency
    if (amountPM > maxWithdrawalPM) {
      showAlert(t("withdrawalPage.insufficientBalance"), "error");
      return;
    }

    setIsLoading(true);

    // Convert PM amount back to USD for backend
    const amountUSD = amountPM / pmRate;

    // Tentukan metode mana yang dipake (Default atau Selected Other)
    const finalMethod: PaymentMethod =
      useDefault && defaultMethod
        ? defaultMethod
        : {
            id: selectedOtherMethod?.id || "",
            provider: selectedOtherMethod?.provider || "",
            accountName: selectedOtherMethod?.accountName || "",
            accountNumber: selectedOtherMethod?.accountNumber || "",
            currency: selectedOtherMethod?.currency,
          };

    try {
      await onSuccess(amountUSD, finalMethod); // Send USD to backend
      onClose(); // Tutup modal kalo sukses
    } catch (err) {
      // Error udah dihandle di parent (hook)
    } finally {
      setIsLoading(false);
    }
  };

  // Set amount in local currency
  const setPercentage = (percent: number) => {
    const valLocal = maxWithdrawalLocal * (percent / 100);
    // Format based on currency (no decimals for IDR)
    const formatted =
      currency === "IDR"
        ? Math.round(valLocal).toString()
        : valLocal.toFixed(2);
    setWithdrawAmount(formatted);
  };

  const setMinAmount = () => {
    const formatted =
      currency === "IDR"
        ? Math.round(minWithdrawalLocal).toString()
        : minWithdrawalLocal.toFixed(2);
    setWithdrawAmount(formatted);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-figtree"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={clsx(
              "w-full max-w-[50em] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              isDark ? "bg-card" : "bg-white",
            )}
          >
            {/* Header */}
            <div
              className={clsx(
                "px-8 py-6 border-b flex justify-between items-center z-10",
                isDark
                  ? "border-gray-dashboard/30 bg-card"
                  : "border-gray-100 bg-white",
              )}
            >
              <div>
                <h2
                  className={clsx(
                    "text-[2em] font-bold",
                    isDark ? "text-white" : "text-shortblack",
                  )}
                >
                  {t("withdrawalPage.requestPayoutTitle")}
                </h2>
                <p className="text-[1.4em] text-grays">
                  {t("withdrawalPage.stepOf", { step: step })}{" "}
                  {step === 1
                    ? t("withdrawalPage.selectMethod")
                    : t("withdrawalPage.confirmAmount")}
                </p>
              </div>
              <button
                onClick={onClose}
                className={clsx(
                  "p-2 rounded-full transition-colors",
                  isDark
                    ? "hover:bg-gray-dashboard/50 text-gray-400"
                    : "hover:bg-gray-100 text-grays",
                )}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div
              onWheel={(e) => e.stopPropagation()}
              className="p-8 overflow-y-auto custom-scrollbar-minimal flex-1"
            >
              {step === 1 ? (
                // === STEP 1: PILIH METODE ===
                <div className="space-y-6">
                  {/* Option 1: Default Method */}
                  {defaultMethod && (
                    <label
                      className={clsx(
                        "block p-6 rounded-2xl border-2 cursor-pointer transition-all relative",
                        useDefault
                          ? isDark
                            ? "border-bluelight bg-blue-500/10"
                            : "border-bluelight bg-blue-50/50"
                          : isDark
                            ? "border-gray-dashboard/50 hover:border-blue-500/50"
                            : "border-gray-200 hover:border-blue-200",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="method"
                          checked={useDefault}
                          onChange={() => setUseDefault(true)}
                          className="w-6 h-6 text-bluelight border-gray-300 focus:ring-bluelight"
                        />
                        <div className="flex-1">
                          <p
                            className={clsx(
                              "text-[1.6em] font-bold flex items-center gap-2",
                              isDark ? "text-white" : "text-shortblack",
                            )}
                          >
                            <Wallet className="w-5 h-5 text-bluelight" />
                            {t("withdrawalPage.useSavedMethod")}
                          </p>
                          <p className="text-[1.4em] text-grays mt-1">
                            {defaultMethod.provider} •{" "}
                            {defaultMethod.accountNumber}
                          </p>
                        </div>
                      </div>
                    </label>
                  )}

                  {/* Option 2: Different Method */}
                  <label
                    className={clsx(
                      "block p-6 rounded-2xl border-2 cursor-pointer transition-all",
                      !useDefault
                        ? isDark
                          ? "border-bluelight bg-subcard shadow-lg"
                          : "border-bluelight bg-white shadow-md"
                        : isDark
                          ? "border-gray-dashboard/50 hover:border-blue-500/50"
                          : "border-gray-200 hover:border-blue-200",
                    )}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="radio"
                        name="method"
                        checked={!useDefault}
                        onChange={() => setUseDefault(false)}
                        className="w-6 h-6 text-bluelight border-gray-300 focus:ring-bluelight"
                      />
                      <span
                        className={clsx(
                          "text-[1.6em] font-bold",
                          isDark ? "text-white" : "text-shortblack",
                        )}
                      >
                        {t("withdrawalPage.useDifferentMethod")}
                      </span>
                    </div>

                    {/* Saved Methods List (Muncul kalau pilih Different Method) */}
                    <AnimatePresence>
                      {!useDefault && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 pt-2"
                        >
                          {otherMethods.length > 0 ? (
                            otherMethods.map((method) => (
                              <div
                                key={method.id}
                                onClick={() =>
                                  setSelectedOtherMethodId(method.id)
                                }
                                className={clsx(
                                  "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3",
                                  selectedOtherMethodId === method.id
                                    ? isDark
                                      ? "border-bluelight bg-blue-500/10"
                                      : "border-bluelight bg-blue-50"
                                    : isDark
                                      ? "border-gray-dashboard/50 hover:border-gray-dashboard"
                                      : "border-gray-200 hover:border-gray-300",
                                )}
                              >
                                <div
                                  className={clsx(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                    selectedOtherMethodId === method.id
                                      ? "border-bluelight"
                                      : isDark
                                        ? "border-gray-500"
                                        : "border-gray-300",
                                  )}
                                >
                                  {selectedOtherMethodId === method.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-bluelight" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={clsx(
                                      "text-[1.4em] font-semibold",
                                      isDark ? "text-white" : "text-shortblack",
                                    )}
                                  >
                                    {method.provider}
                                  </p>
                                  <p className="text-[1.2em] text-grays">
                                    {method.accountName} •{" "}
                                    {method.accountNumber}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-grays">
                              <p className="text-[1.4em]">
                                {t("withdrawalPage.noOtherMethods")}
                              </p>
                              <p className="text-[1.2em] mt-1">
                                {t("withdrawalPage.addInSettings")}{" "}
                                <Link
                                  href="/settings#payment"
                                  className="text-bluelight underline"
                                >
                                  {t("withdrawalPage.settings")}
                                </Link>
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </label>
                </div>
              ) : (
                // === STEP 2: INPUT AMOUNT ===
                (() => {
                  // Get selected payment method
                  const selectedMethod =
                    useDefault && defaultMethod
                      ? defaultMethod
                      : selectedOtherMethod;

                  // 🎯 Get currency from payment method template, fallback to user preference
                  const pmCurrency = selectedMethod?.currency || currency;
                  const pmSymbol =
                    pmCurrency === "IDR"
                      ? "Rp"
                      : pmCurrency === "USD"
                        ? "$"
                        : pmCurrency;

                  // Convert using PM currency
                  const pmRates = getExchangeRates();
                  const pmRate =
                    pmRates[pmCurrency as keyof typeof pmRates] || 1;
                  const convertToPMCurrency = (usd: number) => usd * pmRate;

                  // Calculate amounts in PM currency using settings
                  const minWithdrawalPM =
                    pmCurrency === "IDR"
                      ? Math.ceil(
                          convertToPMCurrency(minWithdrawalUSD) / 1000,
                        ) * 1000
                      : convertToPMCurrency(minWithdrawalUSD);

                  // Available balance in PM currency (for display)
                  const balanceUSD = Number(availableBalance) || 0;
                  const availableBalancePM = convertToPMCurrency(balanceUSD);

                  // Max withdrawal for button/validation: use LOWER of (balance, admin max setting)
                  // If maxWithdrawalUSD is 0, it means unlimited (use balance only)
                  const effectiveMaxUSD =
                    maxWithdrawalUSD > 0
                      ? Math.min(balanceUSD, maxWithdrawalUSD)
                      : balanceUSD;
                  const maxWithdrawalPM = convertToPMCurrency(effectiveMaxUSD);

                  // Fee from payment_methods is ALWAYS in USD (backend converts on save)
                  // Convert to PM currency for display
                  const feeUSD = Number(selectedMethod?.fee) || 0;
                  const feeInPM = convertToPMCurrency(feeUSD);

                  const amountPM = parseFloat(withdrawAmount) || 0;
                  const totalAmount = amountPM + feeInPM;

                  // Format helper for PM currency
                  const formatPM = (amount: number) => {
                    if (pmCurrency === "IDR") {
                      return `${pmSymbol} ${Math.round(amount).toLocaleString(
                        "id-ID",
                      )}`;
                    }
                    return `${pmSymbol}${amount.toLocaleString(undefined, {
                      minimumFractionDigits: 5,
                      maximumFractionDigits: 5,
                    })}`;
                  };

                  return (
                    <div className="space-y-6">
                      {/* Currency Badge - Show which currency is being used */}
                      <div
                        className={clsx(
                          "flex items-center gap-2 px-4 py-2 rounded-xl border",
                          isDark
                            ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                            : "bg-purple-50 text-purple-700 border-purple-100",
                        )}
                      >
                        <Wallet className="w-4 h-4" />
                        <span className="text-[1.2em] font-medium">
                          {t("withdrawalPage.amountProcessedIn")}{" "}
                          <strong>{pmCurrency}</strong>{" "}
                          {t("withdrawalPage.basedOnMethod")}
                        </span>
                      </div>

                      {/* Info Saldo & Tujuan */}
                      <div
                        className={clsx(
                          "p-5 rounded-2xl flex items-center justify-between border",
                          isDark
                            ? "bg-blue-500/10 border-blue-500/20"
                            : "bg-blues border-blue-100",
                        )}
                      >
                        <div>
                          <p className="text-[1.2em] text-grays mb-0.5 uppercase tracking-wide font-medium">
                            {t("withdrawalPage.availableBalance")}
                          </p>
                          <p className="text-[2em] font-bold text-bluelight">
                            {formatPM(availableBalancePM)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[1.2em] text-grays mb-0.5 uppercase tracking-wide font-medium">
                            {t("withdrawalPage.destination")}
                          </p>
                          <p
                            className={clsx(
                              "text-[1.4em] font-semibold truncate max-w-[200px]",
                              isDark ? "text-white" : "text-shortblack",
                            )}
                          >
                            {useDefault && defaultMethod
                              ? defaultMethod.provider
                              : selectedOtherMethod?.provider}
                          </p>
                          <p className="text-[1.1em] text-grays truncate max-w-[200px]">
                            {useDefault && defaultMethod
                              ? defaultMethod.accountNumber
                              : selectedOtherMethod?.accountNumber}
                          </p>
                        </div>
                      </div>

                      {/* Input Amount */}
                      <div>
                        <label
                          className={clsx(
                            "block text-[1.4em] font-bold mb-2",
                            isDark ? "text-white" : "text-shortblack",
                          )}
                        >
                          {t("withdrawalPage.withdrawalAmount")} ({pmCurrency})
                        </label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[1.8em] font-bold text-grays">
                            {pmSymbol}
                          </span>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder={pmCurrency === "IDR" ? "0" : "0.00"}
                            className={clsx(
                              "w-full pl-14 pr-5 py-3.5 rounded-2xl border-2 text-[2em] font-bold focus:outline-none focus:border-bluelight transition-colors",
                              isDark
                                ? "bg-subcard border-gray-dashboard/50 text-white placeholder:text-gray-500"
                                : "border-gray-200 text-shortblack placeholder:text-gray-300",
                            )}
                            min={minWithdrawalPM}
                            max={maxWithdrawalPM}
                          />
                        </div>
                        {/* Quick Amount Buttons */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <button
                            onClick={() =>
                              setWithdrawAmount(
                                pmCurrency === "IDR"
                                  ? Math.round(minWithdrawalPM).toString()
                                  : minWithdrawalPM.toFixed(2),
                              )
                            }
                            className={clsx(
                              "px-3 py-1.5 rounded-lg text-[1.1em] font-medium transition-colors",
                              isDark
                                ? "bg-gray-dashboard/50 text-gray-300 hover:bg-gray-dashboard"
                                : "bg-gray-100 text-grays hover:bg-gray-200",
                            )}
                          >
                            Min ({formatPM(minWithdrawalPM)})
                          </button>
                          <button
                            onClick={() => {
                              const val = maxWithdrawalPM * 0.5;
                              setWithdrawAmount(
                                pmCurrency === "IDR"
                                  ? Math.round(val).toString()
                                  : val.toFixed(2),
                              );
                            }}
                            className={clsx(
                              "px-3 py-1.5 rounded-lg text-[1.1em] font-medium transition-colors",
                              isDark
                                ? "bg-gray-dashboard/50 text-gray-300 hover:bg-gray-dashboard"
                                : "bg-gray-100 text-grays hover:bg-gray-200",
                            )}
                          >
                            50%
                          </button>
                          <button
                            onClick={() =>
                              setWithdrawAmount(
                                pmCurrency === "IDR"
                                  ? Math.round(maxWithdrawalPM).toString()
                                  : maxWithdrawalPM.toFixed(2),
                              )
                            }
                            className={clsx(
                              "px-3 py-1.5 rounded-lg text-[1.1em] font-medium transition-colors",
                              isDark
                                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                : "bg-blue-100 text-bluelight hover:bg-blue-200",
                            )}
                          >
                            {t("withdrawalPage.max")} (
                            {formatPM(maxWithdrawalPM)})
                          </button>
                        </div>
                      </div>

                      {/* Fee & Total Breakdown */}
                      <div
                        className={clsx(
                          "space-y-2 pt-2 border-t",
                          isDark
                            ? "border-gray-dashboard/30"
                            : "border-gray-100",
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[1.3em] text-grays">
                            {t("withdrawalPage.feeAmount")}
                          </span>
                          <span className="text-[1.3em] text-grays">
                            {formatPM(feeInPM)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={clsx(
                              "text-[1.4em] font-semibold",
                              isDark ? "text-white" : "text-shortblack",
                            )}
                          >
                            {t("withdrawalPage.totalAmount")}
                          </span>
                          <span
                            className={clsx(
                              "text-[1.6em] font-bold",
                              isDark ? "text-white" : "text-shortblack",
                            )}
                          >
                            {formatPM(totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={clsx(
                          "flex gap-2 items-start p-3 rounded-xl border",
                          isDark
                            ? "bg-orange-500/10 text-orange-300 border-orange-500/20"
                            : "bg-orange-50 text-orange-700 border-orange-100",
                        )}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-[1.1em] leading-snug">
                          {t("withdrawalPage.withdrawalWarning")}
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Footer Buttons */}
            <div
              className={clsx(
                "px-8 py-6 border-t flex justify-end gap-4",
                isDark
                  ? "border-gray-dashboard/30 bg-subcard"
                  : "border-gray-100 bg-gray-50",
              )}
            >
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className={clsx(
                    "px-6 py-3 rounded-xl text-[1.6em] font-medium transition-colors",
                    isDark
                      ? "text-gray-300 hover:bg-gray-dashboard/50"
                      : "text-grays hover:bg-gray-200",
                  )}
                >
                  {t("withdrawalPage.back")}
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={handleNextStep}
                  className="bg-bluelight text-white px-8 py-3 rounded-xl text-[1.6em] font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  {t("withdrawalPage.nextStep")}{" "}
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={clsx(
                    "bg-greenlight text-white px-8 py-3 rounded-xl text-[1.6em] font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg",
                    isDark ? "shadow-green-900/30" : "shadow-green-200",
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {t("withdrawalPage.confirmWithdrawal")}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
