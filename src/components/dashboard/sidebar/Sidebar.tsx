// src/components/dashboard/sidebar/Sidebar.tsx
"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Settings, LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { getLocalAvatarUrl } from "@/utils/avatarUtils";
import { NavItem, Role } from "@/types/type";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import authService from "@/services/authService";
import Toast from "@/components/common/Toast";
import { useTheme } from "next-themes";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  toggleSidebar: () => void;
  menuItems: NavItem[];
  role?: Role;
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  toggleSidebar,
  menuItems,
  role = "member",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  // Determine user type based on role
  const userType =
    role === "super-admin" || role === "admin" ? "admin" : "user";
  const { user, isLoading } = useUser(userType);

  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const userPopupRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { theme } = useTheme();

  // Prevent hydration mismatch - wait for client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  // Logout handler
  const handleLogout = async () => {
    try {
      await authService.logout();

      // Show success toast
      setToastMessage("Logout berhasil!");
      setShowToast(true);

      // Check if login is disabled - redirect to landing instead of login
      let redirectPath = "/login";
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/access`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data?.disable_login) {
            redirectPath = "/";
          }
        }
      } catch {
        // Ignore fetch error, just use default redirect
      }

      // Redirect after short delay
      setTimeout(() => {
        router.push(redirectPath);
      }, 800);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, show toast and redirect
      authService.removeToken();
      setToastMessage("Logout berhasil!");
      setShowToast(true);
      setTimeout(() => {
        router.push("/");
      }, 800);
    }
  };

  // --- LOGIC MENU PROFILE DINAMIS ---
  // Kalau Admin/Super Admin -> Lari ke halaman settings admin
  // Kalau Member -> Lari ke halaman settings member
  const settingsPath =
    role === "super-admin"
      ? "/super-admin/settings"
      : role === "admin"
        ? "/admin/settings"
        : "/settings";

  const userMenuItems = [
    { icon: Settings, label: t("settings"), href: settingsPath },
    { icon: LogOut, label: t("logOut"), href: "/logout" },
  ];

  // Handle klik luar popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target as Node)
      ) {
        setIsUserPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userPopupRef]);

  // Tutup popup saat sidebar berubah mode
  useEffect(() => {
    setIsUserPopupOpen(false);
  }, [isCollapsed, isMobileOpen]);

  // Komponen Konten Popup
  const UserPopupContent = () => (
    <>
      {userMenuItems.map((item) => {
        const isChildActive =
          pathname === item.href || pathname === `/id${item.href}`;
        const isLogout = item.label === t("logOut");

        const itemClass = `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 text-[1.4em] w-full
          ${
            isChildActive
              ? isDark
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-bluelight shadow-md shadow-blue-300 text-white"
              : isDark
                ? "text-slate-400 hover:bg-[#1f2545] hover:text-white"
                : "text-shortblack hover:bg-blues hover:text-tx-blue-dashboard"
          }`;

        return (
          <div key={item.label}>
            {isLogout && (
              <div
                className={`h-px ${isDark ? "bg-slate-700" : "bg-gray-200"} my-1 mx-3`}
              />
            )}

            {/* Render Button (Logout) atau Link (Navigasi) */}
            {isLogout ? (
              <button
                onClick={() => {
                  setIsUserPopupOpen(false);
                  onClose();
                  handleLogout(); // Call logout API
                }}
                className={itemClass}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href!}
                onClick={() => {
                  setIsUserPopupOpen(false);
                  onClose();
                }}
                className={itemClass}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] custom:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`bg-background-side text-shortblack h-screen fixed left-0 top-0 
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${
            isMobileOpen ? "translate-x-0 z-[100]" : "-translate-x-full z-[100]"
          }
          custom:translate-x-0 custom:z-40 font-figtree custom:text-[10px] text-[8px] flex flex-col justify-between border-r-[2px] border-shd-card/10
        `}
      >
        <div>
          {/* Header Sidebar (Logo) */}
          <div
            className={`flex w-full items-center justify-between ${
              isCollapsed ? "px-[2em]" : "px-[3em]"
            } py-[2em] text-shortblack`}
          >
            {isCollapsed ? (
              <div>
                <button
                  onClick={toggleSidebar}
                  className={` ${isDark ? "hover:bg-[#1f2545]" : "hover:bg-blues"} rounded-lg w-fit transition-colors hidden custom:flex items-center justify-center p-2 group`}
                >
                  <span
                    className={`solar--sidebar-minimalistic-broken w-[2.5em] h-[2.5em] ${isDark ? "bg-slate-400 group-hover:bg-white" : "bg-shortblack group-hover:bg-bluelight"}`}
                  ></span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/" className="flex items-center gap-2">
                  <div
                    className={`${isDark ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-bluelight shadow-md shadow-blue-300"} w-[2em] h-[2em] rounded-full flex items-center justify-center font-bold text-[1.6em]`}
                  ></div>
                  <span className="font-semibold text-[1.6em] custom:hidden block">
                    ShortLinkMu
                  </span>
                </Link>
                <div>
                  <button
                    onClick={toggleSidebar}
                    className={` ${isDark ? "hover:bg-[#1f2545]" : "hover:bg-blues"} rounded-lg w-fit transition-colors hidden custom:flex items-center justify-center p-2 group`}
                  >
                    <span
                      className={`solar--sidebar-minimalistic-broken w-[2.5em] h-[2.5em] ${isDark ? "bg-slate-400 group-hover:bg-white" : "bg-shortblack group-hover:bg-bluelight"}`}
                    ></span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Menu Items (List Utama) */}
          <nav
            onWheel={(e) => e.stopPropagation()}
            className="mt-[1em] px-[1em] pb-24 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar-minimal"
          >
            {menuItems.map((item, index) => {
              if (item.isHeader) {
                if (isCollapsed)
                  return (
                    <div
                      key={index}
                      className={`h-px ${isDark ? "bg-white/10" : "bg-gray-200"} my-4 mx-2`}
                    />
                  );
                return (
                  <div key={index} className="px-4 pt-6 pb-2 mb-2">
                    <p
                      className={`text-[1.1em] font-bold ${isDark ? "text-slate-500" : "text-gray-400"} uppercase tracking-wider`}
                    >
                      {item.label}
                    </p>
                  </div>
                );
              }

              const isActive = item.href === pathname;
              const isChildActive =
                item.children?.some(
                  (child) => child.href && pathname.endsWith(child.href),
                ) ?? false;

              return (
                <SidebarItem
                  key={index}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isActive}
                  isChildActive={isChildActive}
                  onClose={onClose}
                />
              );
            })}
          </nav>
        </div>

        {/* ===================================== */}
        {/* === BAGIAN USER PROFILE (POPUP) ===   */}
        {/* ===================================== */}
        <div
          ref={userPopupRef}
          className="absolute bottom-0 left-0 right-0 p-[1em] bg-inherit z-50"
        >
          {/* Popup Expanded */}
          <div
            className={`
              absolute bottom-full left-0 right-0 p-2 mx-[1em] mb-1
              bg-card shadow-sm shadow-shd-card/50 rounded-md
              transition-all duration-150 ease-out transform ${isDark && "outline-2 outline-[#1f2545]"}
              ${
                isUserPopupOpen && !isCollapsed
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }
              origin-bottom 
            `}
          >
            <UserPopupContent />
          </div>

          {/* Popup Collapsed */}
          <div
            className={`
              absolute bottom-full left-0 right-0 p-2 mx-[1em] mb-1
              bg-card shadow-sm shadow-shd-card/50 rounded-md
              transition-all duration-150 ease-out transform ${isDark && "outline-2 outline-[#1f2545]"}
              ${
                isUserPopupOpen && !isCollapsed
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }
              origin-bottom 
            `}
          >
            <UserPopupContent />
          </div>

          {/* Tombol Trigger */}
          <button
            onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}
            disabled={isLoading}
            className={`
              flex items-center gap-3 ${isDark ? "hover:bg-[#1f2545]" : "hover:bg-blues"} p-[1.5em] rounded-xl 
              transition-all duration-200 w-full group relative overflow-hidden
              ${isCollapsed ? "justify-center" : ""}
              ${isUserPopupOpen ? (isDark ? "hover:bg-[#1f2545]" : "hover:bg-blues") : ""} 
            `}
          >
            {isLoading ? (
              // Loading Skeleton
              <>
                <div
                  className={`w-[3em] h-[3em] rounded-full  animate-pulse flex-shrink-0 ${isDark ? "bg-slate-700/50" : "bg-lazyload"}`}
                />
                {!isCollapsed && (
                  <div className="flex-1 space-y-2 text-left min-w-0">
                    <div
                      className={`h-4 w-24 ${isDark ? "bg-slate-700/50" : "bg-lazyload"} rounded animate-pulse`}
                    />
                    <div
                      className={`h-3 w-32 ${isDark ? "bg-slate-700/50" : "bg-lazyload"} rounded animate-pulse`}
                    />
                  </div>
                )}
              </>
            ) : (
              // Data User
              <>
                <div className="flex-shrink-0 relative">
                  <div
                    className={`w-[2.5em] h-[2.5em] rounded-full ${isDark ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-bluelight shadow-md shadow-blue-300"} flex items-center justify-center font-bold text-[1.6em] overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all relative`}
                  >
                    <Image
                      src={user?.avatarUrl || getLocalAvatarUrl(user?.username)}
                      alt="User"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`font-medium truncate ${isDark ? "text-white group-hover:text-blue-100" : "text-shortblack group-hover:text-bluelight"} text-[1.5em] transition-colors`}
                    >
                      {user?.username || "Guest"}
                    </p>
                    <p
                      className={`text-[1.2em] ${isDark ? "text-slate-400 group-hover:text-slate-300" : "text-gray-500 group-hover:text-gray-700"} truncate transition-colors`}
                    >
                      {user?.email || "No Email"}
                    </p>
                  </div>
                )}
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
