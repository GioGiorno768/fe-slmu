// src/app/[locale]/(admin)/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Settings2, Loader2 } from "lucide-react";
import clsx from "clsx";

// Section Components
import ProfileSection from "@/components/dashboard/settings/ProfileSection";
import PreferencesSection from "@/components/dashboard/settings/PreferencesSection";

// Services
import * as settingsService from "@/services/settingsService";
import { useTheme } from "next-themes";

// Tab Config (Admin only has Profile & Preferences)
const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminSettingsPage() {
  // Get initial tab from URL hash
  const getInitialTab = (): TabId => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (TABS.some((t) => t.id === hash)) return hash as TabId;
    }
    return "profile";
  };

  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab);
  const [isLoading, setIsLoading] = useState(true);

  // Data states (admin-specific)
  const [profileData, setProfileData] = useState<any>(null);
  const [preferencesData, setPreferencesData] = useState<any>(null);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Fetch admin data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [profile, preferences] = await Promise.all([
          settingsService.getAdminProfile(),
          settingsService.getAdminPreferences(),
        ]);
        setProfileData(profile);
        setPreferencesData(preferences);
      } catch (error) {
        console.error("Failed to load admin settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync URL hash with active tab
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, "", `#${tabId}`);
  };

  // Listen for hash changes AND check initial hash on mount
  useEffect(() => {
    const initialHash = window.location.hash.slice(1);
    if (initialHash && TABS.some((t) => t.id === initialHash)) {
      setActiveTab(initialHash as TabId);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (TABS.some((t) => t.id === hash)) {
        setActiveTab(hash as TabId);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      <h1 className="text-[2.5em] font-bold text-shortblack mb-8">
        Admin Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR (STICKY) */}
        <div className={clsx(
            "w-full lg:w-[280px] flex-shrink-0 rounded-3xl p-4 shadow-sm z-20 sticky sm:top-[15em] top-[10em]",
            isDark
              ? "bg-card border border-gray-800"
              : "bg-white border border-gray-100"
          )}>
          <div className="grid lg:grid-cols-1 grid-cols-2 gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={clsx(
                    "flex items-center sm:justify-baseline justify-center gap-4 sm:px-6 px-4 py-4 rounded-2xl transition-all whitespace-nowrap text-[1.4em] font-medium w-full",
                    isActive
                      ? "bg-bluelight text-white shadow-md shadow-blue-200"
                      : "text-grays hover:bg-blues hover:text-shortblack"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA (DYNAMIC) */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && profileData && (
                <ProfileSection initialData={profileData} type="admin" />
              )}
              {activeTab === "preferences" && preferencesData && (
                <PreferencesSection
                  initialData={preferencesData}
                  type="admin"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
