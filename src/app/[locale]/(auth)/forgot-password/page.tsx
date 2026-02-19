"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";
import { Loader2, ArrowLeft, Mail, CheckCircle2, KeyRound } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isFocused, setIsFocused] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await authService.forgotPassword(email);
      setStatus("success");
      showAlert("Link reset password telah dikirim ke email Anda!", "success");
    } catch (error: any) {
      setStatus("error");
      const msg = error.response?.data?.message || "Gagal mengirim link reset.";
      showAlert(msg, "error");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden font-poppins">
      {/* Background decorations — matching landing page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/60 to-transparent" />
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Back link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Login
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 sm:p-10">
          {status === "success" ? (
            /* ── Success State ── */
            <div className="text-center space-y-5">
              <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
                  Email Terkirim!
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed font-figtree">
                  Kami telah mengirim link reset password ke{" "}
                  <span className="font-medium text-slate-700">{email}</span>.
                  Cek kotak masuk atau folder spam Anda.
                </p>
              </div>
              <div className="pt-2 space-y-3">
                <button
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                  }}
                  className="w-full py-3 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Kirim Ulang
                </button>
                <Link
                  href="/login"
                  className="block w-full py-3 rounded-xl text-sm font-semibold text-white bg-bluelanding hover:bg-bluelanding/90 text-center transition-all shadow-lg shadow-blue-500/20"
                >
                  Kembali ke Login
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form State ── */
            <div className="space-y-7">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <KeyRound className="w-7 h-7 text-bluelanding" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
                  Lupa Password?
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed font-figtree max-w-xs mx-auto">
                  Masukkan email Anda dan kami akan mengirimkan link untuk
                  mereset password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                      isFocused
                        ? "border-bluelanding ring-2 ring-bluelanding/15 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Mail
                      className={`absolute left-3.5 w-4.5 h-4.5 transition-colors duration-200 ${
                        isFocused ? "text-bluelanding" : "text-slate-400"
                      }`}
                    />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="nama@email.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 font-figtree"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="relative w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-bluelanding hover:bg-bluelanding/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.99] flex items-center justify-center gap-2 overflow-hidden"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-slate-400 mt-6 font-figtree">
          Butuh bantuan?{" "}
          <Link
            href="/contact"
            className="text-bluelanding hover:underline font-medium"
          >
            Hubungi Support
          </Link>
        </p>
      </div>
    </div>
  );
}
