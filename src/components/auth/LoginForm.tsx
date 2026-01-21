// Login Form Component
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";
import ErrorAlert from "./ErrorAlert";
import GoogleAuthButton from "./GoogleAuthButton";
import Toast from "@/components/common/Toast";
import { useFingerprint } from "@/hooks/useFingerprint";

export default function LoginForm() {
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
  const [warningMessage, setWarningMessage] = useState("");

  // 🛡️ Device Fingerprinting
  const { visitorId } = useFingerprint();

  // Check for suspended/expired query params
  useEffect(() => {
    const suspended = searchParams.get("suspended");
    const expired = searchParams.get("expired");

    if (suspended === "true") {
      setWarningMessage(
        "Akun admin Anda telah di-suspend. Silakan hubungi Super Admin.",
      );
    } else if (expired === "true") {
      setWarningMessage(
        "Sesi Anda telah berakhir atau akun tidak ditemukan. Silakan login kembali.",
      );
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
      await authService.login({
        email: formData.email,
        password: formData.password,
        visitor_id: visitorId || undefined, // 🛡️ Anti-Fraud Fingerprint
      });

      // Show success toast
      setToastMessage("Login berhasil! Mengalihkan...");
      setShowToast(true);

      // Redirect after short delay for toast visibility
      setTimeout(() => {
        const redirectPath = authService.getRedirectPath();
        router.push(redirectPath);
      }, 800);
    } catch (err: any) {
      console.error("Login error:", err);
      console.log("Error response status:", err.response?.status);
      console.log("Error response data:", err.response?.data);

      // Handle different error types
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422) {
        // Laravel validation error
        const errors = data?.errors;
        if (errors?.email) {
          // Login failed - wrong credentials
          errorMessage = "Email atau password salah. Silakan coba lagi.";
        } else {
          // Other validation errors
          const firstError = Object.values(errors || {})[0];
          errorMessage = Array.isArray(firstError)
            ? firstError[0]
            : (firstError as string) || "Email atau password salah.";
        }
      } else if (status === 403) {
        // Account banned - show reason from backend
        const banReason = data?.ban_reason || "Pelanggaran Terms of Service";
        errorMessage = `Akun Anda telah di-suspend. Alasan: ${banReason}`;
      } else if (status === 401) {
        // Unauthorized - wrong credentials
        errorMessage = "Email atau password salah.";
      } else {
        // Other errors (500, network, etc)
        errorMessage =
          data?.message ||
          data?.error ||
          "Terjadi kesalahan saat login. Silakan coba lagi.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    try {
      setLoading(true);
      setError("");
      await authService.googleLogin(accessToken, visitorId || undefined); // 🛡️ Pass fingerprint

      // Show success toast
      setToastMessage("Login dengan Google berhasil!");
      setShowToast(true);

      // Redirect after short delay
      setTimeout(() => {
        const redirectPath = authService.getRedirectPath();
        router.push(redirectPath);
      }, 800);
    } catch (err: any) {
      console.error("Google login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login dengan Google gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Welcome Back!
        </h1>
        <p className="text-gray-500">Silakan login untuk melanjutkan</p>
      </div>

      {/* Warning Banner for Suspended/Expired */}
      {warningMessage && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{warningMessage}</p>
        </div>
      )}

      {/* Error Alert */}
      <ErrorAlert error={error} onClose={() => setError("")} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          {/* <label className="block text-sm font-medium text-gray-700">
            Email
          </label> */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              placeholder="email@anda.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          {/* <label className="block text-sm font-medium text-gray-700">
            Password
          </label> */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
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

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/25"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">atau</span>
        </div>
      </div>

      {/* Google OAuth */}
      <GoogleAuthButton
        onSuccess={handleGoogleSuccess}
        onError={(error) => setError(error)}
        text="Masuk dengan Google"
      />

      {/* Register link */}
      <p className="text-center text-gray-500 text-sm">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Daftar sekarang
        </Link>
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
