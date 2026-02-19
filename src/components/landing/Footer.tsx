"use client";

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import authService from "@/services/authService";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      setDashboardPath(authService.getRedirectPath());
    }
  }, []);

  const platform = [
    { name: t("payoutRates"), href: "/payout-rates" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
    { name: t("blog"), href: "/blog" },
  ];

  const company = [
    { name: t("termsOfService"), href: "/terms-of-service" },
    { name: t("privacyPolicy"), href: "/privacy-policy" },
    { name: t("reportAbuse"), href: "/report-abuse" },
  ];

  return (
    <footer className="bg-white py-14 font-poppins border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10 mb-10">
          {/* Logo & Description */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-bluelanding flex items-center justify-center">
                <svg
                  width="20"
                  height="22"
                  viewBox="0 0 153 171"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M118.483 70.3298L117.697 70.6345C111.006 73.226 104.496 66.4884 107.315 59.891C111.325 52.0061 129.842 41.3239 115.527 28.1765C105.29 18.774 84.2807 35.59 70.7758 51.3724C53.2467 71.8577 62.3024 92.4722 79.3197 96.6568C91.5741 99.6702 69.2325 110.525 52.6375 93.8808C32.554 73.7378 51.6333 44.2901 64.9336 30.6665C78.2338 17.0428 107.832 -5.52019 129.749 16.8186C151.004 38.4832 132.426 62.1135 119.611 69.7866C119.25 70.003 118.876 70.1776 118.483 70.3298Z"
                    fill="currentColor"
                  />
                  <path
                    d="M34.1459 99.7246L34.9326 99.4198C41.6228 96.8283 48.1333 103.566 45.3139 110.163C41.3044 118.048 22.7874 128.73 37.1018 141.878C47.3388 151.28 68.3485 134.464 81.8533 118.682C99.3824 98.1966 90.3267 77.5822 73.3094 73.3975C61.055 70.3841 83.3967 59.5295 99.9916 76.1735C120.075 96.3165 100.996 125.764 87.6956 139.388C74.3953 153.012 44.7969 175.575 22.8803 153.236C1.62511 131.571 20.2033 107.941 33.0181 100.268C33.3795 100.051 33.7531 99.8767 34.1459 99.7246Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-slate-800">
                Shortlinkmu
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {t("description")}
            </p>
            <Link
              href={isAuthenticated ? dashboardPath : "/register"}
              className="inline-flex items-center justify-center bg-bluelanding hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors"
            >
              {isAuthenticated ? t("goToDashboard") : t("getStarted")}
            </Link>
          </div>

          {/* Links */}
          <div className="flex gap-16 md:gap-20">
            {/* Platform */}
            <div>
              <h4 className="text-slate-800 font-medium text-sm mb-4">
                {t("platform")}
              </h4>
              <ul className="space-y-2.5">
                {platform.map((item) => (
                  <li key={item.href}>
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
                {t("company")}
              </h4>
              <ul className="space-y-2.5">
                {company.map((item) => (
                  <li key={item.href}>
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
          <p className="text-slate-500 text-sm">{t("copyright")}</p>
          <div className="flex justify-end gap-3">
            <a
              href="https://youtube.com/@shortlinkmu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shortlinkmu di YouTube"
              className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
            >
              Youtube
            </a>
            <a
              href="https://t.me/shortlinkmu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shortlinkmu di Telegram"
              className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://instagram.com/shortlinkmu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shortlinkmu di Instagram"
              className="text-slate-500 text-sm hover:text-slate-600 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
