// src/components/dashboard/admin/settings/VisitorCooldownSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Loader2, Check, Info, Clock, Link2 } from "lucide-react";
import { useVisitorCooldownSettings } from "@/hooks/useVisitorCooldownSettings";
import Toast from "@/components/common/Toast";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function VisitorCooldownSettings() {
  const { settings, isLoading, updateSettings, isUpdating } =
    useVisitorCooldownSettings();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Local form state
  const [enabled, setEnabled] = useState(settings.enabled);
  const [maxLinks, setMaxLinks] = useState(settings.max_links_per_user);
  const [cooldownHours, setCooldownHours] = useState(settings.cooldown_hours);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Sync local state when settings load
  useEffect(() => {
    setEnabled(settings.enabled);
    setMaxLinks(settings.max_links_per_user);
    setCooldownHours(settings.cooldown_hours);
  }, [settings]);

  const handleSave = () => {
    updateSettings(
      {
        enabled,
        max_links_per_user: maxLinks,
        cooldown_hours: cooldownHours,
      },
      {
        onSuccess: () => {
          setToastMessage("Pengaturan visitor cooldown berhasil disimpan!");
          setToastType("success");
          setShowToast(true);
        },
        onError: (error: any) => {
          setToastMessage(error.message || "Gagal menyimpan pengaturan");
          setToastType("error");
          setShowToast(true);
        },
      },
    );
  };

  const hasChanges =
    enabled !== settings.enabled ||
    maxLinks !== settings.max_links_per_user ||
    cooldownHours !== settings.cooldown_hours;

  if (isLoading) {
    return (
      <div
        className={clsx(
          "rounded-3xl p-6 shadow-sm border",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
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
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center gap-4 mb-6 pb-4 border-b",
          isDark ? "border-gray-700" : "border-gray-100",
        )}
      >
        <div
          className={clsx(
            "p-3 rounded-2xl",
            isDark ? "bg-emerald-500/20" : "bg-emerald-100",
          )}
        >
          <Users
            className={clsx(
              "w-6 h-6",
              isDark ? "text-emerald-400" : "text-emerald-600",
            )}
          />
        </div>
        <div>
          <h2
            className={clsx(
              "text-[1.8em] font-bold",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            Visitor Cooldown
          </h2>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays",
            )}
          >
            Batasi earning per visitor untuk mencegah abuse
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className={clsx(
          "rounded-2xl p-4 mb-6 flex gap-3",
          isDark ? "bg-emerald-500/10" : "bg-emerald-50",
        )}
      >
        <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div
          className={clsx(
            "text-[1.2em]",
            isDark ? "text-gray-300" : "text-gray-600",
          )}
        >
          <p
            className={clsx(
              "font-medium mb-1",
              isDark ? "text-white" : "text-shortblack",
            )}
          >
            Cara Kerja:
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              Membatasi berapa link dari <strong>owner yang sama</strong> yang
              bisa menghasilkan earning dari 1 visitor
            </li>
            <li>
              Jika visitor sudah mengunjungi {maxLinks} link dari owner yang
              sama, kunjungan berikutnya tidak mendapat earning
            </li>
            <li>
              Reset setelah {cooldownHours} jam — visitor bisa earn lagi setelah
              cooldown berakhir
            </li>
          </ul>
        </div>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Enable Toggle */}
        <div
          className={clsx(
            "flex items-center justify-between p-4 rounded-2xl",
            isDark ? "bg-subcard" : "bg-blues",
          )}
        >
          <div>
            <h3
              className={clsx(
                "text-[1.4em] font-semibold",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              Aktifkan Visitor Cooldown
            </h3>
            <p
              className={clsx(
                "text-[1.2em]",
                isDark ? "text-gray-400" : "text-grays",
              )}
            >
              Batasi earning per visitor per owner
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={clsx(
              "relative w-14 h-7 rounded-full transition-colors duration-300",
              enabled ? "bg-bluelight" : isDark ? "bg-gray-600" : "bg-gray-300",
            )}
          >
            <div
              className={clsx(
                "absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300",
                enabled ? "left-8" : "left-1",
              )}
            />
          </button>
        </div>

        {/* Max Links Per User */}
        <div
          className={clsx(
            "p-4 rounded-2xl",
            isDark ? "bg-subcard" : "bg-blues",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={clsx(
                  "text-[1.4em] font-semibold flex items-center gap-2",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                <Link2 className="w-4 h-4" />
                Max Link Per Visitor
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Maksimal link dari owner yang sama yang dapat earning per
                visitor
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMaxLinks(Math.max(1, maxLinks - 1))}
                disabled={!enabled || maxLinks <= 1}
                className={clsx(
                  "w-10 h-10 rounded-xl border font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                  isDark
                    ? "bg-card border-gray-700 text-white hover:bg-gray-700"
                    : "bg-white border-gray-200 text-shortblack hover:bg-gray-50",
                )}
              >
                -
              </button>
              <div
                className={clsx(
                  "w-16 h-10 rounded-xl border flex items-center justify-center text-[1.6em] font-bold text-bluelight",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                {maxLinks}
              </div>
              <button
                onClick={() => setMaxLinks(Math.min(50, maxLinks + 1))}
                disabled={!enabled || maxLinks >= 50}
                className={clsx(
                  "w-10 h-10 rounded-xl border font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                  isDark
                    ? "bg-card border-gray-700 text-white hover:bg-gray-700"
                    : "bg-white border-gray-200 text-shortblack hover:bg-gray-50",
                )}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Cooldown Hours */}
        <div
          className={clsx(
            "p-4 rounded-2xl",
            isDark ? "bg-subcard" : "bg-blues",
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3
                className={clsx(
                  "text-[1.4em] font-semibold flex items-center gap-2",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                <Clock className="w-4 h-4" />
                Periode Cooldown
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Berapa jam sampai visitor bisa earn lagi dari owner yang sama
              </p>
            </div>
            <div className="text-[1.8em] font-bold text-bluelight">
              {cooldownHours}h
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="168"
            step="1"
            value={cooldownHours}
            onChange={(e) => setCooldownHours(Number(e.target.value))}
            className={clsx(
              "w-full h-2 rounded-lg appearance-none cursor-pointer accent-bluelight",
              isDark ? "bg-gray-700" : "bg-gray-200",
            )}
            disabled={!enabled}
          />
          <div
            className={clsx(
              "flex justify-between text-[1.1em] mt-1",
              isDark ? "text-gray-500" : "text-grays",
            )}
          >
            <span>1h</span>
            <span>24h</span>
            <span>72h</span>
            <span>168h (7d)</span>
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
