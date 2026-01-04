"use client";

import { useState, useEffect } from "react";
import {
  Percent,
  Gift,
  Shield,
  Save,
  Info,
  AlertTriangle,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import clsx from "clsx";
import apiClient from "@/services/apiClient";
import { useAlert } from "@/hooks/useAlert";

interface ReferralSettings {
  percentage: number;
  signup_bonus: number;
  max_accounts_per_ip: number;
  fingerprint_check_enabled: boolean;
  ip_limit_enabled: boolean;
}

const DEFAULT_SETTINGS: ReferralSettings = {
  percentage: 10,
  signup_bonus: 0,
  max_accounts_per_ip: 2,
  fingerprint_check_enabled: true,
  ip_limit_enabled: true,
};

export default function ReferralSettingsSection() {
  const { showAlert } = useAlert();
  const [settings, setSettings] = useState<ReferralSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient.get("/admin/settings/referral");
        if (response.data?.data) {
          setSettings({
            percentage: response.data.data.percentage ?? 10,
            signup_bonus: response.data.data.signup_bonus ?? 0,
            max_accounts_per_ip: response.data.data.max_accounts_per_ip ?? 2,
            fingerprint_check_enabled:
              response.data.data.fingerprint_check_enabled ?? true,
            ip_limit_enabled: response.data.data.ip_limit_enabled ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch referral settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = <K extends keyof ReferralSettings>(
    key: K,
    value: ReferralSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await apiClient.put("/admin/settings/referral", settings);
      setHasChanges(false);
      showAlert("Settings saved successfully!", "success");
    } catch (error) {
      console.error("Failed to save settings:", error);
      showAlert("Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-bluelight animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[2em] font-bold text-shortblack">
            Referral Settings
          </h2>
          <p className="text-[1.3em] text-grays mt-1">
            Konfigurasi sistem referral dan bonus signup
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[1.3em] font-semibold transition-all",
              hasChanges
                ? "bg-bluelight text-white hover:bg-blue-600 shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* 1. Commission Settings */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-[1.5em] font-bold text-shortblack">
                Commission Settings
              </h3>
              <p className="text-[1.1em] text-grays">
                Recurring - Referrer dapat komisi setiap withdrawal
              </p>
            </div>
          </div>

          {/* Commission Rate */}
          <div className="space-y-2 max-w-xs">
            <label className="text-[1.2em] font-semibold text-grays block">
              Commission Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.percentage}
                onChange={(e) =>
                  updateSetting("percentage", Number(e.target.value))
                }
                className="w-full px-4 py-3 pr-10 bg-white border border-gray-200 rounded-xl text-[1.3em] font-medium focus:outline-none focus:border-blue-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-grays">
                %
              </span>
            </div>
            <p className="text-[1.1em] text-gray-400">
              Contoh: User withdraw $100 → Referrer dapat $
              {((100 * settings.percentage) / 100).toFixed(0)}
            </p>
          </div>
        </div>

        {/* 2. Signup Bonus */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-[1.5em] font-bold text-shortblack">
                Signup Bonus
              </h3>
              <p className="text-[1.1em] text-grays">
                Bonus untuk user baru yang signup via referral
              </p>
            </div>
          </div>

          {/* Bonus Amount */}
          <div className="space-y-2 max-w-xs">
            <label className="text-[1.2em] font-semibold text-grays block">
              Bonus Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-grays">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.signup_bonus}
                onChange={(e) =>
                  updateSetting("signup_bonus", Number(e.target.value))
                }
                className="w-full px-4 py-3 pl-8 bg-white border border-gray-200 rounded-xl text-[1.3em] font-medium focus:outline-none focus:border-purple-400"
              />
            </div>
            <p className="text-[1.1em] text-gray-400">
              {settings.signup_bonus > 0
                ? "Bonus langsung masuk ke balance user"
                : "Set ke 0 untuk menonaktifkan signup bonus"}
            </p>
          </div>

          {/* Info Box */}
          {settings.signup_bonus > 0 && (
            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <Info className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <div className="text-[1.2em] text-purple-700">
                <p className="font-semibold mb-1">Cara kerja Signup Bonus:</p>
                <ol className="list-decimal list-inside space-y-1 text-purple-600">
                  <li>User signup via link referral</li>
                  <li>User lolos anti-fraud check</li>
                  <li>Bonus langsung masuk ke balance</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* 3. Anti-Fraud Settings */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-orange-100 rounded-xl">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-[1.5em] font-bold text-shortblack">
              Anti-Fraud Settings
            </h3>
          </div>

          {/* Protection Toggles */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Fingerprint Check Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="text-[1.3em] font-semibold text-shortblack">
                  Device Fingerprint Check
                </p>
                <p className="text-[1.1em] text-gray-400">
                  Blokir device yang sudah pernah register
                </p>
              </div>
              <button
                onClick={() =>
                  updateSetting(
                    "fingerprint_check_enabled",
                    !settings.fingerprint_check_enabled
                  )
                }
                className="p-1"
              >
                {settings.fingerprint_check_enabled ? (
                  <ToggleRight className="w-10 h-10 text-green-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-400" />
                )}
              </button>
            </div>

            {/* IP Limit Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="text-[1.3em] font-semibold text-shortblack">
                  IP Address Limit
                </p>
                <p className="text-[1.1em] text-gray-400">
                  Batasi jumlah akun per IP
                </p>
              </div>
              <button
                onClick={() =>
                  updateSetting("ip_limit_enabled", !settings.ip_limit_enabled)
                }
                className="p-1"
              >
                {settings.ip_limit_enabled ? (
                  <ToggleRight className="w-10 h-10 text-green-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Max Accounts per IP - Show only if IP limit is enabled */}
          {settings.ip_limit_enabled && (
            <div className="space-y-2 max-w-xs">
              <label className="text-[1.2em] font-semibold text-grays block">
                Max Accounts per IP
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.max_accounts_per_ip}
                onChange={(e) =>
                  updateSetting("max_accounts_per_ip", Number(e.target.value))
                }
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[1.3em] font-medium focus:outline-none focus:border-orange-400"
              />
              <p className="text-[1.1em] text-gray-400">
                Max akun yang bisa signup via referral dari IP yang sama
              </p>
            </div>
          )}

          {/* Warning Box */}
          {(!settings.fingerprint_check_enabled ||
            !settings.ip_limit_enabled) && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[1.2em] text-red-700">
                <b>⚠️ Warning:</b> Anti-fraud protection is disabled. Enable
                both checks before going live to prevent abuse.
              </p>
            </div>
          )}

          {settings.fingerprint_check_enabled && settings.ip_limit_enabled && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-[1.2em] text-green-700">
                <b>✓ Protected:</b> Anti-fraud aktif. User dengan device/IP
                duplikat akan di-redirect ke register biasa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
