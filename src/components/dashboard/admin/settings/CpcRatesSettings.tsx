"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign,
  Loader2,
  Check,
  Plus,
  Trash2,
  Globe,
  Info,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import Toast from "@/components/common/Toast";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import { getCpcRates, saveCpcRates } from "@/services/adLevelService";
import { useTheme } from "next-themes";

// Country list with flags
const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
];

interface CountryRate {
  countryCode: string;
  countryName: string;
  flag: string;
  level1Rate: number;
  level2Rate: number;
  level3Rate: number;
  level4Rate: number;
}

interface CpcRatesConfig {
  defaultRates: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
  };
  countryRates: CountryRate[];
}

const mockConfig: CpcRatesConfig = {
  defaultRates: {
    level1: 0.0025,
    level2: 0.004,
    level3: 0.006,
    level4: 0.0085,
  },
  countryRates: [
    {
      countryCode: "US",
      countryName: "United States",
      flag: "🇺🇸",
      level1Rate: 0.01,
      level2Rate: 0.015,
      level3Rate: 0.02,
      level4Rate: 0.025,
    },
  ],
};

// Level color schemes - computed based on theme
const getLevelColors = (isDark: boolean) => [
  {
    bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
    border: isDark ? "border-emerald-500/30" : "border-emerald-200",
    text: isDark ? "text-emerald-400" : "text-emerald-600",
    labelBg: isDark ? "bg-emerald-500/20" : "bg-emerald-100",
    label: "Low",
  },
  {
    bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
    border: isDark ? "border-blue-500/30" : "border-blue-200",
    text: isDark ? "text-blue-400" : "text-blue-600",
    labelBg: isDark ? "bg-blue-500/20" : "bg-blue-100",
    label: "Medium",
  },
  {
    bg: isDark ? "bg-orange-500/10" : "bg-orange-50",
    border: isDark ? "border-orange-500/30" : "border-orange-200",
    text: isDark ? "text-orange-400" : "text-orange-600",
    labelBg: isDark ? "bg-orange-500/20" : "bg-orange-100",
    label: "High",
  },
  {
    bg: isDark ? "bg-red-500/10" : "bg-red-50",
    border: isDark ? "border-red-500/30" : "border-red-200",
    text: isDark ? "text-red-400" : "text-red-600",
    labelBg: isDark ? "bg-red-500/20" : "bg-red-100",
    label: "Extreme",
  },
];

