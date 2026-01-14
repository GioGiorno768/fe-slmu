"use client";

import { useEffect, useState } from "react";
import { Construction, Clock, Mail } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  const [estimatedTime, setEstimatedTime] = useState("Beberapa jam");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenanceInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/maintenance`
        );
        if (response.ok) {
          const data = await response.json();
          setEstimatedTime(data.data.estimated_time || "Beberapa jam");
        }
      } catch (error) {
        console.error("Failed to fetch maintenance info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Construction className="w-16 h-16 text-white" />
            </div>
            {/* Animated gear */}
            <div
              className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
              style={{ animation: "spin 8s linear infinite" }}
            >
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Sedang Maintenance
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
          Website kami sedang dalam perbaikan untuk memberikan pengalaman yang
          lebih baik. Kami akan segera kembali!
        </p>

        {/* Estimated time */}
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 mb-8">
          <Clock className="w-5 h-5 text-amber-400" />
          <span className="text-slate-200 font-medium">
            {isLoading ? (
              <span className="animate-pulse">Memuat...</span>
            ) : (
              `Estimasi: ${estimatedTime}`
            )}
          </span>
        </div>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent mx-auto mb-8" />

        {/* Contact info */}
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Ada pertanyaan? Hubungi kami:
          </p>
          <a
            href="mailto:support@shortlinkmu.com"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            <Mail className="w-4 h-4" />
            support@shortlinkmu.com
          </a>
        </div>

        {/* Logo / Brand */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-blue-500" />
            <span className="text-slate-400 group-hover:text-white transition-colors font-semibold text-lg">
              Shortlinkmu
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
