"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Shield } from "lucide-react";
import apiClient from "@/services/apiClient";
import {
  setToken,
  setUser,
  getRedirectPath,
  markAsRegistered,
} from "@/services/authService";
import ErrorAlert from "./ErrorAlert";
import Toast from "@/components/common/Toast";
import { useFingerprint } from "@/hooks/useFingerprint";

export default function BackdoorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 🛡️ Device Fingerprinting
  const { visitorId } = useFingerprint();

  // Check for suspended/expired query params
  useEffect(() => {
    const suspended = searchParams.get("suspended");
    const expired = searchParams.get("expired");

    if (suspended === "true") {
      setError(
        "Akun admin Anda telah di-suspend. Silakan hubungi Super Admin."
      );
    } else if (expired === "true") {
      setError("Sesi Anda telah berakhir. Silakan login kembali.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // Call admin-login endpoint (bypasses disable_login)
      const response = await apiClient.post("/admin-login", {
        email: formData.email,
        password: formData.password,
        visitor_id: visitorId || undefined,
      });

      const { token, user } = response.data;

      // Save token & user
      setToken(token);
      setUser(user);
      markAsRegistered();

      // Show success toast
      setToastMessage("Login berhasil! Mengalihkan...");
      setShowToast(true);

      // Redirect after short delay for toast visibility
      setTimeout(() => {
        const redirectPath = getRedirectPath();
        router.push(redirectPath);
      }, 800);
    } catch (err: any) {
      console.error("Admin login error:", err);

      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422) {
        const errors = data?.errors;
        if (errors?.email) {
          errorMessage = "Email atau password salah. Silakan coba lagi.";
        } else {
          const firstError = Object.values(errors || {})[0];
          errorMessage = Array.isArray(firstError)
            ? firstError[0]
            : (firstError as string) || "Email atau password salah.";
        }
      } else if (status === 403) {
        // Check if it's unauthorized role or banned
        if (data?.error === "unauthorized_role") {
          errorMessage = "Akses ditolak. Login ini khusus untuk administrator.";
        } else if (data?.ban_reason) {
          errorMessage = `Akun Anda telah di-suspend. Alasan: ${data.ban_reason}`;
        } else {
          errorMessage = data?.message || "Akses ditolak.";
        }
      } else if (status === 401) {
        errorMessage = "Email atau password salah.";
      } else {
        errorMessage =
          data?.message || data?.error || "Terjadi kesalahan saat login.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-fit">
      {/* Title with Admin Badge */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          <span>Admin Access Only</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Administrator Login
        </h1>
        <p className="text-lg text-gray-600">
          Portal khusus untuk admin dan super admin
        </p>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Halaman ini hanya untuk administrator. User biasa tidak dapat login
            di sini.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      <ErrorAlert error={error} onClose={() => setError("")} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Email Admin
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/30"
        >
          {loading ? "Loading..." : "Login sebagai Admin"}
        </button>
      </form>

      {/* Footer Note */}
      <p className="text-center text-sm text-gray-500">
        Jika Anda bukan administrator, silakan gunakan{" "}
        <a href="/" className="text-purple-600 hover:underline font-medium">
          halaman utama
        </a>
      </p>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
