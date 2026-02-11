// src/app/[locale]/(super-admin)/super-admin/backup/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Download,
  Loader2,
  Users,
  Link2,
  Eye,
  ArrowLeftRight,
  Wallet,
  ShieldAlert,
  Calendar,
  FileDown,
  HardDrive,
  Settings,
  Crown,
  Megaphone,
  CreditCard,
  BarChart3,
  Globe,
  Share2,
  History,
  Bell,
  Radio,
  Ban,
  Flag,
  ToggleLeft,
  LayoutTemplate,
} from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import Toast from "@/components/common/Toast";
import * as backupService from "@/services/backupService";
import type { BackupType, BackupStats } from "@/services/backupService";

const TYPE_ICONS: Record<string, any> = {
  users: Users,
  links: Link2,
  transactions: ArrowLeftRight,
  payouts: Wallet,
  settings: Settings,
  levels: Crown,
  ad_level_configs: Megaphone,
  ad_rates: CreditCard,
  payment_methods: CreditCard,
  payment_method_templates: LayoutTemplate,
  user_daily_stats: BarChart3,
  user_country_stats: Globe,
  user_referrer_stats: Share2,
  notifications: Bell,
  global_notifications: Radio,
  violation_referrers: Ban,
  link_reports: Flag,
  global_features: ToggleLeft,
};

const PERIOD_OPTIONS = [
  { value: "day", label: "Hari Ini" },
  { value: "week", label: "Minggu Ini" },
  { value: "month", label: "Bulan Ini" },
  { value: "year", label: "Tahun Ini" },
  { value: "all", label: "Semua Data" },
];

