// src/components/dashboard/admin/settings/SelfClickSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MousePointerClick, Loader2, Check, Info } from "lucide-react";
import { useSelfClickSettings } from "@/hooks/useSelfClickSettings";
import Toast from "@/components/common/Toast";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function SelfClickSettings() {
  const { settings, isLoading, updateSettings, isUpdating } =
    useSelfClickSettings();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Local form state
  const [enabled, setEnabled] = useState(settings.enabled);
  const [cpcPercentage, setCpcPercentage] = useState(settings.cpc_percentage);
  const [dailyLimit, setDailyLimit] = useState(settings.daily_limit);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Sync local state when settings load
  useEffect(() => {
    setEnabled(settings.enabled);
    setCpcPercentage(settings.cpc_percentage);
    setDailyLimit(settings.daily_limit);
  }, [settings]);

  const handleSave = () => {
    updateSettings(
      {
        enabled,
        cpc_percentage: cpcPercentage,
        daily_limit: dailyLimit,
      },
      {
        onSuccess: () => {
          setToastMessage("Pengaturan self-click berhasil disimpan!");
          setToastType("success");
          setShowToast(true);
        },
        onError: (error: any) => {
          setToastMessage(error.message || "Gagal menyimpan pengaturan");
          setToastType("error");
          setShowToast(true);
        },
      }
    );
  };

  const hasChanges =
    enabled !== settings.enabled ||
    cpcPercentage !== settings.cpc_percentage ||
    dailyLimit !== settings.daily_limit;

  if (isLoading) {
    return (
      <div
        className={clsx(
          "rounded-3xl p-6 shadow-sm border",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
        )}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "rounded-3xl p-6 shadow-sm border",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center gap-4 mb-6 pb-4 border-b",
          isDark ? "border-gray-700" : "border-gray-100"
        )}
      >
        <div
          className={clsx(
            "p-3 rounded-2xl",
            isDark ? "bg-purple-500/20" : "bg-purple-100"
          )}
        >
          <MousePointerClick
            className={clsx(
              "w-6 h-6",
              isDark ? "text-purple-400" : "text-purple-600"
            )}
          />
        </div>
        <div>
          <h2
            className={clsx(
              "text-[1.8em] font-bold",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Pengaturan Self-Click
          </h2>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays"
            )}
          >
            Atur batas dan earning untuk klik link sendiri
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className={clsx(
          "rounded-2xl p-4 mb-6 flex gap-3",
          isDark ? "bg-blue-500/10" : "bg-blue-50"
        )}
      >
        <Info className="w-5 h-5 text-bluelight shrink-0 mt-0.5" />
        <div
          className={clsx(
            "text-[1.2em]",
            isDark ? "text-gray-300" : "text-gray-600"
          )}
        >
          <p
            className={clsx(
              "font-medium mb-1",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            Cara Kerja:
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              Self-click terdeteksi jika IP DAN Fingerprint sama dengan owner
            </li>
            <li>
              User bisa dapat earning dari self-click dengan rate yang dikurangi
            </li>
            <li>Limit harian mencegah abuse dari ganti browser</li>
          </ul>
        </div>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Enable Toggle */}
        <div
          className={clsx(
            "flex items-center justify-between p-4 rounded-2xl",
            isDark ? "bg-subcard" : "bg-blues"
          )}
        >
          <div>
            <h3
              className={clsx(
                "text-[1.4em] font-semibold",
                isDark ? "text-white" : "text-shortblack"
              )}
            >
              Aktifkan Self-Click Earning
            </h3>
            <p
              className={clsx(
                "text-[1.2em]",
                isDark ? "text-gray-400" : "text-grays"
              )}
            >
              Izinkan user mendapat earning dari klik link sendiri
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={clsx(
              "relative w-14 h-7 rounded-full transition-colors duration-300",
              enabled ? "bg-bluelight" : isDark ? "bg-gray-600" : "bg-gray-300"
            )}
          >
            <div
              className={clsx(
                "absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300",
                enabled ? "left-8" : "left-1"
              )}
            />
          </button>
        </div>

        {/* CPC Percentage */}
        <div
          className={clsx(
            "p-4 rounded-2xl",
            isDark ? "bg-subcard" : "bg-blues"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3
                className={clsx(
                  "text-[1.4em] font-semibold",
                  isDark ? "text-white" : "text-shortblack"
                )}
              >
                Persentase CPC Self-Click
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays"
                )}
              >
                Berapa % dari rate normal yang didapat dari self-click
              </p>
            </div>
            <div className="text-[1.8em] font-bold text-bluelight">
              {cpcPercentage}%
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={cpcPercentage}
            onChange={(e) => setCpcPercentage(Number(e.target.value))}
            className={clsx(
              "w-full h-2 rounded-lg appearance-none cursor-pointer accent-bluelight",
              isDark ? "bg-gray-700" : "bg-gray-200"
            )}
            disabled={!enabled}
          />
          <div
            className={clsx(
              "flex justify-between text-[1.1em] mt-1",
              isDark ? "text-gray-500" : "text-grays"
            )}
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Daily Limit */}
        <div
          className={clsx(
            "p-4 rounded-2xl",
            isDark ? "bg-subcard" : "bg-blues"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={clsx(
                  "text-[1.4em] font-semibold",
                  isDark ? "text-white" : "text-shortblack"
                )}
              >
                Limit Harian Per User
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays"
                )}
              >
                Maksimal self-click yang dapat earning per hari
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDailyLimit(Math.max(1, dailyLimit - 1))}
                disabled={!enabled || dailyLimit <= 1}
                className={clsx(
                  "w-10 h-10 rounded-xl border font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                  isDark
                    ? "bg-card border-gray-700 text-white hover:bg-gray-700"
                    : "bg-white border-gray-200 text-shortblack hover:bg-gray-50"
                )}
              >
                -
              </button>
              <div
                className={clsx(
                  "w-16 h-10 rounded-xl border flex items-center justify-center text-[1.6em] font-bold text-bluelight",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                {dailyLimit}
              </div>
              <button
                onClick={() => setDailyLimit(Math.min(100, dailyLimit + 1))}
                disabled={!enabled || dailyLimit >= 100}
                className={clsx(
                  "w-10 h-10 rounded-xl border font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                  isDark
                    ? "bg-card border-gray-700 text-white hover:bg-gray-700"
                    : "bg-white border-gray-200 text-shortblack hover:bg-gray-50"
                )}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isUpdating}
          className="flex items-center gap-2 px-6 py-3 bg-bluelight text-white text-[1.4em] font-semibold rounded-xl 
                     hover:bg-opacity-90 hover:shadow-lg transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  );
}