export default function CpcRatesSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [defaultRates, setDefaultRates] = useState(mockConfig.defaultRates);
  const [countryRates, setCountryRates] = useState<CountryRate[]>([]);

  // Track initial state for hasChanges comparison
  const [initialRates, setInitialRates] = useState(mockConfig.defaultRates);
  const [initialCountryRates, setInitialCountryRates] = useState<CountryRate[]>(
    []
  );

  const [showAddCountry, setShowAddCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCountry, setDeletingCountry] = useState<CountryRate | null>(
    null
  );

  // Check if there are unsaved changes
  const hasChanges = (): boolean => {
    // Compare default rates
    if (
      defaultRates.level1 !== initialRates.level1 ||
      defaultRates.level2 !== initialRates.level2 ||
      defaultRates.level3 !== initialRates.level3 ||
      defaultRates.level4 !== initialRates.level4
    ) {
      return true;
    }

    // Compare country rates count
    if (countryRates.length !== initialCountryRates.length) {
      return true;
    }

    // Compare each country rate
    for (const cr of countryRates) {
      const initial = initialCountryRates.find(
        (icr) => icr.countryCode === cr.countryCode
      );
      if (!initial) return true; // New country added
      if (
        cr.level1Rate !== initial.level1Rate ||
        cr.level2Rate !== initial.level2Rate ||
        cr.level3Rate !== initial.level3Rate ||
        cr.level4Rate !== initial.level4Rate
      ) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCpcRates();
        setDefaultRates({
          level1: data.defaultRates.level_1,
          level2: data.defaultRates.level_2,
          level3: data.defaultRates.level_3,
          level4: data.defaultRates.level_4,
        });
        // Map country rates from API format
        const mappedCountryRates = data.countryRates.map((cr) => {
          const country = COUNTRIES.find((c) => c.code === cr.country);
          return {
            countryCode: cr.country,
            countryName: country?.name || cr.countryName || cr.country,
            flag: country?.flag || "🏳️",
            level1Rate: cr.rates.level_1,
            level2Rate: cr.rates.level_2,
            level3Rate: cr.rates.level_3,
            level4Rate: cr.rates.level_4,
          };
        });
        setCountryRates(mappedCountryRates);

        // Store initial state for hasChanges comparison
        setInitialRates({
          level1: data.defaultRates.level_1,
          level2: data.defaultRates.level_2,
          level3: data.defaultRates.level_3,
          level4: data.defaultRates.level_4,
        });
        setInitialCountryRates(mappedCountryRates);
      } catch (error) {
        console.error("Failed to load CPC rates:", error);
        setToastMessage("Failed to load CPC rates");
        setToastType("error");
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveClick = () => setShowSaveConfirm(true);

  const confirmSave = async () => {
    setShowSaveConfirm(false);
    setIsSaving(true);
    try {
      await saveCpcRates({
        defaultRates: {
          level_1: defaultRates.level1,
          level_2: defaultRates.level2,
          level_3: defaultRates.level3,
          level_4: defaultRates.level4,
        },
        countryRates: countryRates.map((cr) => ({
          country: cr.countryCode,
          rates: {
            level_1: cr.level1Rate,
            level_2: cr.level2Rate,
            level_3: cr.level3Rate,
            level_4: cr.level4Rate,
          },
        })),
      });

      // Update initial state so hasChanges() returns false
      setInitialRates({ ...defaultRates });
      setInitialCountryRates([...countryRates]);

      setToastMessage("CPC rates saved successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Failed to save CPC rates:", error);
      setToastMessage("Failed to save CPC rates");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const addCountryRate = () => {
    if (!selectedCountry) return;
    const country = COUNTRIES.find((c) => c.code === selectedCountry);
    if (!country) return;
    if (countryRates.some((c) => c.countryCode === selectedCountry)) {
      setToastMessage("This country already has custom rates!");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const newRate: CountryRate = {
      countryCode: country.code,
      countryName: country.name,
      flag: country.flag,
      level1Rate: defaultRates.level1,
      level2Rate: defaultRates.level2,
      level3Rate: defaultRates.level3,
      level4Rate: defaultRates.level4,
    };

    setCountryRates([...countryRates, newRate]);
    setShowAddCountry(false);
    setSelectedCountry("");
    setExpandedCountry(newRate.countryCode);
  };

  const handleDeleteClick = (country: CountryRate) => {
    setDeletingCountry(country);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingCountry) {
      setCountryRates(
        countryRates.filter(
          (c) => c.countryCode !== deletingCountry.countryCode
        )
      );
      setToastMessage(`${deletingCountry.countryName} rates removed`);
      setToastType("success");
      setShowToast(true);
    }
    setShowDeleteConfirm(false);
    setDeletingCountry(null);
  };

  const updateCountryRate = (
    countryCode: string,
    level: "level1Rate" | "level2Rate" | "level3Rate" | "level4Rate",
    value: number
  ) => {
    setCountryRates(
      countryRates.map((c) =>
        c.countryCode === countryCode ? { ...c, [level]: value } : c
      )
    );
  };

  const formatCPM = (cpc: number) => `$${(cpc * 1000).toFixed(5)}`;

  if (isLoading) {
    return (
      <div className="bg-card rounded-3xl p-8 shadow-sm shadow-shd-card/50">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl shadow-sm shadow-shd-card/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-bluelight to-blue-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-[2em] font-bold">CPC Rates</h2>
            <p className="text-white/80 text-[1.2em]">
              Configure earnings per click for each level
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/30">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-[1.2em] text-grays">
            <span className="font-semibold text-blue-600">CPC</span> (Cost Per
            Click) is what you set.{" "}
            <span className="font-semibold text-blue-600">CPM</span> (CPC ×
            1000) is displayed to users.
          </div>
        </div>

        {/* Default Rates Section */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Globe
              className={clsx(
                "w-5 h-5",
                isDark ? "text-gray-400" : "text-gray-500"
              )}
            />
            <h3
              className={clsx(
                "text-[1.6em] font-bold",
                isDark ? "text-white" : "text-shortblack"
              )}
            >
              Default Rates
            </h3>
            <span
              className={clsx(
                "px-2 py-0.5 text-[1em] rounded-full font-medium",
                isDark
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              Global
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((level) => {
              const key = `level${level}` as keyof typeof defaultRates;
              const levelColors = getLevelColors(isDark);
              const color = levelColors[level - 1];
              return (
                <motion.div
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  className={clsx(
                    "p-5 rounded-2xl border-2 transition-all",
                    color.bg,
                    color.border
                  )}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={clsx("text-[1.3em] font-bold", color.text)}
                    >
                      Level {level}
                    </span>
                    <span
                      className={clsx(
                        "text-[1em] px-2 py-0.5 rounded-full",
                        color.labelBg,
                        color.text
                      )}
                    >
                      {color.label}
                    </span>
                  </div>
                  <div className="relative mb-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.0001"
                      value={defaultRates[key]}
                      onChange={(e) =>
                        setDefaultRates({
                          ...defaultRates,
                          [key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={clsx(
                        "w-full pl-7 pr-3 py-3 rounded-xl bg-card border focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none text-[1.4em] font-semibold",
                        isDark
                          ? "border-gray-700 text-white"
                          : "border-gray-200 text-shortblack"
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-bluelight" />
                    <span className="text-[1.1em] text-bluelight font-medium">
                      CPM: {formatCPM(defaultRates[key])}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Country-Specific Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h3
                className={clsx(
                  "text-[1.6em] font-bold",
                  isDark ? "text-white" : "text-shortblack"
                )}
              >
                Country Overrides
              </h3>
              {countryRates.length > 0 && (
                <span
                  className={clsx(
                    "px-2.5 py-1 text-[1.1em] rounded-full font-semibold",
                    isDark
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-purple-100 text-purple-600"
                  )}
                >
                  {countryRates.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowAddCountry(!showAddCountry)}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[1.3em] font-semibold transition-all",
                showAddCountry
                  ? isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                  : "bg-bluelight text-white hover:bg-opacity-90 shadow-lg shadow-blue-500/20"
              )}
            >
              <Plus
                className={clsx(
                  "w-4 h-4 transition-transform",
                  showAddCountry && "rotate-45"
                )}
              />
              {showAddCountry ? "Cancel" : "Add Country"}
            </button>
          </div>

          {/* Add Country Panel */}
          <AnimatePresence>
            {showAddCountry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className={clsx(
                    "mb-5 p-5 rounded-2xl border",
                    isDark
                      ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30"
                      : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100"
                  )}
                >
                  <label
                    className={clsx(
                      "block text-[1.2em] font-semibold mb-3",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    Select a country to add custom rates
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className={clsx(
                        "flex-1 min-w-[200px] px-4 py-3 rounded-xl border bg-card focus:border-bluelight outline-none text-[1.3em]",
                        isDark
                          ? "border-gray-700 text-white"
                          : "border-gray-200 text-shortblack"
                      )}
                    >
                      <option value="">Choose a country...</option>
                      {COUNTRIES.filter(
                        (c) =>
                          !countryRates.some((cr) => cr.countryCode === c.code)
                      ).map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addCountryRate}
                      disabled={!selectedCountry}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl text-[1.3em] font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
                    >
                      Add Country
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Country Rate Cards */}
          {countryRates.length === 0 ? (
            <div
              className={clsx(
                "text-center py-12 bg-subcard rounded-2xl border-2 border-dashed",
                isDark ? "border-gray-700" : "border-gray-200"
              )}
            >
              <Globe
                className={clsx(
                  "w-12 h-12 mx-auto mb-3",
                  isDark ? "text-gray-600" : "text-gray-300"
                )}
              />
              <p className="text-[1.4em] text-gray-400 font-medium">
                No country overrides yet
              </p>
              <p
                className={clsx(
                  "text-[1.2em] mt-1",
                  isDark ? "text-gray-600" : "text-gray-300"
                )}
              >
                All countries use default rates
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {countryRates.map((country) => {
                const isExpanded = expandedCountry === country.countryCode;
                return (
                  <motion.div
                    key={country.countryCode}
                    layout
                    className={clsx(
                      "rounded-2xl border overflow-hidden",
                      isDark
                        ? "bg-gradient-to-r from-gray-800/50 to-slate-800/50 border-gray-700"
                        : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100"
                    )}
                  >
                    {/* Country Header */}
                    <div
                      className={clsx(
                        "flex items-center justify-between p-4 cursor-pointer transition-all",
                        isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"
                      )}
                      onClick={() =>
                        setExpandedCountry(
                          isExpanded ? null : country.countryCode
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span
                          className={clsx(
                            "text-[1.4em] font-bold",
                            isDark ? "text-white" : "text-shortblack"
                          )}
                        >
                          {country.countryName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(country);
                          }}
                          className={clsx(
                            "p-2 text-red-400 hover:text-red-600 rounded-lg transition-all",
                            isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronDown
                          className={clsx(
                            "w-5 h-5 text-gray-400 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {(
                              [
                                "level1Rate",
                                "level2Rate",
                                "level3Rate",
                                "level4Rate",
                              ] as const
                            ).map((levelKey, idx) => {
                              const countryLevelColors = getLevelColors(isDark);
                              const color = countryLevelColors[idx];
                              return (
                                <div
                                  key={levelKey}
                                  className={clsx(
                                    "p-4 rounded-xl border",
                                    color.bg,
                                    color.border
                                  )}
                                >
                                  <label
                                    className={clsx(
                                      "block text-[1.1em] font-semibold mb-2",
                                      color.text
                                    )}
                                  >
                                    Level {idx + 1}
                                  </label>
                                  <div className="relative mb-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                      $
                                    </span>
                                    <input
                                      type="number"
                                      step="0.0001"
                                      value={country[levelKey]}
                                      onChange={(e) =>
                                        updateCountryRate(
                                          country.countryCode,
                                          levelKey,
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className={clsx(
                                        "w-full pl-7 pr-3 py-2.5 rounded-lg bg-card border focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none text-[1.2em] font-semibold",
                                        isDark
                                          ? "border-gray-700 text-white"
                                          : "border-gray-200 text-shortblack"
                                      )}
                                    />
                                  </div>
                                  <span className="text-[1em] text-bluelight font-medium">
                                    CPM: {formatCPM(country[levelKey])}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className={clsx(
        "sticky bottom-0 p-6 bg-card border-t shadow-lg",
        isDark ? "border-gray-800 shadow-none" : "border-gray-100 shadow-gray-200/50"
      )}>
        <div className="flex justify-end">
          <button
            onClick={handleSaveClick}
            disabled={isSaving || !hasChanges()}
            className="flex items-center gap-2 px-8 py-3.5 bg-bluelight text-white text-[1.4em] font-bold rounded-2xl 
                       hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={confirmSave}
        title="Save CPC Rates?"
        description="This will update earnings for all ad levels. Changes take effect immediately."
        confirmLabel="Save Changes"
        cancelLabel="Cancel"
        type="info"
        isLoading={isSaving}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingCountry(null);
        }}
        onConfirm={confirmDelete}
        title="Remove Country Override?"
        description={`Remove custom rates for ${deletingCountry?.countryName}? This country will use default rates.`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        type="danger"
        isLoading={false}
      />

      {/* Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  );
}
