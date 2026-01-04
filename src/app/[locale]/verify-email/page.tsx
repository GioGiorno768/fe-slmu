"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import apiClient from "@/services/apiClient";

type VerifyStatus = "loading" | "success" | "error" | "already_verified";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState("");

  const verifyEmail = useCallback(async () => {
    const id = searchParams.get("id");
    const hash = searchParams.get("hash");
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    if (!id || !hash || !expires || !signature) {
      setStatus("error");
      setMessage("Link verifikasi tidak valid. Silakan minta link baru.");
      return;
    }

    try {
      const response = await apiClient.post("/email/verify", {
        id,
        hash,
        expires,
        signature,
      });

      if (response.data.already_verified) {
        setStatus("already_verified");
        setMessage("Email sudah terverifikasi sebelumnya.");
      } else {
        setStatus("success");
        setMessage(response.data.message || "Email berhasil diverifikasi!");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Gagal memverifikasi email. Link mungkin sudah kadaluarsa."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Memverifikasi Email...
            </h1>
            <p className="text-gray-500">Mohon tunggu sebentar</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Email Terverifikasi! 🎉
            </h1>
            <p className="text-gray-500 mb-8">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              Lanjut ke Login
            </Link>
          </>
        )}

        {/* Already Verified State */}
        {status === "already_verified" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Email Sudah Terverifikasi
            </h1>
            <p className="text-gray-500 mb-8">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              Lanjut ke Login
            </Link>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verifikasi Gagal
            </h1>
            <p className="text-gray-500 mb-8">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setStatus("loading");
                  verifyEmail();
                }}
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
              >
                Kembali ke Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
