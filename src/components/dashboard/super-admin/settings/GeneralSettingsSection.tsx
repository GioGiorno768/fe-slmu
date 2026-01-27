"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Settings,
  Shield,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Power,
  UserX,
  LogOut,
  Clock,
  Ban,
  Bell,
  Play,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import clsx from "clsx";
import { useAlert } from "@/hooks/useAlert";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import CurrencyRatesSettings from "./CurrencyRatesSettings";

// Reusable Toggle Switch Component
const ToggleSwitch = ({
  enabled,
  onToggle,
  disabled = false,
  activeColor = "bg-bluelight",
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  activeColor?: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={clsx(
      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-bluelight focus-visible:ring-offset-2",
      enabled ? activeColor : "bg-gray-300",
      disabled && "opacity-50 cursor-not-allowed",
    )}
  >
    <span
      className={clsx(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
        enabled ? "translate-x-6" : "translate-x-1",
      )}
    />
  </button>
);

// Default settings for fallback
const defaultSettings = {
  maintenance_mode: false,
  maintenance_estimated_time: "2-3 jam",
  maintenance_whitelist_ips: "",
  disable_registration: false,
  invite_only_mode: false,
  disable_login: false,
  cleanup_expired_links_days: 30,
  cleanup_blocked_links_days: 7,
  cleanup_old_notifications_days: 30,
  backdoor_access_code: "admin123",
};

import generalSettingsService, {
  GeneralSettings,
} from "@/services/generalSettingsService";
import { useEffect } from "react";

export default function GeneralSettingsSection() {
  const { showAlert } = useAlert();
  const [settings, setSettings] = useState<GeneralSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] =
    useState<GeneralSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isForceLogoutLoading, setIsForceLogoutLoading] = useState(false);
  const [isCleanupLoading, setIsCleanupLoading] = useState(false);
  const [showBackdoorCode, setShowBackdoorCode] = useState(false);

  // Modal states
  const [showForceLogoutModal, setShowForceLogoutModal] = useState(false);
  const [showCleanupModal, setShowCleanupModal] = useState(false);

  // Check if settings have changed
  const isDirty = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await generalSettingsService.getSettings();
        // Ensure no null values - use empty string for string fields
        const sanitizedData = {
          ...defaultSettings,
          ...data,
          maintenance_whitelist_ips: data.maintenance_whitelist_ips ?? "",
          maintenance_estimated_time:
            data.maintenance_estimated_time ?? "2-3 jam",
        };
        setSettings(sanitizedData);
        setOriginalSettings(sanitizedData);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        showAlert("Failed to load settings", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof GeneralSettings) => {
    setSettings((prev) => {
      const newValue = !prev[key];

      // If disabling login, auto-enable disable registration too
      if (key === "disable_login" && newValue === true) {
        return {
          ...prev,
          [key]: newValue,
          disable_registration: true, // Auto-enable
        };
      }

      return {
        ...prev,
        [key]: newValue,
      };
    });
  };

  const handleInputChange = (
    key: keyof GeneralSettings,
    value: string | number,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await generalSettingsService.updateSettings(settings);
      // Sanitize the result to avoid null values
      const sanitizedSettings = {
        ...defaultSettings,
        ...result.settings,
        maintenance_whitelist_ips:
          result.settings.maintenance_whitelist_ips ?? "",
        maintenance_estimated_time:
          result.settings.maintenance_estimated_time ?? "2-3 jam",
      };
      setSettings(sanitizedSettings);
      setOriginalSettings(sanitizedSettings); // Reset dirty state
      if (result.users_logged_out) {
        showAlert(
          `Settings saved! ${result.users_logged_out} users logged out due to maintenance mode.`,
          "success",
        );
      } else {
        showAlert("Settings saved successfully!", "success");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      showAlert("Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleForceLogout = async () => {
    setIsForceLogoutLoading(true);
    try {
      const result = await generalSettingsService.forceLogout();
      showAlert(
        `${result.users_logged_out} users have been logged out!`,
        "success",
      );
      setShowForceLogoutModal(false);
    } catch (error) {
      console.error("Failed to force logout:", error);
      showAlert("Failed to force logout", "error");
    } finally {
      setIsForceLogoutLoading(false);
    }
  };

  const handleCleanupNow = async () => {
    setIsCleanupLoading(true);
    try {
      const result = await generalSettingsService.runCleanup();
      const total =
        result.expired_links + result.blocked_links + result.old_notifications;
      showAlert(
        `Cleanup completed! ${total} items deleted (${result.expired_links} expired links, ${result.blocked_links} blocked links, ${result.old_notifications} old notifications).`,
        "success",
      );
      setShowCleanupModal(false);
    } catch (error) {
      console.error("Cleanup failed:", error);
      showAlert("Cleanup failed", "error");
    } finally {
      setIsCleanupLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-[10px]">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[2.4em] font-bold text-shortblack flex items-center gap-3">
            <Settings className="w-7 h-7 text-bluelight" />
            General Settings
          </h2>
          <p className="text-[1.4em] text-grays mt-1">
            Configure maintenance mode, access control, and data cleanup
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="px-6 py-3 bg-bluelight text-white rounded-xl text-[1.4em] font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      {/* === CURRENCY EXCHANGE RATES === */}
      <CurrencyRatesSettings />

      {/* === MAINTENANCE MODE === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-8 shadow-sm shadow-shd-card/50"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-[1.8em] font-bold text-shortblack">
                🚧 Maintenance Mode
              </h3>
              <p className="text-[1.3em] text-grays">
                Aktifkan untuk menutup akses website sementara
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={settings.maintenance_mode}
            onToggle={() => handleToggle("maintenance_mode")}
            activeColor="bg-orange-500"
          />
        </div>

        {settings.maintenance_mode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pt-4 border-t border-grays/30"
          >
            <div>
              <label className="block text-[1.3em] font-semibold text-shortblack mb-2">
                Estimasi Waktu Maintenance
              </label>
              <input
                type="text"
                value={settings.maintenance_estimated_time}
                onChange={(e) =>
                  handleInputChange(
                    "maintenance_estimated_time",
                    e.target.value,
                  )
                }
                className="w-full px-4 py-3 shadow-sm shadow-shd-card/50 rounded-xl text-[1.3em] bg-card text-shortblack focus:ring-2 focus:ring-bluelight focus:border-transparent"
                placeholder="Contoh: 2-3 jam, 24 jam, Sampai besok pagi"
              />
            </div>
            <div>
              <label className="block text-[1.3em] font-semibold text-shortblack mb-2">
                Whitelist IP (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={settings.maintenance_whitelist_ips}
                onChange={(e) =>
                  handleInputChange("maintenance_whitelist_ips", e.target.value)
                }
                className="w-full px-4 py-3 shadow-sm shadow-shd-card/50 rounded-xl text-[1.3em] bg-card text-shortblack focus:ring-2 focus:ring-bluelight focus:border-transparent"
                placeholder="192.168.1.1, 10.0.0.1"
              />
              <p className="text-[1.1em] text-grays mt-1">
                IP yang tetap bisa akses saat maintenance
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* === ACCESS CONTROL === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-8 shadow-sm shadow-shd-card/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-2xl">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-[1.8em] font-bold text-shortblack">
              🔐 Kontrol Akses
            </h3>
            <p className="text-[1.3em] text-grays">
              Kelola registrasi dan login user
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Disable Registration */}
          <div className="flex items-center justify-between p-5 bg-subcard rounded-2xl">
            <div className="flex items-center gap-4">
              <UserX className="w-6 h-6 text-grays" />
              <div>
                <p className="text-[1.4em] font-semibold text-shortblack">
                  Disable Registration
                </p>
                <p className="text-[1.2em] text-grays">
                  {settings.disable_login
                    ? "Auto-enabled karena Disable Login aktif"
                    : "Tutup pendaftaran user baru"}
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.disable_registration}
              onToggle={() => handleToggle("disable_registration")}
              disabled={settings.disable_login} // Locked when login is disabled
              activeColor="bg-red-500"
            />
          </div>

          {/* Invite Only Mode */}
          <div className="flex items-center justify-between p-5 bg-subcard rounded-2xl">
            <div className="flex items-center gap-4">
              <Power className="w-6 h-6 text-grays" />
              <div>
                <p className="text-[1.4em] font-semibold text-shortblack">
                  Invite-Only Mode
                </p>
                <p className="text-[1.2em] text-grays">
                  Register hanya dengan referral code
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.invite_only_mode}
              onToggle={() => handleToggle("invite_only_mode")}
              disabled={settings.disable_registration}
              activeColor="bg-purple-500"
            />
          </div>

          {/* Disable Login */}
          <div className="flex items-center justify-between p-5 bg-subcard rounded-2xl">
            <div className="flex items-center gap-4">
              <Ban className="w-6 h-6 text-grays" />
              <div>
                <p className="text-[1.4em] font-semibold text-shortblack">
                  Disable Login
                </p>
                <p className="text-[1.2em] text-grays">
                  Blokir semua login (emergency only)
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.disable_login}
              onToggle={() => handleToggle("disable_login")}
              activeColor="bg-red-600"
            />
          </div>

          {/* Backdoor Access Code */}
          <div className="p-5 bg-purple-50 dark:bg-purple-500/10 rounded-2xl border border-purple-100 dark:border-purple-500/30">
            <div className="flex items-center gap-4 mb-4">
              <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-[1.4em] font-semibold text-shortblack">
                  Backdoor Access Code
                </p>
                <p className="text-[1.2em] text-grays">
                  Kode untuk akses admin login via /backdoor
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type={showBackdoorCode ? "text" : "password"}
                value={settings.backdoor_access_code}
                onChange={(e) =>
                  handleInputChange("backdoor_access_code", e.target.value)
                }
                className="w-full px-4 py-3 pr-12 border border-purple-200 dark:border-purple-500/30 rounded-xl text-[1.3em] focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-card text-shortblack"
                placeholder="Masukkan kode akses"
                minLength={4}
                maxLength={50}
              />
              <button
                type="button"
                onClick={() => setShowBackdoorCode(!showBackdoorCode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showBackdoorCode ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-[1.1em] text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Simpan kode ini dengan aman. Minimal 4 karakter.
            </p>
          </div>

          {/* Force Logout All Users */}
          <div className="pt-4 border-t border-grays/30">
            <button
              onClick={() => setShowForceLogoutModal(true)}
              disabled={isForceLogoutLoading}
              className="w-full py-4 px-6 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 rounded-2xl text-[1.4em] font-semibold transition-colors flex items-center justify-center gap-3"
            >
              {isForceLogoutLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              Force Logout All Users
            </button>
            <p className="text-[1.1em] text-grays text-center mt-2">
              Logout paksa semua user yang sedang aktif
            </p>
          </div>
        </div>
      </motion.div>

      {/* === DATA CLEANUP === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-8 shadow-sm shadow-shd-card/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-2xl">
            <Trash2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-[1.8em] font-bold text-shortblack">
              🧹 Pembersihan Data Otomatis
            </h3>
            <p className="text-[1.3em] text-grays">
              Atur jadwal hapus data lama secara otomatis
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cleanup Expired Links */}
          <div className="p-5 bg-subcard rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-grays" />
                <div>
                  <p className="text-[1.4em] font-semibold text-shortblack">
                    Hapus Link Expired
                  </p>
                  <p className="text-[1.2em] text-grays">
                    Link yang sudah melewati tanggal kedaluwarsa
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.cleanup_expired_links_days}
                  onChange={(e) =>
                    handleInputChange(
                      "cleanup_expired_links_days",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  min={0}
                  max={365}
                  className="w-20 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-[1.3em] text-center bg-card text-shortblack focus:ring-2 focus:ring-bluelight focus:border-transparent"
                />
                <span className="text-[1.3em] text-grays">hari</span>
              </div>
            </div>
            <p className="text-[1.1em] text-grays ml-10">
              Set 0 untuk menonaktifkan
            </p>
          </div>

          {/* Cleanup Blocked Links */}
          <div className="p-5 bg-subcard rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Ban className="w-6 h-6 text-grays" />
                <div>
                  <p className="text-[1.4em] font-semibold text-shortblack">
                    Hapus Link Blocked
                  </p>
                  <p className="text-[1.2em] text-grays">
                    Link yang sudah diblokir admin/sistem
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.cleanup_blocked_links_days}
                  onChange={(e) =>
                    handleInputChange(
                      "cleanup_blocked_links_days",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  min={0}
                  max={365}
                  className="w-20 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-[1.3em] text-center bg-card text-shortblack focus:ring-2 focus:ring-bluelight focus:border-transparent"
                />
                <span className="text-[1.3em] text-grays">hari</span>
              </div>
            </div>
            <p className="text-[1.1em] text-grays ml-10">
              Set 0 untuk menonaktifkan
            </p>
          </div>

          {/* Cleanup Old Notifications */}
          <div className="p-5 bg-subcard rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Bell className="w-6 h-6 text-grays" />
                <div>
                  <p className="text-[1.4em] font-semibold text-shortblack">
                    Hapus Notifikasi Lama
                  </p>
                  <p className="text-[1.2em] text-grays">
                    Notifikasi yang sudah dibaca lebih dari X hari
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.cleanup_old_notifications_days}
                  onChange={(e) =>
                    handleInputChange(
                      "cleanup_old_notifications_days",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  min={0}
                  max={365}
                  className="w-20 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-[1.3em] text-center bg-card text-shortblack focus:ring-2 focus:ring-bluelight focus:border-transparent"
                />
                <span className="text-[1.3em] text-grays">hari</span>
              </div>
            </div>
            <p className="text-[1.1em] text-grays ml-10">
              Set 0 untuk menonaktifkan
            </p>
          </div>

          {/* Cleanup Now Button */}
          <div className="pt-4 border-t border-grays">
            <button
              onClick={() => setShowCleanupModal(true)}
              disabled={isCleanupLoading}
              className="w-full py-4 px-6 bg-blue-100 dark:bg-blue-500/10 hover:bg-blue-200 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-2xl text-[1.4em] font-semibold transition-colors flex items-center justify-center gap-3"
            >
              {isCleanupLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              Run Cleanup Now
            </button>
            <p className="text-[1.1em] text-grays text-center mt-2">
              Jalankan pembersihan data sekarang berdasarkan pengaturan di atas
            </p>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showForceLogoutModal}
        onClose={() => setShowForceLogoutModal(false)}
        onConfirm={handleForceLogout}
        title="Force Logout All Users"
        description="Apakah Anda yakin ingin logout semua user? Ini akan menghapus semua session aktif dan user harus login ulang."
        confirmLabel="Logout Semua"
        cancelLabel="Batal"
        type="warning"
        isLoading={isForceLogoutLoading}
      />

      <ConfirmationModal
        isOpen={showCleanupModal}
        onClose={() => setShowCleanupModal(false)}
        onConfirm={handleCleanupNow}
        title="Run Data Cleanup"
        description="Jalankan cleanup sekarang? Ini akan menghapus data (link expired, link blocked, notifikasi lama) sesuai dengan pengaturan di atas."
        confirmLabel="Jalankan Cleanup"
        cancelLabel="Batal"
        type="danger"
        isLoading={isCleanupLoading}
      />
    </div>
  );
}
