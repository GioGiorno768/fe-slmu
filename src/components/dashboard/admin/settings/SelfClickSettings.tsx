// src/components/dashboard/admin/settings/SelfClickSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MousePointerClick, Loader2, Check, Info } from "lucide-react";
import { useSelfClickSettings } from "@/hooks/useSelfClickSettings";
import Toast from "@/components/common/Toast";

export default function SelfClickSettings() {
  const { settings, isLoading, updateSettings, isUpdating } =
    useSelfClickSettings();

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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
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
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="p-3 bg-purple-100 rounded-2xl">
          <MousePointerClick className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-[1.8em] font-bold text-shortblack">
            Pengaturan Self-Click
          </h2>
          <p className="text-[1.2em] text-grays">
            Atur batas dan earning untuk klik link sendiri
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-bluelight shrink-0 mt-0.5" />
        <div className="text-[1.2em] text-gray-600">
          <p className="font-medium text-shortblack mb-1">Cara Kerja:</p>
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
        <div className="flex items-center justify-between p-4 bg-blues rounded-2xl">
          <div>
            <h3 className="text-[1.4em] font-semibold text-shortblack">
              Aktifkan Self-Click Earning
            </h3>
            <p className="text-[1.2em] text-grays">
              Izinkan user mendapat earning dari klik link sendiri
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              enabled ? "bg-bluelight" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                enabled ? "left-8" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* CPC Percentage */}
        <div className="p-4 bg-blues rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[1.4em] font-semibold text-shortblack">
                Persentase CPC Self-Click
              </h3>
              <p className="text-[1.2em] text-grays">
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bluelight"
            disabled={!enabled}
          />
          <div className="flex justify-between text-[1.1em] text-grays mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Daily Limit */}
        <div className="p-4 bg-blues rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[1.4em] font-semibold text-shortblack">
                Limit Harian Per User
              </h3>
              <p className="text-[1.2em] text-grays">
                Maksimal self-click yang dapat earning per hari
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDailyLimit(Math.max(1, dailyLimit - 1))}
                disabled={!enabled || dailyLimit <= 1}
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-shortblack font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <div className="w-16 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[1.6em] font-bold text-bluelight">
                {dailyLimit}
              </div>
              <button
                onClick={() => setDailyLimit(Math.min(100, dailyLimit + 1))}
                disabled={!enabled || dailyLimit >= 100}
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-shortblack font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
