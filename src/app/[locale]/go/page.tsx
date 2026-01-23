"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import * as linkService from "@/services/linkService";
import { useAlert } from "@/hooks/useAlert";

interface SessionData {
  code: string;
  token: string;
  step: number;
  max_steps: number;
  ad_level: number;
  is_guest: boolean;
}

export default function GuestGoPage() {
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();

  const sessionId = searchParams.get("s");

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "redirecting" | "error"
  >("loading");
  const [timeLeft, setTimeLeft] = useState(2);

  // Fetch session data on mount
  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/links/session/${sessionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          return;
        }

        setSessionData(data.data);
      } catch (err) {
        console.error("Error fetching session:", err);
        setStatus("error");
      }
    };

    fetchSession();
  }, [sessionId]);

  // 2-second countdown for "security check"
  useEffect(() => {
    if (status !== "loading" || !sessionData) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    // After 2 seconds, show the Continue button
    if (timeLeft === 0) {
      setStatus("ready");
    }
  }, [timeLeft, status, sessionData]);

  const handleContinue = async () => {
    if (!sessionData) {
      setStatus("error");
      return;
    }

    setStatus("redirecting");

    try {
      const originalUrl = await linkService.validateContinueToken(
        sessionData.code,
        sessionData.token
      );
      window.open(originalUrl, "_blank");
      setStatus("ready");
    } catch (error: any) {
      console.error(error);
      showAlert("Gagal mengalihkan. Link mungkin kadaluarsa.", "error");
      setStatus("error");
    }
  };

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Link Error</h1>
          <p className="mt-2 text-gray-600">
            Terjadi kesalahan saat memproses link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfc] px-4 text-[#404040]">
      <div className="w-full max-w-md rounded-lg border border-[#e5e5e5] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <div className="mb-6 flex items-center gap-4">
          {status === "loading" ? (
            <div className="relative h-12 w-12 flex-shrink-0">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>
          ) : status === "redirecting" ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
          )}

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {status === "loading"
                ? "Checking your connection..."
                : status === "redirecting"
                ? "Redirecting..."
                : "Secure Connection Verified"}
            </h1>
            <p className="text-sm text-gray-500">Shortlinkmu Security System</p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-md bg-gray-50 p-4 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Ray ID:</span>
            <span className="font-mono">
              {sessionId?.substring(0, 8) || "..."}-{sessionData?.code || "..."}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <span
              className={
                status === "loading" ? "text-amber-600" : "text-green-600"
              }
            >
              {status === "loading" ? "Verifying..." : "Verified"}
            </span>
          </div>
        </div>

        {status === "loading" && (
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
              style={{ width: `${((2 - timeLeft) / 2) * 100}%` }}
            ></div>
          </div>
        )}

        {status === "ready" && (
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Continue to Destination
            <ArrowRight className="h-5 w-5" />
          </button>
        )}

        {status === "redirecting" && (
          <div className="text-center text-sm text-gray-500">
            Redirecting to destination...
          </div>
        )}

        {status === "loading" && (
          <p className="text-center text-xs text-gray-400">
            Please wait while we verify your browser...
          </p>
        )}
      </div>
    </div>
  );
}
