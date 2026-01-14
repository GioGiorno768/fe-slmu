// Register Form Component
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Gift, UserPlus } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService, { hasEverRegistered } from "@/services/authService";
import ErrorAlert from "./ErrorAlert";
import Modal from "@/components/common/Modal";
import GoogleAuthButton from "./GoogleAuthButton";
import { useFingerprint } from "@/hooks/useFingerprint";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get referral code from URL (?ref=CODE)
  const referralCode = searchParams.get("ref") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
  });

  // 🛡️ Device Fingerprinting
  const { visitorId } = useFingerprint();

  // 🎁 Referrer name state
  const [referrerName, setReferrerName] = useState<string>("");

  // 🔄 Loading state for eligibility check
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(
    !!referralCode
  );

  // Reset loading state when referralCode becomes empty (after redirect)
  useEffect(() => {
    if (!referralCode) {
      setIsCheckingEligibility(false);
    }
  }, [referralCode]);

  // 🛡️ Anti-Fraud: Check eligibility via API when referral code exists
  useEffect(() => {
    const checkEligibility = async () => {
      if (!referralCode) return;

      // Wait for fingerprint to be ready
      if (!visitorId) {
        // Fallback: cek localStorage kalau fingerprint belum ready
        if (hasEverRegistered()) {
          router.replace("/register");
        }
        return;
      }

      try {
        // 1. Check anti-fraud eligibility
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/referral/check-eligibility`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              visitor_id: visitorId,
              referral_code: referralCode,
            }),
          }
        );

        const data = await response.json();

        if (data.status === "success" && data.data) {
          if (!data.data.eligible) {
            // Not eligible - redirect to normal register
            router.replace("/register");
          } else {
            // Eligible - set referrer name for banner
            setReferrerName(data.data.referrer_name || "");
          }
        }

        // 2. Check if referrer has reached their max referrals limit
        const referrerInfoRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/referral/info?code=${referralCode}`
        );
        const referrerInfo = await referrerInfoRes.json();

        if (
          referrerInfo.status === "success" &&
          referrerInfo.data?.isLimitReached
        ) {
          // Referrer reached limit - redirect to normal register
          router.replace("/register");
          return;
        }

        // Use referrer name from this endpoint if available
        if (referrerInfo.data?.name) {
          setReferrerName(referrerInfo.data.name);
        }

        // Done checking - show form
        setIsCheckingEligibility(false);
      } catch (error) {
        console.error("Failed to check eligibility:", error);
        // Fallback: cek localStorage
        if (hasEverRegistered()) {
          router.replace("/register");
        }
        setIsCheckingEligibility(false);
      }
    };

    checkEligibility();
  }, [referralCode, visitorId, router]);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        referral_code: referralCode || undefined, // 🎁 Pass referral code from URL
        visitor_id: visitorId || undefined, // 🛡️ Anti-Fraud
      });

      // [DEV MODE] Redirect to dashboard (email auto-verified)
      // TODO: Change to "/verification-pending" for production
      const redirectPath = authService.getRedirectPath();
      router.push(redirectPath);
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response?.status === 422) {
        const errors = err.response?.data?.errors;

        if (errors?.email) {
          const emailError = Array.isArray(errors.email)
            ? errors.email[0]
            : errors.email;
          setError(emailError);

          setModalConfig({
            title: "Email Sudah Terdaftar",
            message:
              "Email ini sudah digunakan oleh akun lain. Silakan gunakan email berbeda atau login dengan akun yang sudah ada.",
          });
          setShowModal(true);
        } else {
          const firstError = Object.values(errors)[0];
          const errorMessage = Array.isArray(firstError)
            ? firstError[0]
            : firstError;
          setError(errorMessage as string);
        }
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Terjadi kesalahan saat registrasi. Silakan coba lagi.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    try {
      setLoading(true);
      setError("");
      // 🎁 Pass referralCode for new users registering via Google
      await authService.googleLogin(
        accessToken,
        visitorId || undefined,
        referralCode || undefined
      );

      // Redirect based on user role
      const redirectPath = authService.getRedirectPath();
      router.push(redirectPath);
    } catch (err: any) {
      console.error("Google login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Terjadi kesalahan saat login dengan Google.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Show loading spinner while checking eligibility
  if (isCheckingEligibility) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-lg">Memverifikasi undangan...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Buat Akun Baru</h1>
          <p className="text-lg text-gray-600">
            Gratis selamanya. Ayo bergabung!
          </p>
        </div>

        {/* Referral Banner */}
        {referralCode && (
          <div className="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-purple-900">
                🎉{" "}
                {referrerName
                  ? `Diundang oleh ${referrerName}!`
                  : "Kamu diundang!"}
              </p>
              <p className="text-sm text-purple-700">
                Daftar sekarang dan nikmati bonus spesial.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        <ErrorAlert error={error} onClose={() => setError("")} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 ">
          <div className="grid custom:grid-cols-2 grid-cols-1 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Lengkap
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  placeholder="Nama lengkap Anda"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  placeholder="email@anda.com"
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
                  placeholder="Min. 8 karakter"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Konfirmasi Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  placeholder="Ulangi password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/30"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Atau</span>
          </div>
        </div>

        {/* Google OAuth */}
        <div>
          <GoogleAuthButton
            onSuccess={handleGoogleSuccess}
            onError={(error) => setError(error)}
            text="Daftar dengan Google"
          />
        </div>

        {/* Login link */}
        <p className="text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-bold text-purple-600 hover:text-purple-700 hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>

      {/* Modal Popup */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type="error"
      />
    </>
  );
}