export default function BackupPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [types, setTypes] = useState<BackupType[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [period, setPeriod] = useState("all");
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Load backup types on mount
  useEffect(() => {
    loadTypes();
  }, []);

  // Load stats when period changes
  useEffect(() => {
    loadStats(period);
  }, [period]);

  const loadTypes = async () => {
    try {
      const data = await backupService.getBackupTypes();
      setTypes(data);
    } catch {
      toast("Gagal memuat tipe backup", "error");
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const loadStats = async (p: string) => {
    setIsLoadingStats(true);
    try {
      const data = await backupService.getBackupStats(p);
      setStats(data);
    } catch {
      // silent
    } finally {
      setIsLoadingStats(false);
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const selectAll = () => {
    if (selectedTypes.length === types.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(types.map((t) => t.type));
    }
  };

  const handleGenerate = async () => {
    if (selectedTypes.length === 0) {
      toast("Pilih minimal 1 tipe data", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await backupService.generateBackup(selectedTypes, period);

      // Trigger download
      const typesStr =
        selectedTypes.length > 2
          ? `multiple_${selectedTypes.length}`
          : selectedTypes.join("_");
      const date = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[T:]/g, "_")
        .replace(/-/g, "-");
      const filename = `backup_${typesStr}_${period}_${date}.sql`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast("Backup berhasil didownload!", "success");
    } catch {
      toast("Gagal membuat backup", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const toast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const totalSelectedRows = selectedTypes.reduce(
    (sum, type) => sum + (stats?.counts[type] ?? 0),
    0,
  );

  if (isLoadingTypes) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 font-figtree text-[10px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={clsx(
              "text-[2.8em] font-bold",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            Backup Data
          </h1>
          <p
            className={clsx(
              "text-[1.4em] mt-1",
              isDark ? "text-gray-400" : "text-grays",
            )}
          >
            Export database ke file .sql untuk backup dan restore
          </p>
        </div>
        <div
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-2xl border",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-200",
          )}
        >
          <HardDrive
            className={clsx(
              "w-5 h-5",
              isDark ? "text-blue-400" : "text-bluelight",
            )}
          />
          <span
            className={clsx(
              "text-[1.3em] font-medium",
              isDark ? "text-gray-300" : "text-shortblack",
            )}
          >
            Format: MySQL (.sql)
          </span>
        </div>
      </div>

      {/* Period Selector */}
      <div
        className={clsx(
          "rounded-2xl border p-6",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-200",
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar
            className={clsx(
              "w-5 h-5",
              isDark ? "text-purple-400" : "text-purple-600",
            )}
          />
          <h2
            className={clsx(
              "text-[1.6em] font-bold",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            Periode Data
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={clsx(
                "px-4 py-2 rounded-xl text-[1.3em] font-medium transition-all duration-200",
                period === opt.value
                  ? "bg-bluelight text-white shadow-md"
                  : isDark
                    ? "bg-subcard text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "bg-blues text-grays hover:bg-gray-200 hover:text-shortblack",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Selection */}
      <div
        className={clsx(
          "rounded-2xl border p-6",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-200",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database
              className={clsx(
                "w-5 h-5",
                isDark ? "text-emerald-400" : "text-emerald-600",
              )}
            />
            <h2
              className={clsx(
                "text-[1.6em] font-bold",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              Pilih Data
            </h2>
          </div>
          <button
            onClick={selectAll}
            className={clsx(
              "text-[1.2em] font-medium px-3 py-1.5 rounded-lg transition-colors",
              isDark
                ? "text-blue-400 hover:bg-blue-500/10"
                : "text-bluelight hover:bg-blue-50",
            )}
          >
            {selectedTypes.length === types.length
              ? "Batal Semua"
              : "Pilih Semua"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Critical Group */}
          <div className="col-span-full">
            <p
              className={clsx(
                "text-[1.2em] font-bold uppercase tracking-wider mb-1",
                isDark ? "text-red-400" : "text-red-500",
              )}
            >
              🔴 Data Kritikal
            </p>
          </div>
          {types
            .filter((t) => t.group === "critical")
            .map((type) => {
              const Icon = TYPE_ICONS[type.type] || Database;
              const isSelected = selectedTypes.includes(type.type);
              const count = stats?.counts[type.type] ?? 0;
              return (
                <button
                  key={type.type}
                  onClick={() => toggleType(type.type)}
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                    isSelected
                      ? isDark
                        ? "border-bluelight bg-blue-500/10"
                        : "border-bluelight bg-blue-50"
                      : isDark
                        ? "border-gray-700 bg-subcard hover:border-gray-600"
                        : "border-gray-200 bg-blues hover:border-gray-300",
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected
                        ? "bg-bluelight border-bluelight"
                        : isDark
                          ? "border-gray-600"
                          : "border-gray-300",
                    )}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={clsx(
                      "p-2 rounded-xl shrink-0",
                      isSelected
                        ? isDark
                          ? "bg-blue-500/20"
                          : "bg-blue-100"
                        : isDark
                          ? "bg-gray-700"
                          : "bg-gray-100",
                    )}
                  >
                    <Icon
                      className={clsx(
                        "w-5 h-5",
                        isSelected
                          ? "text-bluelight"
                          : isDark
                            ? "text-gray-400"
                            : "text-grays",
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={clsx(
                        "text-[1.4em] font-semibold",
                        isDark ? "text-white" : "text-shortblack",
                      )}
                    >
                      {type.label}
                    </p>
                    <p
                      className={clsx(
                        "text-[1.1em]",
                        isDark ? "text-gray-500" : "text-grays",
                      )}
                    >
                      {type.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {isLoadingStats ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <p
                        className={clsx(
                          "text-[1.4em] font-bold",
                          isDark ? "text-gray-300" : "text-shortblack",
                        )}
                      >
                        {count.toLocaleString()}
                      </p>
                    )}
                    <p
                      className={clsx(
                        "text-[1em]",
                        isDark ? "text-gray-600" : "text-grays",
                      )}
                    >
                      rows
                    </p>
                  </div>
                </button>
              );
            })}

          {/* Important Group */}
          <div className="col-span-full mt-4">
            <p
              className={clsx(
                "text-[1.2em] font-bold uppercase tracking-wider mb-1",
                isDark ? "text-yellow-400" : "text-yellow-600",
              )}
            >
              🟡 Analytics & Audit
            </p>
          </div>
          {types
            .filter((t) => t.group === "important")
            .map((type) => {
              const Icon = TYPE_ICONS[type.type] || Database;
              const isSelected = selectedTypes.includes(type.type);
              const count = stats?.counts[type.type] ?? 0;
              return (
                <button
                  key={type.type}
                  onClick={() => toggleType(type.type)}
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                    isSelected
                      ? isDark
                        ? "border-bluelight bg-blue-500/10"
                        : "border-bluelight bg-blue-50"
                      : isDark
                        ? "border-gray-700 bg-subcard hover:border-gray-600"
                        : "border-gray-200 bg-blues hover:border-gray-300",
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected
                        ? "bg-bluelight border-bluelight"
                        : isDark
                          ? "border-gray-600"
                          : "border-gray-300",
                    )}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={clsx(
                      "p-2 rounded-xl shrink-0",
                      isSelected
                        ? isDark
                          ? "bg-blue-500/20"
                          : "bg-blue-100"
                        : isDark
                          ? "bg-gray-700"
                          : "bg-gray-100",
                    )}
                  >
                    <Icon
                      className={clsx(
                        "w-5 h-5",
                        isSelected
                          ? "text-bluelight"
                          : isDark
                            ? "text-gray-400"
                            : "text-grays",
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={clsx(
                        "text-[1.4em] font-semibold",
                        isDark ? "text-white" : "text-shortblack",
                      )}
                    >
                      {type.label}
                    </p>
                    <p
                      className={clsx(
                        "text-[1.1em]",
                        isDark ? "text-gray-500" : "text-grays",
                      )}
                    >
                      {type.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {isLoadingStats ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <p
                        className={clsx(
                          "text-[1.4em] font-bold",
                          isDark ? "text-gray-300" : "text-shortblack",
                        )}
                      >
                        {count.toLocaleString()}
                      </p>
                    )}
                    <p
                      className={clsx(
                        "text-[1em]",
                        isDark ? "text-gray-600" : "text-grays",
                      )}
                    >
                      rows
                    </p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Summary & Download */}
      <div
        className={clsx(
          "rounded-2xl border p-6",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-200",
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Summary */}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-500" : "text-grays",
                )}
              >
                Tabel Dipilih
              </p>
              <p
                className={clsx(
                  "text-[2em] font-bold",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                {selectedTypes.length}{" "}
                <span className="text-[0.6em] font-normal text-grays">
                  / {types.length}
                </span>
              </p>
            </div>
            <div
              className={clsx(
                "w-px h-10 hidden sm:block",
                isDark ? "bg-gray-700" : "bg-gray-200",
              )}
            />
            <div>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-500" : "text-grays",
                )}
              >
                Total Rows
              </p>
              <p className="text-[2em] font-bold text-bluelight">
                {totalSelectedRows.toLocaleString()}
              </p>
            </div>
            <div
              className={clsx(
                "w-px h-10 hidden sm:block",
                isDark ? "bg-gray-700" : "bg-gray-200",
              )}
            />
            <div>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-500" : "text-grays",
                )}
              >
                Format
              </p>
              <p
                className={clsx(
                  "text-[2em] font-bold",
                  isDark ? "text-emerald-400" : "text-emerald-600",
                )}
              >
                .sql
              </p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleGenerate}
            disabled={selectedTypes.length === 0 || isGenerating}
            className={clsx(
              "flex items-center gap-3 px-8 py-4 rounded-2xl text-[1.5em] font-bold transition-all duration-300",
              selectedTypes.length > 0 && !isGenerating
                ? "bg-bluelight text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500",
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileDown className="w-6 h-6" />
                <span>Download Backup</span>
              </>
            )}
          </button>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
