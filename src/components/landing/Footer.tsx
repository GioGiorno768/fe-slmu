"use client";

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";

export default function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      setDashboardPath(authService.getRedirectPath());
    }
  }, []);

  const platform = [
    { name: "Payout Rates", href: "/payout-rates" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const company = [
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Report Abuse", href: "/report-abuse" },
  ];

  return (
    <footer className="bg-white py-14 font-poppins border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10 mb-10">
          {/* Logo & Description */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-bluelight flex items-center justify-center text-white">
                <Link2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-semibold text-slate-800">
                Shortlinkmu
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Turn complex links into clear, monetized short URLs so you can
              earn more with every click.
            </p>
            <Link
              href={isAuthenticated ? dashboardPath : "/register"}
              className="inline-flex items-center justify-center bg-bluelight hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>

          {/* Links */}
          <div className="flex gap-16 md:gap-20">
            {/* Platform */}
            <div>
              <h4 className="text-slate-800 font-medium text-sm mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {platform.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-slate-800 font-medium text-sm mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                {company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-slate-500 text-sm">
            © 2025 Shortlinkmu. All rights reserved.
          </p>
          <div className="flex justify-end gap-3">
            <Link
              href="/terms-of-service"
              className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
            >
              Youtube
            </Link>
            <Link
              href="/privacy-policy"
              className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
            >
              Telegram
            </Link>
            <Link
              href="/report-abuse"
              className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
