// src/components/dashboard/settings/SecuritySection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Shield, Smartphone, Loader2, KeyRound } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import type { SecuritySettings } from "@/types/type";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useSecurityLogic } from "@/hooks/useSettings";
import { useTranslations } from "next-intl";

interface SecuritySectionProps {
  initialData: SecuritySettings | null;
}

export default function SecuritySection({ initialData }: SecuritySectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const { showAlert } = useAlert();
  const { updatePass, toggle2FAStatus, isUpdating } = useSecurityLogic();
  const t = useTranslations("Dashboard");

  const [is2FAEnabled, setIs2FAEnabled] = useState(
    initialData?.twoFactorEnabled || false,
  );

  const isSocialLogin = initialData?.isSocialLogin || false;

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSocialLogin && !passwords.current) {
      showAlert(t("settingsPage.currentPasswordRequired"), "warning");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showAlert(t("settingsPage.passwordMismatch"), "error");
      return;
    }
    if (passwords.new.length < 8) {
      showAlert(t("settingsPage.passwordMinLength"), "warning");
      return;
    }

    const success = await updatePass(
      passwords.current,
      passwords.new,
      passwords.confirm,
    );

    if (success) {
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  const toggle2FA = async () => {
    const newState = !is2FAEnabled;
    await toggle2FAStatus(newState);
    setIs2FAEnabled(newState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Change Password Card */}
      <div
        className={clsx(
          "rounded-3xl p-8 shadow-sm",
          isDark
            ? "bg-card border border-gray-800"
            : "bg-white border border-gray-100",
        )}
      >
        <h2 className="text-[2em] font-bold text-shortblack mb-2 flex items-center gap-3">
          <Lock className="w-6 h-6 text-bluelight" />
          {isSocialLogin
            ? t("settingsPage.setPassword")
            : t("settingsPage.changePassword")}
        </h2>
        <p className="text-[1.4em] text-grays mb-8">
          {isSocialLogin
            ? t("settingsPage.socialLoginDesc")
            : t("settingsPage.passwordDesc")}
        </p>

        <form onSubmit={handleSavePassword} className="space-y-6 max-w-2xl">
          {!isSocialLogin && (
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                {t("settingsPage.currentPassword")}
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-grays absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePassChange}
                  className={clsx(
                    "w-full pl-12 pr-4 py-3 rounded-xl text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]",
                    isDark
                      ? "bg-card border border-gray-700"
                      : "bg-white border border-gray-200",
                  )}
                  placeholder="••••••••"
                  required={!isSocialLogin}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                {isSocialLogin
                  ? t("settingsPage.newPassword")
                  : t("settingsPage.newPassword")}
              </label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePassChange}
                className={clsx(
                  "w-full px-4 py-3 rounded-xl text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]",
                  isDark
                    ? "bg-card border border-gray-700"
                    : "bg-white border border-gray-200",
                )}
                placeholder={t("settingsPage.minChars")}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[1.4em] font-medium text-shortblack">
                {t("settingsPage.confirmPassword")}
              </label>
              <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePassChange}
                className={clsx(
                  "w-full px-4 py-3 rounded-xl text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight/50 text-[1.5em]",
                  isDark
                    ? "bg-card border border-gray-700"
                    : "bg-white border border-gray-200",
                )}
                placeholder={t("settingsPage.retypePassword")}
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className={clsx(
                "bg-bluelight text-white px-8 py-3 rounded-xl font-semibold text-[1.5em] hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg",
                isDark ? "shadow-purple-900/30" : "shadow-blue-200",
              )}
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSocialLogin
                ? t("settingsPage.createPassword")
                : t("settingsPage.updatePassword")}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
