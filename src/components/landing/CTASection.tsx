"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import authService from "@/services/authService";
import { useTranslations } from "next-intl";

export default function CTASection() {
  const t = useTranslations("Landing.CTA");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      setDashboardPath(authService.getRedirectPath());
    }
  }, []);

  return (
    <section className="py-16 md:py-20 bg-slate-50/50 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-3xl py-16 md:py-20 px-6 overflow-hidden shadow-xl shadow-slate-200/50"
        >
          {/* Background Decorations */}
          {/* Subtle gradient blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-linear-to-b from-blue-50/80 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>

          {/* Floating dots */}
          <div className="absolute top-8 left-1/4 w-2 h-2 rounded-full bg-bluelanding/20"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-purple-300/30"></div>
          <div className="absolute bottom-12 left-1/3 w-2.5 h-2.5 rounded-full bg-bluelanding/15"></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-blue-200/40"></div>
          <div className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 rounded-full bg-purple-200/30"></div>

          {/* Left Decorative Icon - Hidden on mobile for cleaner look */}
          <div className="hidden md:block absolute top-1/4 left-8 lg:left-12 -translate-y-1/2 w-28 lg:w-36 h-28 lg:h-36 rotate-12 animate-float-slow will-change-transform">
            <Image
              src="/CTA/Group 134.svg"
              alt=""
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>

          {/* Right Decorative Icon - Hidden on mobile for cleaner look */}
          <div className="hidden md:block absolute bottom-4 right-8 lg:right-12 w-28 lg:w-36 h-28 lg:h-36 -rotate-12 animate-float-slow-reverse will-change-transform">
            <Image
              src="/CTA/Group 135.svg"
              alt=""
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight mb-4 text-slate-800">
              {t("title1")}{" "}
              <span className="text-bluelanding">{t("title2")}</span>
              <br />
              {t("title3")}{" "}
              <span className="text-bluelanding">{t("title4")}</span>
            </h2>

            <p className="text-slate-500 text-base md:text-lg font-light mb-8">
              {t("subtitle")}
            </p>

            <Link
              href={isAuthenticated ? dashboardPath : "/register"}
              className="inline-flex items-center justify-center bg-bluelanding hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              {isAuthenticated ? t("goToDashboard") : t("startEarning")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
