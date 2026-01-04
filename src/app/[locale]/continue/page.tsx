"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import * as linkService from "@/services/linkService";
import { useAlert } from "@/hooks/useAlert";
import { useFingerprint } from "@/hooks/useFingerprint";

interface SessionData {
  code: string;
  token: string;
  step: number;
  max_steps: number;
  ad_level: number;
  is_guest: boolean;
}

export default function ContinuePage() {
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { showAlert } = useAlert();

  // 🛡️ Device Fingerprinting for Self-Click Detection
  const { visitorId } = useFingerprint();

  const sessionId = searchParams.get("s");

  // Don't auto-load, wait for user to click
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [password, setPassword] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [error, setError] = useState("");

  // Fetch session and validate on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!sessionId) {
        setError("Session ID tidak ditemukan.");
        setIsValid(false);
        setIsCheckingStatus(false);
        return;
      }

      try {
        // 1. Fetch session data
        const sessionResponse = await fetch(
          `http://localhost:8000/api/links/session/${sessionId}`
        );
        const sessionResult = await sessionResponse.json();

        if (!sessionResponse.ok) {
          setError("Session tidak ditemukan atau sudah kadaluarsa.");
          setIsValid(false);
          setIsCheckingStatus(false);
          return;
        }

        const data: SessionData = sessionResult.data;
        setSessionData(data);

        // 2. Check if all steps are completed
        const statusResponse = await fetch(
          `http://localhost:8000/api/links/${data.code}/check-step-status`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: data.token }),
          }
        );

        const statusResult = await statusResponse.json();

        if (!statusResponse.ok || !statusResult.data?.all_complete) {
          console.warn("🛡️ Direct continue access blocked:", statusResult);
          setError(
            "Anda harus menyelesaikan semua langkah artikel terlebih dahulu."
          );
          setIsValid(false);
          setIsCheckingStatus(false);
          return;
        }

        // All steps completed - allow access
        setIsCheckingStatus(false);
      } catch (err) {
        console.error("Validation error:", err);
        setError("Gagal memverifikasi status link.");
        setIsValid(false);
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [sessionId]);

  const handleContinue = async () => {
    if (!sessionData) return;

    setIsLoading(true);
    setError("");

    try {
      // Pass password if state is set
      const originalUrl = await linkService.validateContinueToken(
        sessionData.code,
        sessionData.token,
        password || undefined,
        visitorId || undefined // 🛡️ Pass fingerprint for self-click detection
      );

      // Success! Redirect to destination (open in new tab)
      window.open(originalUrl, "_blank");
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message;
      const redirectUrl = err.response?.data?.redirect_url;

      if (status === 410 && redirectUrl) {
        // Link expired - redirect to expired page
        window.location.href = redirectUrl;
        return;
      } else if (status === 401) {
        // Password required - Expected behavior, no console error needed
        setIsPasswordRequired(true);
        // Don't show alert for initial check
        if (password) {
          setError("Incorrect password");
        }
      } else if (status === 403) {
        // Token not activated yet OR banned
        if (msg.includes("Token belum diaktivasi")) {
          // Redirect back to article or show blocking error
          // For now show error
        }
        setError(msg);
        console.error("Link verification failed (403):", err);
      } else {
        console.error("Link verification failed:", err);
        setError(msg || "Gagal memproses link");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#2b6cb0]" />
          <p className="text-gray-500 dark:text-gray-400">
            Verifying link security...
          </p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Link Invalid</h1>
          <p className="mt-2 text-gray-600">Parameter tidak lengkap.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            {isPasswordRequired ? (
              <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
                <Lock className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
          {isPasswordRequired ? "Password Protected" : "Link Secured"}
        </h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
          {isPasswordRequired
            ? "Link ini dilindungi password. Silakan masukkan password untuk melanjutkan."
            : "Tautan Anda telah diamankan dan siap untuk dikunjungi."}
        </p>

        {isPasswordRequired && (
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b6cb0] px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#2c5282] hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {isPasswordRequired ? "Validating..." : "Memproses..."}
            </>
          ) : (
            <>
              {isPasswordRequired ? "Unlock Link" : "Lanjutkan ke Link"}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-gray-400">
          Protected by Shortlinkmu Security
        </p>
      </div>
    </div>
  );
}
