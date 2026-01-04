"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import Link from "next/link";
import apiClient from "@/services/apiClient";
import authService from "@/services/authService";

export default function VerificationPendingPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in and get their email
    const checkStatus = async () => {
      try {
        const response = await apiClient.get("/email/status");
        setEmail(response.data.email || "");

        // If already verified, redirect to dashboard
        if (response.data.verified) {
          const redirectPath = authService.getRedirectPath();
          router.push(redirectPath);
        }
      } catch (error) {
        // Not authenticated, redirect to login
        router.push("/login");
      }
    };

    checkStatus();
  }, [router]);

  const handleResendEmail = async () => {
    setResending(true);
    setError("");
    setResendSuccess(false);

    try {
      await apiClient.post("/email/resend");
      setResendSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Gagal mengirim ulang email verifikasi."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
          <Mail className="w-12 h-12 text-purple-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verifikasi Email Anda
        </h1>
        <p className="text-gray-500 mb-6">
          Kami telah mengirim email verifikasi ke:
        </p>
        <p className="text-lg font-semibold text-purple-600 mb-8">{email}</p>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
          <p className="text-sm text-gray-600 mb-2">
            📬 Silakan cek inbox email Anda dan klik link verifikasi.
          </p>
          <p className="text-sm text-gray-500">
            Tidak menerima email? Cek folder spam atau klik tombol di bawah.
          </p>
        </div>

        {/* Success Message */}
        {resendSuccess && (
          <div className="flex items-center gap-2 justify-center mb-4 p-3 bg-green-50 text-green-700 rounded-xl">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Email terkirim ulang!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {resending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Kirim Ulang Email
              </>
            )}
          </button>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-400 mt-6">
          Link verifikasi akan kadaluarsa dalam 60 menit.
        </p>
      </div>
    </div>
  );
}
