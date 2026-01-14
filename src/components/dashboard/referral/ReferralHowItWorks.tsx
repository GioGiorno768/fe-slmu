"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserPlus, Gift, Wallet, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface ReferralHowItWorksProps {
  commissionRate: number;
}

export default function ReferralHowItWorks({
  commissionRate,
}: ReferralHowItWorksProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const steps = [
    {
      icon: UserPlus,
      title: "Undang Teman",
      desc: "Bagikan link referral unik Anda ke teman, grup WhatsApp, atau sosial media.",
      gradient: "from-blue-500 to-indigo-600",
      shadowLight: "shadow-blue-200",
      shadowDark: "shadow-blue-900/40",
      number: "01",
    },
    {
      icon: Gift,
      title: "Mereka Mendaftar",
      desc: "Teman Anda mendaftar menggunakan link tersebut dan mulai memendekkan link.",
      gradient: "from-purple-500 to-pink-600",
      shadowLight: "shadow-purple-200",
      shadowDark: "shadow-purple-900/40",
      number: "02",
    },
    {
      icon: Wallet,
      title: "Anda Dapat Komisi",
      desc: `Otomatis dapat ${commissionRate}% dari setiap penghasilan yang mereka dapatkan!`,
      gradient: "from-emerald-500 to-teal-600",
      shadowLight: "shadow-emerald-200",
      shadowDark: "shadow-emerald-900/40",
      number: "03",
    },
  ];

  return (
    <div className="py-10 font-figtree">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full mb-4"
        >
          <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span className="text-[1.2em] font-semibold text-indigo-600 dark:text-indigo-400">
            Passive Income
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="text-[2.4em] font-bold text-shortblack dark:text-white"
        >
          Cara Kerja Referral
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-[1.4em] text-grays mt-2"
        >
          Dapatkan penghasilan tambahan hanya dengan mengundang teman
        </motion.p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connection line (desktop only) */}
        <div
          className={clsx(
            "hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 -translate-y-1/2 z-0",
            isDark
              ? "bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-emerald-500/30"
              : "bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200"
          )}
        />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
            className="relative z-10 group"
          >
            <div
              className={clsx(
                "bg-card p-8 rounded-3xl text-center shadow-sm border border-gray-100 dark:border-gray-dashboard/30 hover:-translate-y-2 transition-all duration-200 h-full",
                isDark ? "hover:shadow-lg" : "hover:shadow-xl"
              )}
            >
              {/* Step number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className={clsx(
                    "inline-block px-4 py-1 rounded-full text-[1.1em] font-bold text-white bg-gradient-to-r shadow-lg",
                    step.gradient,
                    isDark ? step.shadowDark : step.shadowLight
                  )}
                >
                  Step {step.number}
                </span>
              </div>

              {/* Icon */}
              <div
                className={clsx(
                  "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 mt-4 shadow-lg bg-gradient-to-br",
                  "group-hover:scale-105 transition-transform duration-200",
                  step.gradient,
                  isDark ? step.shadowDark : step.shadowLight
                )}
              >
                <step.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-[1.8em] font-bold text-shortblack dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-[1.3em] text-grays leading-relaxed">
                {step.desc}
              </p>

              {/* Arrow indicator (mobile only) */}
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-6">
                  <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600 rotate-90" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="text-center mt-10"
      >
        <p className="text-[1.3em] text-grays">
          💡 Semakin banyak teman yang aktif, semakin besar penghasilan Anda!
        </p>
      </motion.div>
    </div>
  );
}
