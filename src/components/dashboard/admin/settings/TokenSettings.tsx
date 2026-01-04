// src/components/dashboard/admin/settings/TokenSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Timer, Loader2, Check, Info } from "lucide-react";
import { useLinkSettings } from "@/hooks/useLinkSettings";
import Toast from "@/components/common/Toast";

export default function TokenSettings() {
  const { settings, isLoading, updateSettings, isUpdating } = useLinkSettings();

  // Local form state - use string to allow empty input while typing
  const [minWaitSeconds, setMinWaitSeconds] = useState<number | string>(
    settings.min_wait_seconds
  );
  const [expirySeconds, setExpirySeconds] = useState<number | string>(
    settings.expiry_seconds
  );
  const [massLinkLimit, setMassLinkLimit] = useState<number | string>(
    settings.mass_link_limit ?? 20
  );
  const [guestLinkLimit, setGuestLinkLimit] = useState<number | string>(
    settings.guest_link_limit ?? 3
  );
  const [guestLinkLimitDays, setGuestLinkLimitDays] = useState<number | string>(
    settings.guest_link_limit_days ?? 1
  );

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Sync local state when settings load
  useEffect(() => {
    setMinWaitSeconds(settings.min_wait_seconds);
    setExpirySeconds(settings.expiry_seconds);
    setMassLinkLimit(settings.mass_link_limit ?? 20);
    setGuestLinkLimit(settings.guest_link_limit ?? 3);
    setGuestLinkLimitDays(settings.guest_link_limit_days ?? 1);
  }, [settings]);

  const handleSave = () => {
    // Validate and clamp values before saving
    const validMinWait = Math.min(
      60,
      Math.max(1, Number(minWaitSeconds) || 12)
    );
    const validExpiry = Math.min(
      600,
      Math.max(60, Number(expirySeconds) || 180)
    );
    const validMassLimit = Math.min(
      100,
      Math.max(1, Number(massLinkLimit) || 20)
    );
    const validGuestLimit = Math.min(
      50,
      Math.max(0, Number(guestLinkLimit) || 3)
    );
    const validGuestLimitDays = Math.min(
      30,
      Math.max(1, Number(guestLinkLimitDays) || 1)
    );

    updateSettings(
      {
        min_wait_seconds: validMinWait,
        expiry_seconds: validExpiry,
        mass_link_limit: validMassLimit,
        guest_link_limit: validGuestLimit,
        guest_link_limit_days: validGuestLimitDays,
      },
      {
        onSuccess: () => {
          setToastMessage("Pengaturan token berhasil disimpan!");
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
    minWaitSeconds !== settings.min_wait_seconds ||
    expirySeconds !== settings.expiry_seconds ||
    massLinkLimit !== (settings.mass_link_limit ?? 20) ||
    guestLinkLimit !== (settings.guest_link_limit ?? 3) ||
    guestLinkLimitDays !== (settings.guest_link_limit_days ?? 1);

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
        <div className="p-3 bg-orange-100 rounded-2xl">
          <Timer className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-[1.8em] font-bold text-shortblack">
            Pengaturan Token
          </h2>
          <p className="text-[1.2em] text-grays">
            Atur durasi tunggu dan expiry token shortlink
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-50 rounded-2xl p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="text-[1.2em] text-gray-600">
          <p className="font-medium text-shortblack mb-1">Keterangan:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <strong>Min Wait Time:</strong> Waktu minimum visitor harus
              menunggu sebelum bisa continue (bot protection)
            </li>
            <li>
              <strong>Token Expiry:</strong> Waktu maksimum token valid sebelum
              expired
            </li>
            <li>
              <strong>Mass Link Limit:</strong> Jumlah maksimal URL yang bisa
              dibuat sekaligus oleh user (batch create)
            </li>
            <li>
              <strong>Guest Link Limit:</strong> Jumlah maksimal link per hari
              untuk visitor yang belum login (0 = disabled)
            </li>
          </ul>
        </div>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Min Wait Seconds */}
        <div className="p-4 bg-blues rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[1.4em] font-semibold text-shortblack">
                Waktu Tunggu Minimum
              </h3>
              <p className="text-[1.2em] text-grays">
                Visitor harus menunggu sekian detik sebelum bisa continue (1-60)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="60"
                value={minWaitSeconds}
                onChange={(e) =>
                  setMinWaitSeconds(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    60,
                    Math.max(1, Number(e.target.value) || 12)
                  );
                  setMinWaitSeconds(value);
                }}
                className="w-20 text-[1.6em] font-bold text-center text-bluelight bg-white border-2 border-gray-200 rounded-xl py-2 focus:outline-none focus:border-bluelight"
              />
              <span className="text-[1.4em] font-medium text-grays">detik</span>
            </div>
          </div>
        </div>

        {/* Expiry Seconds */}
        <div className="p-4 bg-blues rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[1.4em] font-semibold text-shortblack">
                Token Expiry
              </h3>
              <p className="text-[1.2em] text-grays">
                Token akan expired setelah durasi ini (1-10 menit)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={
                  typeof expirySeconds === "number"
                    ? Math.round(expirySeconds / 60)
                    : ""
                }
                onChange={(e) =>
                  setExpirySeconds(
                    e.target.value === "" ? "" : Number(e.target.value) * 60
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    10,
                    Math.max(1, Number(e.target.value) || 3)
                  );
                  setExpirySeconds(value * 60);
                }}
                className="w-20 text-[1.6em] font-bold text-center text-bluelight bg-white border-2 border-gray-200 rounded-xl py-2 focus:outline-none focus:border-bluelight"
              />
              <span className="text-[1.4em] font-medium text-grays">menit</span>
            </div>
          </div>
        </div>

        {/* Mass Link Limit */}
        <div className="p-4 bg-blues rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[1.4em] font-semibold text-shortblack">
                Mass Link Limit
              </h3>
              <p className="text-[1.2em] text-grays">
                Jumlah maksimal URL yang bisa dibuat sekaligus (1-100)
              </p>
            </div>
            <input
              type="number"
              min="1"
              max="100"
              value={massLinkLimit}
              onChange={(e) =>
                setMassLinkLimit(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              onBlur={(e) => {
                const value = Math.min(
                  100,
                  Math.max(1, Number(e.target.value) || 20)
                );
                setMassLinkLimit(value);
              }}
              className="w-24 text-[1.6em] font-bold text-center text-bluelight bg-white border-2 border-gray-200 rounded-xl py-2 focus:outline-none focus:border-bluelight"
            />
          </div>
        </div>

        {/* Guest Link Limit */}
        <div className="p-4 bg-blues rounded-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-[1.4em] font-semibold text-shortblack">
                Guest Link Limit
              </h3>
              <p className="text-[1.2em] text-grays">
                Limit link untuk guest yang belum login (0 = disabled)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="50"
                value={guestLinkLimit}
                onChange={(e) =>
                  setGuestLinkLimit(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    50,
                    Math.max(0, Number(e.target.value) || 3)
                  );
                  setGuestLinkLimit(value);
                }}
                className="w-16 text-[1.6em] font-bold text-center text-bluelight bg-white border-2 border-gray-200 rounded-xl py-2 focus:outline-none focus:border-bluelight"
              />
              <span className="text-[1.3em] font-medium text-grays">
                link per
              </span>
              <input
                type="number"
                min="1"
                max="30"
                value={guestLinkLimitDays}
                onChange={(e) =>
                  setGuestLinkLimitDays(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    30,
                    Math.max(1, Number(e.target.value) || 1)
                  );
                  setGuestLinkLimitDays(value);
                }}
                className="w-16 text-[1.6em] font-bold text-center text-bluelight bg-white border-2 border-gray-200 rounded-xl py-2 focus:outline-none focus:border-bluelight"
              />
              <span className="text-[1.3em] font-medium text-grays">hari</span>
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
