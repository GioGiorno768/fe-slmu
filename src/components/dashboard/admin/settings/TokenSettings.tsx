// src/components/dashboard/admin/settings/TokenSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Timer, Loader2, Check, Info, MousePointerClick } from "lucide-react";
import { useLinkSettings } from "@/hooks/useLinkSettings";
import Toast from "@/components/common/Toast";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function TokenSettings() {
  const { settings, isLoading, updateSettings, isUpdating } = useLinkSettings();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Local form state - use string to allow empty input while typing
  const [minWaitSeconds, setMinWaitSeconds] = useState<number | string>(
    settings.min_wait_seconds,
  );
  const [expirySeconds, setExpirySeconds] = useState<number | string>(
    settings.expiry_seconds,
  );
  const [massLinkLimit, setMassLinkLimit] = useState<number | string>(
    settings.mass_link_limit ?? 20,
  );
  const [guestLinkLimit, setGuestLinkLimit] = useState<number | string>(
    settings.guest_link_limit ?? 3,
  );
  const [guestLinkLimitDays, setGuestLinkLimitDays] = useState<number | string>(
    settings.guest_link_limit_days ?? 1,
  );
  const [modalWaitSeconds, setModalWaitSeconds] = useState<number | string>(
    settings.modal_wait_seconds ?? 60,
  );
  const [modalAdClicksRequired, setModalAdClicksRequired] = useState<
    number | string
  >(settings.modal_ad_clicks_required ?? 5);
  const [modalTimeReductionPerClick, setModalTimeReductionPerClick] = useState<
    number | string
  >(settings.modal_time_reduction_per_click ?? 10);

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
    setModalWaitSeconds(settings.modal_wait_seconds ?? 60);
    setModalAdClicksRequired(settings.modal_ad_clicks_required ?? 5);
    setModalTimeReductionPerClick(
      settings.modal_time_reduction_per_click ?? 10,
    );
  }, [settings]);

  const handleSave = () => {
    // Validate and clamp values before saving
    const validMinWait = Math.min(
      60,
      Math.max(1, Number(minWaitSeconds) || 12),
    );
    const validExpiry = Math.min(
      1800,
      Math.max(60, Number(expirySeconds) || 180),
    );
    const validMassLimit = Math.min(
      100,
      Math.max(1, Number(massLinkLimit) || 20),
    );
    const validGuestLimit = Math.min(
      50,
      Math.max(0, Number(guestLinkLimit) || 3),
    );
    const validGuestLimitDays = Math.min(
      30,
      Math.max(1, Number(guestLinkLimitDays) || 1),
    );
    const validModalWait = Math.min(
      300,
      Math.max(10, Number(modalWaitSeconds) || 60),
    );
    const validModalClicks = Math.min(
      20,
      Math.max(1, Number(modalAdClicksRequired) || 5),
    );
    const validModalReduction = Math.min(
      60,
      Math.max(1, Number(modalTimeReductionPerClick) || 10),
    );

    updateSettings(
      {
        min_wait_seconds: validMinWait,
        expiry_seconds: validExpiry,
        mass_link_limit: validMassLimit,
        guest_link_limit: validGuestLimit,
        guest_link_limit_days: validGuestLimitDays,
        modal_wait_seconds: validModalWait,
        modal_ad_clicks_required: validModalClicks,
        modal_time_reduction_per_click: validModalReduction,
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
      },
    );
  };

  const hasChanges =
    minWaitSeconds !== settings.min_wait_seconds ||
    expirySeconds !== settings.expiry_seconds ||
    massLinkLimit !== (settings.mass_link_limit ?? 20) ||
    guestLinkLimit !== (settings.guest_link_limit ?? 3) ||
    guestLinkLimitDays !== (settings.guest_link_limit_days ?? 1) ||
    modalWaitSeconds !== (settings.modal_wait_seconds ?? 60) ||
    modalAdClicksRequired !== (settings.modal_ad_clicks_required ?? 5) ||
    modalTimeReductionPerClick !==
      (settings.modal_time_reduction_per_click ?? 10);

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
            isDark ? "bg-orange-500/20" : "bg-orange-100",
          )}
        >
          <Timer
            className={clsx(
              "w-6 h-6",
              isDark ? "text-orange-400" : "text-orange-600",
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
            Pengaturan Token
          </h2>
          <p
            className={clsx(
              "text-[1.2em]",
              isDark ? "text-gray-400" : "text-grays",
            )}
          >
            Atur durasi tunggu dan expiry token shortlink
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className={clsx(
          "rounded-2xl p-4 mb-6 flex gap-3",
          isDark ? "bg-orange-500/10" : "bg-orange-50",
        )}
      >
        <Info
          className={clsx(
            "w-5 h-5 shrink-0 mt-0.5",
            isDark ? "text-orange-400" : "text-orange-500",
          )}
        />
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
            Keterangan:
          </p>
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
            <li>
              <strong>Modal Iklan:</strong> Pengaturan modal yang muncul di step
              terakhir (ads level 2-4) untuk meningkatkan engagement iklan
            </li>
          </ul>
        </div>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Min Wait Seconds */}
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
                  "text-[1.4em] font-semibold",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                Waktu Tunggu Minimum
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
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
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    60,
                    Math.max(1, Number(e.target.value) || 12),
                  );
                  setMinWaitSeconds(value);
                }}
                className={clsx(
                  "w-20 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-200",
                )}
              />
              <span
                className={clsx(
                  "text-[1.4em] font-medium",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                detik
              </span>
            </div>
          </div>
        </div>

        {/* Expiry Seconds */}
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
                  "text-[1.4em] font-semibold",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                Token Expiry
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                Token akan expired setelah durasi ini (1-30 menit)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={
                  typeof expirySeconds === "number"
                    ? Math.round(expirySeconds / 60)
                    : ""
                }
                onChange={(e) =>
                  setExpirySeconds(
                    e.target.value === "" ? "" : Number(e.target.value) * 60,
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    30,
                    Math.max(1, Number(e.target.value) || 3),
                  );
                  setExpirySeconds(value * 60);
                }}
                className={clsx(
                  "w-20 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-200",
                )}
              />
              <span
                className={clsx(
                  "text-[1.4em] font-medium",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                menit
              </span>
            </div>
          </div>
        </div>

        {/* Mass Link Limit */}
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
                  "text-[1.4em] font-semibold",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                Mass Link Limit
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
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
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              onBlur={(e) => {
                const value = Math.min(
                  100,
                  Math.max(1, Number(e.target.value) || 20),
                );
                setMassLinkLimit(value);
              }}
              className={clsx(
                "w-24 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                isDark ? "bg-card border-gray-700" : "bg-white border-gray-200",
              )}
            />
          </div>
        </div>

        {/* Guest Link Limit */}
        <div
          className={clsx(
            "p-4 rounded-2xl",
            isDark ? "bg-subcard" : "bg-blues",
          )}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h3
                className={clsx(
                  "text-[1.4em] font-semibold",
                  isDark ? "text-white" : "text-shortblack",
                )}
              >
                Guest Link Limit
              </h3>
              <p
                className={clsx(
                  "text-[1.2em]",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
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
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    50,
                    Math.max(0, Number(e.target.value) || 3),
                  );
                  setGuestLinkLimit(value);
                }}
                className={clsx(
                  "w-16 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-200",
                )}
              />
              <span
                className={clsx(
                  "text-[1.3em] font-medium",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                link per
              </span>
              <input
                type="number"
                min="1"
                max="30"
                value={guestLinkLimitDays}
                onChange={(e) =>
                  setGuestLinkLimitDays(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                onBlur={(e) => {
                  const value = Math.min(
                    30,
                    Math.max(1, Number(e.target.value) || 1),
                  );
                  setGuestLinkLimitDays(value);
                }}
                className={clsx(
                  "w-16 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                  isDark
                    ? "bg-card border-gray-700"
                    : "bg-white border-gray-200",
                )}
              />
              <span
                className={clsx(
                  "text-[1.3em] font-medium",
                  isDark ? "text-gray-400" : "text-grays",
                )}
              >
                hari
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Iklan Settings Section */}
      <div
        className={clsx(
          "border-t pt-6 mt-6",
          isDark ? "border-gray-700" : "border-gray-200",
        )}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className={clsx(
              "p-2.5 rounded-xl",
              isDark ? "bg-pink-500/20" : "bg-pink-100",
            )}
          >
            <MousePointerClick
              className={clsx(
                "w-5 h-5",
                isDark ? "text-pink-400" : "text-pink-600",
              )}
            />
          </div>
          <div>
            <h3
              className={clsx(
                "text-[1.5em] font-bold",
                isDark ? "text-white" : "text-shortblack",
              )}
            >
              Pengaturan Modal Iklan
            </h3>
            <p
              className={clsx(
                "text-[1.1em]",
                isDark ? "text-gray-400" : "text-grays",
              )}
            >
              Modal muncul di step terakhir (ads level 2, 3, 4)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Modal Wait Seconds */}
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
                    "text-[1.4em] font-semibold",
                    isDark ? "text-white" : "text-shortblack",
                  )}
                >
                  Countdown Modal
                </h3>
                <p
                  className={clsx(
                    "text-[1.2em]",
                    isDark ? "text-gray-400" : "text-grays",
                  )}
                >
                  Waktu tunggu di modal sebelum bisa continue (10-300)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={modalWaitSeconds}
                  onChange={(e) =>
                    setModalWaitSeconds(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  onBlur={(e) => {
                    const value = Math.min(
                      300,
                      Math.max(10, Number(e.target.value) || 60),
                    );
                    setModalWaitSeconds(value);
                  }}
                  className={clsx(
                    "w-20 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                />
                <span
                  className={clsx(
                    "text-[1.4em] font-medium",
                    isDark ? "text-gray-400" : "text-grays",
                  )}
                >
                  detik
                </span>
              </div>
            </div>
          </div>

          {/* Modal Ad Clicks Required */}
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
                    "text-[1.4em] font-semibold",
                    isDark ? "text-white" : "text-shortblack",
                  )}
                >
                  Jumlah Klik Iklan
                </h3>
                <p
                  className={clsx(
                    "text-[1.2em]",
                    isDark ? "text-gray-400" : "text-grays",
                  )}
                >
                  Klik iklan yang dibutuhkan untuk skip countdown (1-20)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={modalAdClicksRequired}
                  onChange={(e) =>
                    setModalAdClicksRequired(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  onBlur={(e) => {
                    const value = Math.min(
                      20,
                      Math.max(1, Number(e.target.value) || 5),
                    );
                    setModalAdClicksRequired(value);
                  }}
                  className={clsx(
                    "w-20 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                />
                <span
                  className={clsx(
                    "text-[1.4em] font-medium",
                    isDark ? "text-gray-400" : "text-grays",
                  )}
                >
                  kali
                </span>
              </div>
            </div>
          </div>

          {/* Modal Time Reduction Per Click */}
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
                    "text-[1.4em] font-semibold",
                    isDark ? "text-white" : "text-shortblack",
                  )}
                >
                  Reduksi Waktu per Klik
                </h3>
                <p
                  className={clsx(
                    "text-[1.2em]",
                    isDark ? "text-gray-400" : "text-grays",
                  )}
                >
                  Detik dikurangi dari countdown per klik iklan (1-60)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={modalTimeReductionPerClick}
                  onChange={(e) =>
                    setModalTimeReductionPerClick(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  onBlur={(e) => {
                    const value = Math.min(
                      60,
                      Math.max(1, Number(e.target.value) || 10),
                    );
                    setModalTimeReductionPerClick(value);
                  }}
                  className={clsx(
                    "w-20 text-[1.6em] font-bold text-center text-bluelight border-2 rounded-xl py-2 focus:outline-none focus:border-bluelight",
                    isDark
                      ? "bg-card border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                />
                <span
                  className={clsx(
                    "text-[1.4em] font-medium",
                    isDark ? "text-gray-400" : "text-grays",
                  )}
                >
                  detik
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
