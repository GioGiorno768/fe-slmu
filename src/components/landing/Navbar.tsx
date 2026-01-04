"use client";

import { usePathname, useRouter, Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useTransition, useEffect } from "react";
import authService from "@/services/authService";
import Modal from "@/components/common/Modal";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Registration disabled state
  const [isRegistrationDisabled, setIsRegistrationDisabled] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const openMenu = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Check auth status and get correct dashboard path on mount
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      setDashboardPath(authService.getRedirectPath());
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch access settings on mount
  useEffect(() => {
    const fetchAccessSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/access`
        );
        if (response.ok) {
          const data = await response.json();
          setIsRegistrationDisabled(data.data?.disable_registration ?? false);
          setIsLoginDisabled(data.data?.disable_login ?? false);
        }
      } catch (error) {
        console.error("Failed to fetch access settings:", error);
      }
    };
    fetchAccessSettings();
  }, []);

  const handleOpenMenu = () => {
    setIsOpen(openMenu.current?.checked ?? false);
  };

  // Handle register button click
  const handleRegisterClick = () => {
    if (isRegistrationDisabled) {
      setShowRegisterModal(true);
    } else {
      router.push("/register");
    }
  };

  // --- FITUR GANTI BAHASA ---
  const switchLanguage = (nextLocale: "en" | "id") => {
    startTransition(() => {
      // router.replace akan mengganti URL saat ini dengan locale baru
      // misal: /en/about -> /id/about
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <>
      <nav
        className={`text-[10px] fixed lg:fixed w-full font-figtree transition-all duration-300 z-50 ${
          isScrolled || isOpen
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[140em] px-[1.6em] lg:px-[2.4em] m-auto py-[1.6em] lg:py-[3em] flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-[2em]">
            <div className="w-[3em] h-[3em] rounded-full bg-bluelight"></div>
            <Link
              href="/"
              className="text-[2em] text-bluelight font-semibold tracking-tight"
            >
              Shortlinkmu
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="lg:flex hidden gap-[5em] items-center">
            <Link
              href="/payout-rates"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              {t("payoutRates")}
            </Link>
            <Link
              href="/about"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="text-[1.8em] font-semibold tracking-tight"
            >
              {t("contact")}
            </Link>
          </div>

          {/* Desktop Right Side (Lang Switcher + Auth) */}
          <div className="items-center gap-[4em] hidden lg:flex">
            {/* === LANGUAGE SWITCHER DROPDOWN (DESKTOP) === */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <path
                    strokeWidth="1.5"
                    d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                  />
                </svg>
                <span className="text-[1.4em] font-medium text-slate-700">
                  {locale.toUpperCase()}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showLangDropdown && (
                <>
                  {/* Click outside overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 py-2 min-w-[120px] z-50">
                    <button
                      onClick={() => {
                        switchLanguage("en");
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-[1.4em] flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                        locale === "en"
                          ? "text-bluelight font-semibold"
                          : "text-slate-600"
                      }`}
                    >
                      {locale === "en" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-bluelight" />
                      )}
                      English
                    </button>
                    <button
                      onClick={() => {
                        switchLanguage("id");
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-[1.4em] flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                        locale === "id"
                          ? "text-bluelight font-semibold"
                          : "text-slate-600"
                      }`}
                    >
                      {locale === "id" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-bluelight" />
                      )}
                      Indonesia
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Auth Buttons - Desktop */}
            {isAuthenticated ? (
              <Link
                href={dashboardPath as any}
                className={`text-[1.6em] font-semibold tracking-tight bg-bluelight text-white px-[1.5em] py-[.5em] rounded-full`}
              >
                {t("dashboard")}
              </Link>
            ) : !isLoginDisabled ? (
              <>
                <Link
                  href="/login"
                  className={`text-[1.6em] font-semibold tracking-tight bg-white text-bluelight px-[1.5em] py-[.5em] rounded-full`}
                >
                  {t("login")}
                </Link>
                <button
                  onClick={handleRegisterClick}
                  className={`text-[1.6em] font-semibold tracking-tight bg-white text-bluelight  px-[1.5em] py-[.5em] rounded-full`}
                >
                  {t("register")}
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden static">
            <label className="flex flex-col gap-[0.4em] w-[3.5em] h-[3.5em] justify-center items-center cursor-pointer border-[0.15em] border-bluelight rounded-[0.8em] hover:bg-bluelight/5 transition-all duration-200">
              <input
                className="peer hidden"
                type="checkbox"
                ref={openMenu}
                onChange={handleOpenMenu}
              />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:rotate-45 peer-checked:translate-y-[0.6em]" />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:opacity-0 peer-checked:scale-0" />
              <span className="block h-[0.2em] w-[2em] bg-bluelight rounded-full transition-all duration-300 ease-out peer-checked:-rotate-45 peer-checked:-translate-y-[0.6em]" />
            </label>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-[2em] max-w-[140em] px-[1.6em] lg:px-[2.4em] m-auto bg-white/95 backdrop-blur-md lg:hidden flex flex-col items-start gap-[1.5em] border-t border-gray-100">
            {/* === LANGUAGE SWITCHER (MOBILE) === */}
            <div className="w-full px-[2em] py-[1em] flex justify-center gap-[1em]">
              <button
                onClick={() => switchLanguage("en")}
                className={`w-1/2 py-[0.8em] rounded-full text-[1.6em] font-semibold transition-all border ${
                  locale === "en"
                    ? "bg-bluelight text-white border-bluelight"
                    : "bg-white text-grays border-gray-200"
                }`}
              >
                English
              </button>
              <button
                onClick={() => switchLanguage("id")}
                className={`w-1/2 py-[0.8em] rounded-full text-[1.6em] font-semibold transition-all border ${
                  locale === "id"
                    ? "bg-bluelight text-white border-bluelight"
                    : "bg-white text-grays border-gray-200"
                }`}
              >
                Indonesia
              </button>
            </div>

            <Link
              href="/payout-rates"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blue-50 text-bluelight py-[.8em] rounded-full hover:bg-blues"
            >
              {t("payoutRates")}
            </Link>
            <Link
              href="/about"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full hover:bg-blues"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] text-shortblack py-[.8em] rounded-full hover:bg-blues"
            >
              {t("contact")}
            </Link>
            <div className="w-full border-t border-gray-200 my-[1em]"></div>
            {/* Auth Buttons - Mobile */}
            {isAuthenticated ? (
              <Link
                href={dashboardPath as any}
                className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-bluelight text-white py-[.8em] rounded-full text-center"
              >
                {t("dashboard")}
              </Link>
            ) : !isLoginDisabled ? (
              <div className="flex items-center gap-[3em] justify-stretch w-full">
                <Link
                  href="/login"
                  className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-gray-50 text-shortblack py-[.8em] rounded-full text-center"
                >
                  {t("login")}
                </Link>
                <button
                  onClick={handleRegisterClick}
                  className="text-[1.6em] font-semibold tracking-tight w-full px-[2em] bg-blues text-bluelight py-[.8em] rounded-full text-center"
                >
                  {t("register")}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Registration Disabled Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Pendaftaran Ditutup"
        message="Mohon maaf, pendaftaran akun baru sedang ditutup sementara. Silakan coba lagi nanti atau hubungi admin untuk informasi lebih lanjut."
        type="warning"
        buttonLabel="Kembali ke Home"
        onButtonClick={() => {
          setShowRegisterModal(false);
          router.push("/");
        }}
      />
    </>
  );
}
