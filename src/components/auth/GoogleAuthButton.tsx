// Google Auth Button - Manual GSI Implementation
"use client";

import { useEffect, useState } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface GoogleAuthButtonProps {
  onSuccess: (accessToken: string) => void;
  onError: (error: string) => void;
  text?: string;
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = "Masuk dengan Google",
}: GoogleAuthButtonProps) {
  const [gsiClient, setGsiClient] = useState<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Google GSI script
  useEffect(() => {
    // Check if script already loaded
    if (window.google) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Google GSI script.");
      onError("Gagal memuat Google Sign-In. Refresh halaman.");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  // Initialize Google Auth Client
  useEffect(() => {
    if (isScriptLoaded && window.google && window.google.accounts) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          callback: (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              onSuccess(tokenResponse.access_token);
            } else {
              onError("Token response tidak valid.");
            }
          },
          error_callback: (error: any) => {
            // Ignore user-cancelled actions (popup closed, user cancelled, etc)
            const errorType = error?.type?.toLowerCase() || "";
            const errorMessage = error?.message?.toLowerCase() || "";

            const isUserCancelled =
              errorType === "popup_closed" ||
              errorType === "user_cancel" ||
              errorMessage.includes("popup") ||
              errorMessage.includes("closed") ||
              errorMessage.includes("cancel");

            if (isUserCancelled) {
              console.log("Google Auth cancelled by user");
              return; // Don't show error for intentional cancellations
            }

            console.error("Google Auth Error:", error);
            onError(error?.message || "Login dengan Google gagal.");
          },
        });
        setGsiClient(client);
      } catch (error) {
        console.error("Failed to initialize GSI client:", error);
        onError("Gagal inisialisasi Google Sign-In.");
      }
    }
  }, [isScriptLoaded, onSuccess, onError]);

  const handleLoginClick = () => {
    if (gsiClient) {
      gsiClient.requestAccessToken();
    } else {
      onError("Layanan Google belum siap. Coba lagi.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLoginClick}
      disabled={!gsiClient}
      className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
    >
      {/* Google Icon SVG */}
      <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          fill="#fbc02d"
        />
        <path
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          fill="#e53935"
        />
        <path
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          fill="#4caf50"
        />
        <path
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.987,36.69,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          fill="#1565c0"
        />
      </svg>
      {text}
    </button>
  );
}
