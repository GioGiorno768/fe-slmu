// src/components/dashboard/super-admin/settings/SecuritySettingsSection.tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle,
  KeyRound,
} from "lucide-react";
import clsx from "clsx";
import { useAlert } from "@/hooks/useAlert";
import { updatePassword } from "@/services/authService";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecuritySettingsSection() {
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PasswordForm>>({});

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { level: 1, label: "Weak", color: "bg-red-500" },
      { level: 2, label: "Fair", color: "bg-orange-500" },
      { level: 3, label: "Good", color: "bg-yellow-500" },
      { level: 4, label: "Strong", color: "bg-green-500" },
    ];

    return levels[strength - 1] || { level: 0, label: "", color: "" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordForm> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await updatePassword({
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });

      showAlert("Password changed successfully!", "success");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error: any) {
      // Handle Laravel validation errors
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.current_password?.[0] ||
        error.response?.data?.errors?.password?.[0] ||
        error.message ||
        "Failed to change password";
      showAlert(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof PasswordForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bluelight to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-purple-900/30">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-[2em] font-bold text-shortblack">Security</h2>
          <p className="text-[1.3em] text-grays">
            Manage your account security settings
          </p>
        </div>
      </div>

      {/* Change Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-subcard rounded-2xl p-6 border border-slate-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm border border-slate-200 dark:border-gray-700">
            <KeyRound className="w-5 h-5 text-bluelight" />
          </div>
          <div>
            <h3 className="text-[1.6em] font-semibold text-shortblack">
              Change Password
            </h3>
            <p className="text-[1.2em] text-grays">
              Update your password regularly to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-[1.3em] font-medium text-shortblack mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
                className={clsx(
                  "w-full text-[1.4em] pl-12 pr-12 py-3 rounded-xl border bg-card text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight transition-all",
                  errors.currentPassword
                    ? "border-red-300 focus:ring-red-300"
                    : "border-slate-200 dark:border-gray-700"
                )}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-grays hover:text-shortblack transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1.5 text-[1.2em] text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[1.3em] font-medium text-shortblack mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={clsx(
                  "w-full text-[1.4em] pl-12 pr-12 py-3 rounded-xl border bg-card text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight transition-all",
                  errors.newPassword
                    ? "border-red-300 focus:ring-red-300"
                    : "border-slate-200 dark:border-gray-700"
                )}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-grays hover:text-shortblack transition-colors"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-[1.2em] text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.newPassword}
              </p>
            )}

            {/* Password Strength */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all duration-300",
                        passwordStrength.color
                      )}
                      style={{ width: `${passwordStrength.level * 25}%` }}
                    />
                  </div>
                  <span
                    className={clsx(
                      "text-[1.1em] font-medium",
                      passwordStrength.level <= 2
                        ? "text-red-500"
                        : "text-green-600"
                    )}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <p className="text-[1.1em] text-grays">
                  Use 8+ characters with uppercase, lowercase, numbers & symbols
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[1.3em] font-medium text-shortblack mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grays" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={clsx(
                  "w-full text-[1.4em] pl-12 pr-12 py-3 rounded-xl border bg-card text-shortblack focus:outline-none focus:ring-2 focus:ring-bluelight transition-all",
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-300"
                    : formData.confirmPassword &&
                      formData.newPassword === formData.confirmPassword
                    ? "border-green-300 focus:ring-green-300"
                    : "border-slate-200 dark:border-gray-700"
                )}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-grays hover:text-shortblack transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {formData.confirmPassword &&
                formData.newPassword === formData.confirmPassword && (
                  <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-[1.2em] text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-bluelight to-indigo-600 text-white text-[1.4em] font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-purple-900/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Security Tips */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-[1.4em] font-semibold text-amber-800 dark:text-amber-300 mb-1">
              Security Tips
            </h4>
            <ul className="text-[1.2em] text-amber-700 dark:text-amber-400 space-y-1">
              <li>• Never share your password with anyone</li>
              <li>• Use a unique password for this account</li>
              <li>• Change your password every 3-6 months</li>
              <li>• Enable two-factor authentication when available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
