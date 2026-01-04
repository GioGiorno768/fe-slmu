"use client"; // Kita butuh state, jadi harus "use client"

import { useState } from "react";
import {
  Link as LinkIcon,
  ClipboardCopy,
  Check,
  Share2,
  Loader2,
  OctagonAlert,
  X,
  UserPlus,
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import * as linkService from "@/services/linkService";
import { Link } from "@/i18n/routing";

export default function ShortLink() {
  const { showAlert } = useAlert();
  const [urlInput, setUrlInput] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fungsi buat generate link
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!urlInput) {
      setError("Link tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    setError("");
    setShortLink("");
    setIsCopied(false);
    setShowErrorModal(false);

    try {
      const data = await linkService.createGuestLink(urlInput);
      const host = window.location.host;
      const fullShortUrl = `${host}/${data.code}`;
      setShortLink(fullShortUrl);
      setUrlInput("");
    } catch (err: any) {
      // Extract error message from various possible structures
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.response?.data?.message) {
        // Axios error with backend message
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        // Standard Error object
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Show modal for rate limit or disabled errors (case-insensitive)
      const lowerError = errorMessage.toLowerCase();
      if (
        lowerError.includes("limit") ||
        lowerError.includes("disabled") ||
        lowerError.includes("register")
      ) {
        setShowErrorModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi buat copy link
  const handleCopy = () => {
    if (!shortLink) return;
    const protocol = window.location.protocol;
    navigator.clipboard.writeText(`${protocol}//${shortLink}`);
    setIsCopied(true);
    showAlert("Link telah disalin ke clipboard!", "success", "Copied!");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Fungsi buat share
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
        "Info"
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-[2em] w-full relative">
        <input
          type="text"
          id="hero-input"
          name="hero-input"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="py-[1em] sm:py-[1em] px-[2.5em] block w-full shadow-sm shadow-slate-500/40 text-[1.6em] focus:outline-bluelight disabled:opacity-50 disabled:pointer-events-none rounded-full bg-white"
          placeholder="Tempel link panjang Anda di sini..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="text-[1.6em] bg-bluelight text-white px-[3em] rounded-full cursor-pointer flex-shrink-0 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Generate"
          )}
        </button>
      </form>

      <div className="font-figtree h-[10em]">
        {/* Inline error for simple validation errors */}
        {error && !showErrorModal && (
          <div className="text-redshortlink ms-[3em] w-fit text-[1.4em] text-start mt-[1em] flex gap-[1em]">
            <OctagonAlert className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success card */}
        {shortLink && (
          <div className="shadow-sm mt-[2em] px-[3.5em] py-[2em] shadow-slate-500/40 rounded-3xl flex justify-between items-center bg-white animate-in fade-in-0 slide-in-from-top-5 duration-500">
            <div className="w-fit flex gap-[3em] items-center overflow-hidden">
              <LinkIcon className="w-5 h-5 text-bluelight flex-shrink-0" />
              <div className="gap-[.5em] flex flex-col">
                <span className="text-[1.4em]">Your Link</span>
                <a
                  href={`http://${shortLink}`}
                  target="_blank"
                  rel="noopener"
                  className="text-shortblack text-[1.6em] font-semibold hover:underline truncate"
                >
                  {shortLink}
                </a>
              </div>
            </div>
            <div className="flex gap-[3em] items-center">
              <button
                onClick={handleCopy}
                title={isCopied ? "Disalin!" : "Salin link"}
              >
                {isCopied ? (
                  <Check className="w-6 h-6 text-greenlight" />
                ) : (
                  <ClipboardCopy className="w-6 h-6 text-bluelight" />
                )}
              </button>
              <button onClick={handleShare} title="Bagikan link">
                <Share2 className="w-6 h-6 text-bluelight" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Modal Popup */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
                className="w-full py-3 px-6 bg-bluelight text-white font-semibold text-center rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
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
    </>
  );
}
