"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";

interface AuthCTAProps {
  title: string;
  subtitle: string;
}

export default function AuthCTA({ title, subtitle }: AuthCTAProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      setDashboardPath(authService.getRedirectPath());
    }
  }, []);

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-bluelanding to-blue-600 rounded-3xl p-10 md:p-14 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              {title}
            </h2>
            <p className="text-blue-100 text-base md:text-lg font-light mb-8 max-w-xl mx-auto font-figtree">
              {subtitle}
            </p>
            <Link
              href={isAuthenticated ? (dashboardPath as any) : "/register"}
              className="inline-flex items-center gap-2 bg-white text-bluelanding font-semibold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 group"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
