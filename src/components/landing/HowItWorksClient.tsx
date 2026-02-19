"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";
import { ReactNode } from "react";

interface StepData {
  number: string;
  title: string;
  desc: string;
  color: string;
  bgIcon: ReactNode;
  content: ReactNode;
}

export function HowItWorksAuthLink({
  createAccountLabel,
  goToDashboardLabel,
}: {
  createAccountLabel: string;
  goToDashboardLabel: string;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      setDashboardPath(authService.getRedirectPath());
    }
  }, []);

  return (
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
        {isAuthenticated ? goToDashboardLabel : createAccountLabel}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

export function HowItWorksStepCard({
  step,
  delay,
}: {
  step: StepData;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
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
  );
}
