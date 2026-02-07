"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("Landing.HowItWorks");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      setDashboardPath(authService.getRedirectPath());
    }
  }, []);

  const steps = [
    {
      number: "01",
      title: t("step1.title"),
      desc: t("step1.desc"),
      color: "from-bluelanding to-blue-600",
      bgIcon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
      content: (
        <div className="space-y-2.5">
          <div className="h-8 bg-white/10 rounded-lg flex items-center px-3 backdrop-blur-sm">
            <span className="text-xs text-white/70">john@mail.com</span>
          </div>
          <div className="h-8 bg-white/10 rounded-lg flex items-center px-3 backdrop-blur-sm">
            <span className="text-xs text-white/50">••••••••</span>
          </div>
          <div className="h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xs font-medium text-bluelanding">
              {t("step1.button")}
            </span>
          </div>
        </div>
      ),
    },
    {
      number: "02",
      title: t("step2.title"),
      desc: t("step2.desc"),
      color: "from-bluelanding to-purple-600",
      bgIcon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
        </svg>
      ),
      content: (
        <div className="space-y-2.5">
          <div className="h-8 bg-white/10 rounded-lg flex items-center px-3 backdrop-blur-sm">
            <span className="text-[10px] text-white/60 truncate">
              https://example.com/long...
            </span>
          </div>
          <div className="h-8 bg-white/20 border border-white/30 rounded-lg flex items-center justify-between px-3">
            <span className="text-xs font-medium text-white">
              slmu.my.id/x7k
            </span>
            <svg
              className="w-4 h-4 text-green-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-6 bg-white/10 rounded flex items-center justify-center">
              <span className="text-[9px] text-white/60">
                2.4K {t("step2.clicks")}
              </span>
            </div>
            <div className="flex-1 h-6 bg-white/10 rounded flex items-center justify-center">
              <span className="text-[9px] text-white/60">$12.50</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "03",
      title: t("step3.title"),
      desc: t("step3.desc"),
      color: "from-bluelanding to-fuchsia-600",
      bgIcon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
      content: (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-bluelanding rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">P</span>
              </div>
              <span className="text-[10px] text-white/80">PayPal</span>
            </div>
            <span className="text-[9px] text-green-300">✓</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">₿</span>
              </div>
              <span className="text-[10px] text-white/80">Crypto</span>
            </div>
            <span className="text-[9px] text-green-300">✓</span>
          </div>
          <div className="h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xs font-semibold text-bluelanding">
              {t("step3.withdraw")} $248.50
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight mb-2 text-slate-800"
            >
              {t("title")}{" "}
              <span className="text-bluelanding">{t("titleHighlight")}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-base md:text-lg font-light"
            >
              {t("subtitle")}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href={isAuthenticated ? dashboardPath : "/register"}
              className="inline-flex items-center gap-2 text-bluelanding hover:text-blue-600 font-medium text-sm transition-colors group"
            >
              {isAuthenticated ? t("goToDashboard") : t("createAccount")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group"
            >
              <div
                className={`relative h-full bg-gradient-to-br ${step.color} rounded-2xl p-5 overflow-hidden transition-transform hover:scale-[1.02] duration-300 ease-in-out shadow-lg hover:shadow-xl`}
              >
                {/* Background icon decoration */}
                <div className="absolute -bottom-4 -right-4 w-28 h-28 text-white/10 pointer-events-none">
                  {step.bgIcon}
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                {/* Number */}
                <div className="text-white/20 text-5xl font-bold mb-4">
                  {step.number}
                </div>

                {/* Content Card */}
                <div className="relative z-10 mb-5">{step.content}</div>

                {/* Title & Desc */}
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/70">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
