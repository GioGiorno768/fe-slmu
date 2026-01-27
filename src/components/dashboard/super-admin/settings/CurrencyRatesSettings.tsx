// src/components/dashboard/super-admin/settings/CurrencyRatesSettings.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Coins,
  Save,
  Loader2,
  RefreshCw,
  Info,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { useAlert } from "@/hooks/useAlert";
import { useTheme } from "next-themes";
import Image from "next/image";
import currencyRatesService, {
  CurrencyItem,
} from "@/services/currencyRatesService";

// All available world currencies for dropdown
const ALL_CURRENCIES = [
  { code: "AED", name: "UAE Dirham", flag: "ae", symbol: "د.إ" },
  { code: "ARS", name: "Argentine Peso", flag: "ar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", flag: "au", symbol: "A$" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "bd", symbol: "৳" },
  { code: "BRL", name: "Brazilian Real", flag: "br", symbol: "R$" },
  { code: "CAD", name: "Canadian Dollar", flag: "ca", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", flag: "ch", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", flag: "cn", symbol: "¥" },
  { code: "EGP", name: "Egyptian Pound", flag: "eg", symbol: "E£" },
  { code: "EUR", name: "Euro", flag: "eu", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "gb", symbol: "£" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "hk", symbol: "HK$" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "id", symbol: "Rp" },
  { code: "INR", name: "Indian Rupee", flag: "in", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", flag: "jp", symbol: "¥" },
  { code: "KRW", name: "South Korean Won", flag: "kr", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", flag: "mx", symbol: "$" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "my", symbol: "RM" },
  { code: "NGN", name: "Nigerian Naira", flag: "ng", symbol: "₦" },
  { code: "NZD", name: "New Zealand Dollar", flag: "nz", symbol: "NZ$" },
  { code: "PHP", name: "Philippine Peso", flag: "ph", symbol: "₱" },
  { code: "PKR", name: "Pakistani Rupee", flag: "pk", symbol: "Rs" },
  { code: "PLN", name: "Polish Zloty", flag: "pl", symbol: "zł" },
  { code: "RUB", name: "Russian Ruble", flag: "ru", symbol: "₽" },
  { code: "SAR", name: "Saudi Riyal", flag: "sa", symbol: "ر.س" },
  { code: "SEK", name: "Swedish Krona", flag: "se", symbol: "kr" },
  { code: "SGD", name: "Singapore Dollar", flag: "sg", symbol: "S$" },
  { code: "THB", name: "Thai Baht", flag: "th", symbol: "฿" },
  { code: "TRY", name: "Turkish Lira", flag: "tr", symbol: "₺" },
  { code: "TWD", name: "Taiwan Dollar", flag: "tw", symbol: "NT$" },
  { code: "USD", name: "US Dollar", flag: "us", symbol: "$" },
  { code: "VND", name: "Vietnamese Dong", flag: "vn", symbol: "₫" },
  { code: "ZAR", name: "South African Rand", flag: "za", symbol: "R" },
];

// Use CurrencyItem from service
// interface is imported from currencyRatesService

// Default currencies on first load
const DEFAULT_CURRENCIES: CurrencyItem[] = [
  { code: "USD", name: "US Dollar", flag: "us", symbol: "$", rate: 1 },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    flag: "id",
    symbol: "Rp",
    rate: 16000,
  },
  { code: "EUR", name: "Euro", flag: "eu", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", flag: "gb", symbol: "£", rate: 0.79 },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    flag: "my",
    symbol: "RM",
    rate: 4.5,
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    flag: "sg",
    symbol: "S$",
    rate: 1.35,
  },
];

export default function CurrencyRatesSettings() {
  const { showAlert } = useAlert();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [currencies, setCurrencies] =
    useState<CurrencyItem[]>(DEFAULT_CURRENCIES);
  const [originalCurrencies, setOriginalCurrencies] =
    useState<CurrencyItem[]>(DEFAULT_CURRENCIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<
    (typeof ALL_CURRENCIES)[0] | null
  >(null);
  const [newRate, setNewRate] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Check if currencies changed
  const isDirty =
    JSON.stringify(currencies) !== JSON.stringify(originalCurrencies);

  // Fetch rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await currencyRatesService.getRates();
        setCurrencies(data.currencies);
        setOriginalCurrencies(data.currencies);
        setLastUpdated(data.last_updated);
      } catch (error) {
        console.error("Failed to fetch currency rates:", error);
        // Use defaults if API fails
        setCurrencies(DEFAULT_CURRENCIES);
        setOriginalCurrencies(DEFAULT_CURRENCIES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter available currencies (exclude already added ones)
  const availableCurrencies = ALL_CURRENCIES.filter(
    (c) => !currencies.some((existing) => existing.code === c.code),
  ).filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRateChange = (code: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCurrencies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, rate: numValue } : c)),
    );
  };

  const handleDeleteCurrency = (code: string) => {
    if (code === "USD") {
      showAlert("Cannot delete base currency (USD)", "error");
      return;
    }
    setCurrencies((prev) => prev.filter((c) => c.code !== code));
    showAlert(`${code} removed`, "success");
  };

  const handleAddCurrency = () => {
    if (!selectedCurrency || !newRate) {
      showAlert("Please select a currency and enter rate", "error");
      return;
    }

    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate <= 0) {
      showAlert("Please enter a valid rate", "error");
      return;
    }

    setIsAdding(true);

    // Simulate API delay
    setTimeout(() => {
      const newCurrency: CurrencyItem = {
        ...selectedCurrency,
        rate: rate,
      };

      setCurrencies((prev) => [...prev, newCurrency]);
      setIsAddModalOpen(false);
      setSelectedCurrency(null);
      setNewRate("");
      setSearchQuery("");
      setIsAdding(false);
      showAlert(`${selectedCurrency.code} added successfully!`, "success");
    }, 300);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = await currencyRatesService.updateRates(currencies);
      setOriginalCurrencies(data.currencies);
      setLastUpdated(data.last_updated);
      showAlert("Currency rates saved successfully!", "success");
    } catch (error) {
      console.error("Failed to save currency rates:", error);
      showAlert("Failed to save currency rates", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCurrencies(originalCurrencies);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "rounded-3xl p-8 shadow-sm",
          isDark
            ? "bg-card shadow-shd-card/50"
            : "bg-white border border-gray-100",
        )}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={clsx(
          "rounded-3xl p-8 shadow-sm",
          isDark
            ? "bg-card shadow-shd-card/50"
            : "bg-white border border-gray-100",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "p-3 rounded-2xl",
                isDark ? "bg-green-500/20" : "bg-green-100",
              )}
            >
              <Coins
                className={clsx(
                  "w-6 h-6",
                  isDark ? "text-green-400" : "text-green-600",
                )}
              />
            </div>
            <div>
              <h3 className="text-[1.8em] font-bold text-shortblack">
                💱 Currency Exchange Rates
              </h3>
              <p className="text-[1.3em] text-grays">
                Set nilai tukar mata uang terhadap USD
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={clsx(
                "px-4 py-2.5 rounded-xl text-[1.3em] font-medium transition-all flex items-center gap-2",
                isDark
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-green-100 text-green-700 hover:bg-green-200",
              )}
            >
              <Plus className="w-4 h-4" />
              Add Currency
            </button>
            {isDirty && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-grays hover:text-shortblack rounded-xl text-[1.3em] font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="px-5 py-2.5 bg-bluelight hover:bg-bluelight/90 text-white rounded-xl text-[1.3em] font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Rates
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className={clsx(
            "p-4 rounded-2xl border mb-6",
            isDark
              ? "bg-blue-500/10 border-blue-500/20"
              : "bg-blue-50 border-blue-100",
          )}
        >
          <div className="flex items-start gap-3">
            <Info
              className={clsx(
                "w-5 h-5 shrink-0 mt-0.5",
                isDark ? "text-blue-400" : "text-blue-600",
              )}
            />
            <div>
              <p
                className={clsx(
                  "text-[1.3em]",
                  isDark ? "text-blue-300" : "text-blue-800",
                )}
              >
                Rate ini digunakan untuk <strong>display only</strong>. Semua
                data di backend tetap disimpan dalam USD. User akan melihat
                nilai terkonversi sesuai currency pilihan mereka.
              </p>
              {lastUpdated && (
                <p
                  className={clsx(
                    "text-[1.1em] mt-1",
                    isDark ? "text-blue-400" : "text-blue-600",
                  )}
                >
                  Last updated: {formatDate(lastUpdated)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className={clsx(
                "p-5 rounded-2xl border transition-all relative group",
                currency.code === "USD"
                  ? isDark
                    ? "bg-gray-800/50 border-gray-800"
                    : "bg-gray-100 border-gray-200"
                  : isDark
                    ? "bg-subcard border-gray-700 hover:border-bluelight/50"
                    : "bg-gray-50 border-gray-200 hover:border-bluelight",
              )}
            >
              {/* Delete Button (not for USD) */}
              {currency.code !== "USD" && (
                <button
                  onClick={() => handleDeleteCurrency(currency.code)}
                  className={clsx(
                    "absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all",
                    isDark
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-red-100 text-red-600 hover:bg-red-200",
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Currency Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={clsx(
                    "relative w-10 h-7 rounded-md overflow-hidden shadow-sm border",
                    isDark ? "border-gray-700" : "border-gray-200",
                  )}
                >
                  <Image
                    src={`https://flagcdn.com/${currency.flag}.svg`}
                    alt={currency.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[1.4em] font-bold text-shortblack">
                    {currency.code}
                  </p>
                  <p className="text-[1.1em] text-grays leading-tight">
                    {currency.name}
                  </p>
                </div>
              </div>

              {/* Rate Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[1.4em] text-grays font-medium">
                  1 USD =
                </span>
                <input
                  type="number"
                  value={currency.rate}
                  onChange={(e) =>
                    handleRateChange(currency.code, e.target.value)
                  }
                  disabled={currency.code === "USD"}
                  step={
                    currency.code === "IDR" ||
                    currency.code === "VND" ||
                    currency.code === "KRW"
                      ? "100"
                      : "0.01"
                  }
                  min="0"
                  className={clsx(
                    "w-full pl-[5.5em] pr-14 py-3 rounded-xl text-[1.4em] font-semibold text-right focus:ring-2 focus:ring-bluelight focus:border-transparent transition-all",
                    currency.code !== "USD"
                      ? isDark
                        ? "bg-card border border-gray-700 text-shortblack"
                        : "bg-white border border-gray-300 text-gray-900"
                      : isDark
                        ? "bg-gray-800 border-0 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 border-0 text-gray-500 cursor-not-allowed",
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[1.3em] text-grays font-medium">
                  {currency.symbol}
                </span>
              </div>

              {/* USD Lock Note */}
              {currency.code === "USD" && (
                <p className="text-[1.1em] text-grays mt-2 italic">
                  Base currency (tidak bisa diubah)
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Tips */}
        <div
          className={clsx(
            "mt-6 p-4 rounded-2xl border",
            isDark
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-amber-50 border-amber-200",
          )}
        >
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-amber-300" : "text-amber-800",
            )}
          >
            💡 <strong>Tips:</strong> Untuk mengambil margin, set rate sedikit
            di bawah market rate. Contoh: jika market rate USD/IDR = 16.500, set
            16.000 untuk margin ~3%.
          </p>
        </div>
      </motion.div>

      {/* Add Currency Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 h-screen"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                "w-full max-w-md rounded-3xl p-6 shadow-2xl",
                isDark ? "bg-card" : "bg-white",
              )}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[1.8em] font-bold text-shortblack">
                  Add New Currency
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className={clsx(
                    "p-2 rounded-xl transition-colors",
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
                  )}
                >
                  <X className="w-5 h-5 text-grays" />
                </button>
              </div>

              {/* Currency Dropdown */}
              <div className="mb-4" ref={dropdownRef}>
                <label className="block text-[1.3em] font-semibold text-shortblack mb-2">
                  Select Currency
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={clsx(
                      "w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all",
                      isDark
                        ? "bg-subcard border border-gray-700 hover:border-bluelight/50"
                        : "bg-gray-50 border border-gray-200 hover:border-bluelight",
                    )}
                  >
                    {selectedCurrency ? (
                      <>
                        <div className="relative w-8 h-6 rounded overflow-hidden border border-gray-300">
                          <Image
                            src={`https://flagcdn.com/${selectedCurrency.flag}.svg`}
                            alt={selectedCurrency.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[1.4em] font-medium text-shortblack">
                          {selectedCurrency.code} - {selectedCurrency.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-[1.4em] text-grays">
                        Choose a currency...
                      </span>
                    )}
                    <ChevronDown
                      className={clsx(
                        "w-5 h-5 ml-auto text-grays transition-transform",
                        isDropdownOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={clsx(
                          "absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl z-10 overflow-hidden",
                          isDark
                            ? "bg-card border border-gray-700"
                            : "bg-white border border-gray-200",
                        )}
                      >
                        {/* Search */}
                        <div
                          className={clsx(
                            "p-2 border-b",
                            isDark ? "border-gray-700" : "border-gray-200",
                          )}
                        >
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grays" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search currency..."
                              className={clsx(
                                "w-full pl-10 pr-4 py-2 rounded-lg text-[1.3em]",
                                isDark
                                  ? "bg-subcard border border-gray-700 text-shortblack"
                                  : "bg-gray-50 border border-gray-200 text-gray-900",
                              )}
                            />
                          </div>
                        </div>

                        {/* Currency List */}
                        <div className="max-h-60 overflow-y-auto p-2">
                          {availableCurrencies.length > 0 ? (
                            availableCurrencies.map((currency) => (
                              <button
                                key={currency.code}
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setIsDropdownOpen(false);
                                  setSearchQuery("");
                                }}
                                className={clsx(
                                  "w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors",
                                  isDark
                                    ? "hover:bg-subcard"
                                    : "hover:bg-gray-100",
                                )}
                              >
                                <div className="relative w-8 h-6 rounded overflow-hidden border border-gray-300">
                                  <Image
                                    src={`https://flagcdn.com/${currency.flag}.svg`}
                                    alt={currency.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="text-left">
                                  <p className="text-[1.3em] font-semibold text-shortblack">
                                    {currency.code}
                                  </p>
                                  <p className="text-[1.1em] text-grays">
                                    {currency.name}
                                  </p>
                                </div>
                                {selectedCurrency?.code === currency.code && (
                                  <Check className="w-4 h-4 ml-auto text-bluelight" />
                                )}
                              </button>
                            ))
                          ) : (
                            <p className="text-center text-[1.3em] text-grays py-4">
                              No currencies available
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Rate Input */}
              <div className="mb-6">
                <label className="block text-[1.3em] font-semibold text-shortblack mb-2">
                  Exchange Rate (1 USD = ?)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="Enter rate..."
                    step="0.01"
                    min="0"
                    className={clsx(
                      "w-full px-4 py-3 pr-14 rounded-xl text-[1.4em] font-medium",
                      isDark
                        ? "bg-subcard border border-gray-700 text-shortblack focus:border-bluelight"
                        : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-bluelight",
                    )}
                  />
                  {selectedCurrency && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[1.3em] text-grays font-medium">
                      {selectedCurrency.symbol}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className={clsx(
                    "flex-1 py-3 rounded-xl text-[1.4em] font-semibold transition-colors",
                    isDark
                      ? "bg-gray-800 text-grays hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCurrency}
                  disabled={!selectedCurrency || !newRate || isAdding}
                  className="flex-1 py-3 bg-bluelight text-white rounded-xl text-[1.4em] font-semibold hover:bg-bluelight/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  Add Currency
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
