// src/app/[locale]/(super-admin)/super-admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Link2,
  Users,
  Settings2,
  Megaphone,
  Bell,
  DollarSign,
  Shield,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "next-themes";

// Section Components
import WithdrawalSettingsSection from "@/components/dashboard/super-admin/settings/WithdrawalSettingsSection";
import ReferralSettingsSection from "@/components/dashboard/super-admin/settings/ReferralSettingsSection";
import SecuritySettingsSection from "@/components/dashboard/super-admin/settings/SecuritySettingsSection";
import GeneralSettingsSection from "@/components/dashboard/super-admin/settings/GeneralSettingsSection";
import SelfClickSettings from "@/components/dashboard/admin/settings/SelfClickSettings";
import VisitorCooldownSettings from "@/components/dashboard/admin/settings/VisitorCooldownSettings";
import TokenSettings from "@/components/dashboard/admin/settings/TokenSettings";
import CpcRatesSettings from "@/components/dashboard/admin/settings/CpcRatesSettings";
import GlobalNotificationSection from "@/components/dashboard/super-admin/settings/GlobalNotificationSection";
import ViolationSettingsSection from "@/components/dashboard/super-admin/settings/ViolationSettingsSection";
import GlobalAlert from "@/components/dashboard/GlobalAlert";

// Tab Config
const TABS = [
  { id: "withdrawal", label: "Withdrawal", icon: CreditCard, disabled: false },
  { id: "links", label: "Links", icon: Link2, disabled: false },
  { id: "cpc-rates", label: "CPC Rates", icon: DollarSign, disabled: false },
  {
    id: "violations",
    label: "Violations",
    icon: AlertTriangle,
    disabled: true, // Disabled: Cannot auto-detect traffic from other shortlink services
  },
  { id: "referral", label: "Referral", icon: Users, disabled: false },
  { id: "notification", label: "Notification", icon: Bell, disabled: false },
  { id: "security", label: "Security", icon: Shield, disabled: false },
  { id: "general", label: "General", icon: Settings2, disabled: false },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SuperAdminSettingsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Use consistent default to prevent hydration mismatch
  const [activeTab, setActiveTab] = useState<TabId>("withdrawal");

  // Sync URL hash with active tab
  const handleTabChange = (tabId: TabId) => {
    const tab = TABS.find((t) => t.id === tabId);
    if (tab?.disabled) return;
    setActiveTab(tabId);
    window.history.replaceState(null, "", `#${tabId}`);
  };

  // Read URL hash on mount (client-side only)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && TABS.some((t) => t.id === hash && !t.disabled)) {
      setActiveTab(hash as TabId);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (TABS.some((t) => t.id === newHash && !t.disabled)) {
        setActiveTab(newHash as TabId);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <h1 className="text-[2.5em] font-bold text-shortblack mb-2">
        Platform Settings
      </h1>
      <p className="text-[1.4em] text-grays mb-8">
        Manage platform-wide configurations and features
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR (STICKY) */}
        <div
          className={clsx(
            "w-full lg:w-[280px] shrink-0 rounded-3xl p-4 shadow-sm z-20 sticky sm:top-[15em] top-[10em]",
            isDark
              ? "bg-card border border-gray-800"
              : "bg-white border border-gray-100",
          )}
        >
          <div className="grid lg:grid-cols-1 grid-cols-2 gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDisabled = tab.disabled;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={isDisabled}
                  className={clsx(
                    "flex items-center sm:justify-start justify-center gap-3 sm:px-5 px-4 py-3.5 rounded-2xl transition-all whitespace-nowrap text-[1.4em] font-medium w-full",
                    isActive
                      ? isDark
                        ? "bg-bluelight text-white shadow-md shadow-purple-900/30"
                        : "bg-bluelight text-white shadow-md shadow-blue-200"
                      : isDisabled
                        ? isDark
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-300 cursor-not-allowed"
                        : "text-grays hover:bg-blues hover:text-shortblack",
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {isDisabled && (
                    <span
                      className={clsx(
                        "ml-auto text-[0.8em] text-gray-400 px-2 py-0.5 rounded-full hidden sm:block",
                        isDark ? "bg-gray-800" : "bg-gray-100",
                      )}
                    >
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={
                activeTab === "links"
                  ? "space-y-6"
                  : "bg-card rounded-3xl p-6 sm:p-8 shadow-sm shadow-shd-card/50"
              }
            >
              {activeTab === "withdrawal" && <WithdrawalSettingsSection />}

              {activeTab === "links" && (
                <>
                  <SelfClickSettings />
                  <VisitorCooldownSettings />
                  <TokenSettings />
                </>
              )}

              {activeTab === "cpc-rates" && <CpcRatesSettings />}

              {activeTab === "violations" && <ViolationSettingsSection />}

              {activeTab === "referral" && <ReferralSettingsSection />}

              {activeTab === "notification" && <GlobalNotificationSection />}

              {activeTab === "security" && <SecuritySettingsSection />}
              {/* {activeTab === "announcements" && (
                <div className="text-center py-12">
                  <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-[1.6em] font-semibold text-gray-400">
                    Announcements
                  </p>
                  <p className="text-[1.3em] text-gray-300 mt-1">
                    Coming soon...
                  </p>
                </div>
              )} */}

              {activeTab === "general" && <GeneralSettingsSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global Alert for toast notifications */}
      <GlobalAlert />
    </div>
  );
}
