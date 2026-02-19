"use client";

import { useState } from "react";
import { Key, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import apiClient from "@/services/apiClient";
import ErrorAlert from "./ErrorAlert";

interface BackdoorCodeFormProps {
  onVerified: () => void;
}

export default function BackdoorCodeForm({
  onVerified,
}: BackdoorCodeFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length < 4) {
      setError("Kode akses minimal 4 karakter.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post("/verify-backdoor-code", { code });

      if (response.data.success) {
        onVerified();
      }
    } catch (err: any) {
      console.error("Code verification error:", err);

      if (err.response?.status === 403) {
        setError("Kode akses salah. Silakan coba lagi.");
      } else if (err.response?.status === 422) {
        setError("Kode akses tidak valid.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-fit">
      {/* Title with Security Badge */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          <Key className="w-4 h-4" />
          <span>Restricted Access</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Verifikasi Akses</h1>
        <p className="text-lg text-gray-600">
          Masukkan kode akses untuk melanjutkan ke halaman login administrator
        </p>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Halaman ini dilindungi dengan kode akses. Hanya administrator yang
            memiliki kode yang dapat melanjutkan.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      <ErrorAlert error={error} onClose={() => setError("")} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Access Code Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Kode Akses
          </label>
          <div className="relative group">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              className="w-full text-black pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-lg tracking-widest"
              placeholder="••••••••"
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <p className="text-sm text-gray-500">
            Hubungi Super Admin jika Anda tidak memiliki kode akses.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || code.length < 4}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memverifikasi...
            </>
          ) : (
            <>
              Verifikasi & Lanjutkan
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Footer Note */}
      <p className="text-center text-sm text-gray-500">
        Jika Anda bukan administrator, silakan kembali ke{" "}
        <a href="/" className="text-purple-600 hover:underline font-medium">
          halaman utama
        </a>
      </p>
    </div>
  );
}
