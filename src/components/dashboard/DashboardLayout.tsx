// src/components/dashboard/DashboardLayout.tsx
"use client";

import { useState } from "react";
import Header from "./Header";
import Breadcrumb from "./Breadcrumb";
import DashboardFooter from "./DashboardFooter";
import { usePathname } from "@/i18n/routing";

// --- TAMBAHKAN IMPORT INI ---
import { useTranslations } from "next-intl";
import { getMemberMenu, getAdminMenu } from "@/lib/menus";
import MobileBottomBar from "./MobileBottomBar";
import { Role } from "@/types/type";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Sidebar from "./sidebar/Sidebar";

export default function DashboardLayout({
  children,
  role = "member", // Default member
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  const t = useTranslations("Dashboard"); // Hook translate jalan di sini
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // SWITCH MENU BERDASARKAN ROLE
  // Member -> getMemberMenu
  // Admin -> getAdminMenu("admin")
  // Super Admin -> getAdminMenu("super-admin")
  const menuItems =
    role === "admin" || role === "super-admin"
      ? getAdminMenu(role)
      : getMemberMenu(t);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openMobileSidebar = () => {
    setIsMobileOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen dark:bg-background">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onClose={closeMobileSidebar}
          toggleSidebar={toggleSidebar}
          menuItems={menuItems} // <-- Menu dikirim dari Client ke Client (AMAN)
          role={role}
        />
        <Header
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          openMobileSidebar={openMobileSidebar}
          role={role}
        />

        <main
          className={`
            ${isCollapsed ? "custom:ml-20" : "custom:ml-64"}
            sm:pt-[9.2em] pt-[5em] px-4 custom:px-8 py-2
            transition-all duration-300 ease-in-out
            min-h-screen sm:mb-0 mb-20
          `}
        >
          <div className="w-full py-[1em] lg:px-[1.5em] px-[1.5em] mb-[.5em] rounded-xl">
            <Breadcrumb />
          </div>

          {children}

          <DashboardFooter />
        </main>
        <MobileBottomBar isSidebarOpen={isMobileOpen} role={role} />
      </div>
    </CurrencyProvider>
  );
}
