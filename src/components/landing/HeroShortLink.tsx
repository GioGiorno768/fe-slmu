"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  ClipboardCopy,
  Check,
  Share2,
  Loader2,
  OctagonAlert,
  Edit3,
  ArrowRight,
  X,
  UserPlus,
  TriangleAlert,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import * as linkService from "@/services/linkService";
import { Link } from "@/i18n/routing";
import Toast from "@/components/common/Toast";
import { AnimatePresence, motion } from "motion/react";

export default function HeroShortLink() {
  const { showAlert } = useAlert();
  const [urlInput, setUrlInput] = useState("");
  const [aliasInput, setAliasInput] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const [validationErrors, setValidationErrors] = useState<{
    alias?: string;
  }>({});

  const validateAlias = (value: string) => {
    // Allows alphanumeric, hyphens, and underscores. No emojis or spaces.
    const regex = /^[a-zA-Z0-9-_]+$/;
    if (value && !regex.test(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        alias: "Alias hanya boleh berisi huruf, angka, strip, dan underscore.",
      }));
    } else if (value && value.length > 20) {
      setValidationErrors((prev) => ({
        ...prev,
        alias: "Alias maksimal 20 karakter.",
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, alias: undefined }));
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning",
  ) => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!urlInput) {
      showToast("Link tidak boleh kosong!", "error");
      return;
    }

    if (validationErrors.alias) {
      showToast(validationErrors.alias, "error");
      return;
    }

    setIsLoading(true);
    setError("");
    setShortLink("");
    setIsCopied(false);
    setShowErrorModal(false);

    try {
      const data = await linkService.createGuestLink(
        urlInput,
        aliasInput || undefined,
      );
      // Use the full short URL returned by backend (e.g. sho.rt/code or localhost:8000/code)
      setShortLink(data.shortUrl);
      setUrlInput("");
      setAliasInput("");
    } catch (err: any) {
      // Extract error message from various possible structures
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Show modal for rate limit or disabled errors
      const lowerError = errorMessage.toLowerCase();
      setError(errorMessage);

      // Show specific alias error if available
      if (err.errors?.alias) {
        showToast(err.errors.alias[0], "error");
      } else {
        // Only show generic error toast if it's NOT a modal-triggering error
        const lowerError = errorMessage.toLowerCase();
        const isModalError =
          lowerError.includes("limit") ||
          lowerError.includes("disabled") ||
          lowerError.includes("register");

        if (!isModalError) {
          showToast(errorMessage, "error");
        }

        if (isModalError) {
          setShowErrorModal(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortLink) return;
    const protocol = window.location.protocol;
    // navigator.clipboard.writeText(`${protocol}//${shortLink}`);
    // setIsCopied(true);
    navigator.clipboard.writeText(`${shortLink}`);
    setIsCopied(true);
    showToast("Link telah disalin ke clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!shortLink) return;
    const protocol = window.location.protocol;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shortlinkmu Link",
          text: `Lihat link saya: ${shortLink}`,
          url: `${protocol}//${shortLink}`,
        });
      } catch (err) {
        console.error("Gagal share:", err);
      }
    } else {
      handleCopy();
      showAlert(
        "Browser Anda tidak mendukung fitur share. Link telah disalin.",
        "info",
        "Info",
      );
    }
  };

  return (
    <div className="w-full">
      {/* Input Form */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-3"
        >
          {/* URL Input */}
          <div className="flex-[2] relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-bluelight transition-colors">
              <LinkIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-bluelight text-[1rem] placeholder-slate-400 text-slate-900 transition-all shadow-sm hover:border-slate-300"
              placeholder="Tempel link panjang Anda di sini..."
              disabled={isLoading}
            />
          </div>

          {/* Alias Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-bluelight transition-colors">
              <Edit3 className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={aliasInput}
              onChange={(e) => {
                setAliasInput(e.target.value);
                validateAlias(e.target.value);
              }}
              className={`block w-full pl-12 pr-4 py-4 bg-white border rounded-xl focus:ring-4 focus:ring-blue-100 text-[1rem] placeholder-slate-400 text-slate-900 transition-all shadow-sm ${
                validationErrors.alias
                  ? "border-red-300 focus:border-red-500 hover:border-red-400"
                  : "border-slate-200 focus:border-bluelight hover:border-slate-300"
              }`}
              placeholder="Alias (Opsional)"
              disabled={isLoading}
            />
            {/* Validation Message Tooltip */}
            <AnimatePresence>
              {validationErrors.alias && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-3 left-0 z-20 flex items-center gap-2 px-4 py-2.5 bg-white border border-red-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                >
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <TriangleAlert className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-xs font-semibold text-red-600 whitespace-nowrap">
                    {validationErrors.alias}
                  </span>
                  {/* Tooltip Arrow */}
                  <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-red-100 transform rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="md:w-auto bg-bluelight hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-bluelight/30 hover:shadow-bluelight/40 transition-all flex items-center justify-center gap-2 whitespace-nowrap group disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Shorten</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error/Result */}
      <div className="mt-4 min-h-[4rem]">
        {/* Inline error for simple validation */}
        {error && !showErrorModal && (
          <div className="text-red-500 flex items-center gap-2 text-sm animate-in fade-in-0 slide-in-from-top-2">
            <OctagonAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {shortLink && (
          <div className="bg-white/90 backdrop-blur-xl px-6 py-4 rounded-xl shadow-lg border border-slate-100 flex justify-between items-center animate-in fade-in-0 slide-in-from-top-3 duration-300">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="p-2 bg-green-50 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                  Your Shortlink
                </span>
                <a
                  href={shortLink}
                  target="_blank"
                  rel="noopener"
                  className="text-slate-900 font-semibold hover:text-bluelight truncate transition-colors"
                >
                  {shortLink}
                </a>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title={isCopied ? "Disalin!" : "Salin link"}
              >
                {isCopied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <ClipboardCopy className="w-5 h-5 text-bluelight" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Bagikan link"
              >
                <Share2 className="w-5 h-5 text-bluelight" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Modal Popup */}
      {showErrorModal && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowErrorModal(false)}
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "modalSlideIn 0.3s ease-out",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <OctagonAlert className="w-8 h-8 text-red-500" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
              Limit Tercapai
            </h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {error}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col gap-3">
              <Link
                href="/register"
                className="w-full py-3 px-6 bg-bluelight text-white font-semibold text-center rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-bluelight/30"
              >
                <UserPlus className="w-5 h-5" />
                Daftar Sekarang - Gratis!
              </Link>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3 px-6 text-gray-500 font-medium text-center hover:text-gray-700 transition-colors"
              >
                Tutup
              </button>
            </div>

            {/* Benefits hint */}
            <p className="text-sm text-gray-400 text-center mt-4">
              Daftar untuk akses unlimited link + fitur premium lainnya
            </p>
          </div>
        </div>
      )}

      {/* Modal Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
