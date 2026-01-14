// src/components/dashboard/super-admin/settings/ViolationSettingsSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertTriangle,
  Link2,
  Settings2,
  BarChart3,
  X,
  Check,
} from "lucide-react";
import clsx from "clsx";
import { useAlert } from "@/hooks/useAlert";
import apiClient from "@/services/apiClient";
import { useTheme } from "next-themes";

// Types
interface ViolationReferrer {
  id: number;
  domain: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

interface ViolationSettings {
  penalty_percent: number;
  threshold: number;
  penalty_days: number;
  auto_disable: boolean;
  auto_disable_threshold: number;
}

interface ViolationStats {
  total_violations: number;
  total_violation_count: number;
  affected_links: number;
  affected_users: number;
  top_referrers: { referrer_domain: string; total: number }[];
}

export default function ViolationSettingsSection() {
  const { showAlert } = useAlert();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // State
  const [referrers, setReferrers] = useState<ViolationReferrer[]>([]);
  const [settings, setSettings] = useState<ViolationSettings>({
    penalty_percent: 30,
    threshold: 3,
    penalty_days: 7,
    auto_disable: false,
    auto_disable_threshold: 10,
  });
  const [stats, setStats] = useState<ViolationStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [refRes, settingsRes, statsRes] = await Promise.all([
        apiClient.get("/super-admin/violation-referrers"),
        apiClient.get("/super-admin/violation-referrers/settings"),
        apiClient.get("/super-admin/violation-referrers/stats"),
      ]);

      setReferrers(refRes.data.data || []);
      setSettings(settingsRes.data.data || settings);
      setStats(statsRes.data.data || null);
    } catch (error) {
      console.error("Failed to fetch violation data:", error);
      showAlert("Failed to load violation settings", "error");
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await apiClient.put(
        "/super-admin/violation-referrers/settings",
        settings
      );
      showAlert("Settings saved successfully!", "success");
    } catch (error) {
      console.error("Failed to save settings:", error);
      showAlert("Failed to save settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // Add domain
  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;

    setAddingDomain(true);
    try {
      const res = await apiClient.post("/super-admin/violation-referrers", {
        domain: newDomain.trim(),
      });
      setReferrers([...referrers, res.data.data]);
      setNewDomain("");
      showAlert("Domain added successfully!", "success");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add domain";
      showAlert(message, "error");
    } finally {
      setAddingDomain(false);
    }
  };

  // Delete domain
  const handleDeleteDomain = async (id: number) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/super-admin/violation-referrers/${id}`);
      setReferrers(referrers.filter((r) => r.id !== id));
      showAlert("Domain removed successfully!", "success");
    } catch (error) {
      showAlert("Failed to remove domain", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle domain active status
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await apiClient.put(`/super-admin/violation-referrers/${id}`, {
        is_active: !isActive,
      });
      setReferrers(
        referrers.map((r) => (r.id === id ? { ...r, is_active: !isActive } : r))
      );
    } catch (error) {
      showAlert("Failed to update domain status", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className={clsx(
            "text-[2em] font-bold flex items-center gap-3",
            isDark ? "text-white" : "text-shortblack"
          )}
        >
          <Shield className="w-6 h-6 text-bluelight" />
          Violation Referrer Settings
        </h2>
        <p
          className={clsx(
            "text-[1.3em] mt-1",
            isDark ? "text-gray-400" : "text-grays"
          )}
        >
          Block earnings from links wrapped in other URL shorteners
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Violations"
            value={stats.total_violation_count}
            color="red"
            isDark={isDark}
          />
          <StatCard
            label="Affected Links"
            value={stats.affected_links}
            color="orange"
            isDark={isDark}
          />
          <StatCard
            label="Affected Users"
            value={stats.affected_users}
            color="yellow"
            isDark={isDark}
          />
          <StatCard
            label="Blocked Domains"
            value={referrers.filter((r) => r.is_active).length}
            color="blue"
            isDark={isDark}
          />
        </div>
      )}

      {/* Penalty Settings */}
      <div
        className={clsx(
          "rounded-2xl p-6 border",
          isDark ? "bg-subcard border-gray-700" : "bg-subcard border-gray-100"
        )}
      >
        <h3
          className={clsx(
            "text-[1.6em] font-semibold mb-4 flex items-center gap-2",
            isDark ? "text-white" : "text-shortblack"
          )}
        >
          <Settings2 className="w-5 h-5" />
          Penalty Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Penalty Percent */}
          <div>
            <label
              className={clsx(
                "block text-[1.3em] font-medium mb-2",
                isDark ? "text-gray-300" : "text-grays"
              )}
            >
              CPC Penalty (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.penalty_percent}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  penalty_percent: Number(e.target.value),
                })
              }
              className={clsx(
                "w-full px-4 py-3 rounded-xl border text-[1.3em] focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight",
                isDark
                  ? "bg-card border-gray-700 text-white"
                  : "bg-card border-gray-200 text-shortblack"
              )}
            />
            <p
              className={clsx(
                "text-[1.1em] mt-1",
                isDark ? "text-gray-500" : "text-grays"
              )}
            >
              Reduce CPC by this percentage
            </p>
          </div>

          {/* Threshold */}
          <div>
            <label
              className={clsx(
                "block text-[1.3em] font-medium mb-2",
                isDark ? "text-gray-300" : "text-grays"
              )}
            >
              Violation Threshold
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.threshold}
              onChange={(e) =>
                setSettings({ ...settings, threshold: Number(e.target.value) })
              }
              className={clsx(
                "w-full px-4 py-3 rounded-xl border text-[1.3em] focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight",
                isDark
                  ? "bg-card border-gray-700 text-white"
                  : "bg-card border-gray-200 text-shortblack"
              )}
            />
            <p
              className={clsx(
                "text-[1.1em] mt-1",
                isDark ? "text-gray-500" : "text-grays"
              )}
            >
              Violations before penalty applies
            </p>
          </div>

          {/* Penalty Days */}
          <div>
            <label
              className={clsx(
                "block text-[1.3em] font-medium mb-2",
                isDark ? "text-gray-300" : "text-grays"
              )}
            >
              Penalty Duration (days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={settings.penalty_days}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  penalty_days: Number(e.target.value),
                })
              }
              className={clsx(
                "w-full px-4 py-3 rounded-xl border text-[1.3em] focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight",
                isDark
                  ? "bg-card border-gray-700 text-white"
                  : "bg-card border-gray-200 text-shortblack"
              )}
            />
            <p
              className={clsx(
                "text-[1.1em] mt-1",
                isDark ? "text-gray-500" : "text-grays"
              )}
            >
              How long penalty lasts
            </p>
          </div>

          {/* Auto Disable */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    auto_disable: !settings.auto_disable,
                  })
                }
                className={clsx(
                  "relative w-14 h-7 rounded-full transition-colors",
                  settings.auto_disable
                    ? "bg-bluelight"
                    : isDark
                    ? "bg-gray-600"
                    : "bg-gray-300"
                )}
              >
                <span
                  className={clsx(
                    "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
                    settings.auto_disable ? "left-8" : "left-1"
                  )}
                />
              </button>
              <div>
                <p
                  className={clsx(
                    "text-[1.3em] font-medium",
                    isDark ? "text-white" : "text-shortblack"
                  )}
                >
                  Auto-disable links
                </p>
                <p
                  className={clsx(
                    "text-[1.1em]",
                    isDark ? "text-gray-500" : "text-grays"
                  )}
                >
                  Disable link after {settings.auto_disable_threshold}{" "}
                  violations
                </p>
              </div>
              {settings.auto_disable && (
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.auto_disable_threshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      auto_disable_threshold: Number(e.target.value),
                    })
                  }
                  className={clsx(
                    "w-24 px-3 py-2 rounded-xl border text-[1.2em] focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight",
                    isDark
                      ? "bg-card border-gray-700 text-white"
                      : "bg-card border-gray-200 text-shortblack"
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="px-6 py-3 bg-bluelight text-white rounded-xl text-[1.3em] font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {savingSettings ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Settings
          </button>
        </div>
      </div>

      {/* Blocked Domains List */}
      <div>
        <h3
          className={clsx(
            "text-[1.6em] font-semibold mb-4 flex items-center gap-2",
            isDark ? "text-white" : "text-shortblack"
          )}
        >
          <Link2 className="w-5 h-5" />
          Blocked Shortlink Domains ({referrers.length})
        </h3>

        {/* Add New Domain */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter domain (e.g., bit.ly, s.id)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
            className={clsx(
              "flex-1 px-4 py-3 rounded-xl border text-[1.3em] focus:outline-none focus:ring-2 focus:ring-bluelight/20 focus:border-bluelight",
              isDark
                ? "bg-card border-gray-700 text-white placeholder:text-gray-500"
                : "bg-card border-gray-200 text-shortblack"
            )}
          />
          <button
            onClick={handleAddDomain}
            disabled={addingDomain || !newDomain.trim()}
            className="px-5 py-3 bg-bluelight text-white rounded-xl text-[1.3em] font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {addingDomain ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add
          </button>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {referrers.map((referrer) => (
              <motion.div
                key={referrer.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={clsx(
                  "flex items-center justify-between px-4 py-3 rounded-xl border transition-colors",
                  referrer.is_active
                    ? isDark
                      ? "bg-card border-gray-700"
                      : "bg-card border-gray-200"
                    : isDark
                    ? "bg-subcard border-gray-800 opacity-60"
                    : "bg-subcard border-gray-100 opacity-60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() =>
                      handleToggleActive(referrer.id, referrer.is_active)
                    }
                    className={clsx(
                      "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                      referrer.is_active
                        ? "bg-bluelight border-bluelight text-white"
                        : isDark
                        ? "border-gray-600"
                        : "border-gray-300"
                    )}
                  >
                    {referrer.is_active && <Check className="w-3 h-3" />}
                  </button>
                  <span
                    className={clsx(
                      "text-[1.3em] font-medium truncate",
                      isDark ? "text-white" : "text-shortblack"
                    )}
                  >
                    {referrer.domain}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteDomain(referrer.id)}
                  disabled={deletingId === referrer.id}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    isDark
                      ? "text-gray-500 hover:text-red-400 hover:bg-red-500/20"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  )}
                >
                  {deletingId === referrer.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {referrers.length === 0 && (
          <div
            className={clsx(
              "text-center py-12",
              isDark ? "text-gray-500" : "text-grays"
            )}
          >
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-[1.4em]">No blocked domains yet</p>
            <p className="text-[1.2em]">Add URL shortener domains to block</p>
          </div>
        )}
      </div>

      {/* Top Violation Referrers */}
      {stats && stats.top_referrers.length > 0 && (
        <div>
          <h3
            className={clsx(
              "text-[1.6em] font-semibold mb-4 flex items-center gap-2",
              isDark ? "text-white" : "text-shortblack"
            )}
          >
            <BarChart3 className="w-5 h-5" />
            Top Violation Sources
          </h3>
          <div className="space-y-2">
            {stats.top_referrers.slice(0, 5).map((ref, idx) => (
              <div
                key={ref.referrer_domain}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-xl",
                  isDark ? "bg-subcard" : "bg-subcard"
                )}
              >
                <span
                  className={clsx(
                    "text-[1.2em] font-bold w-6",
                    isDark ? "text-gray-500" : "text-grays"
                  )}
                >
                  #{idx + 1}
                </span>
                <span
                  className={clsx(
                    "text-[1.3em] font-medium flex-1",
                    isDark ? "text-white" : "text-shortblack"
                  )}
                >
                  {ref.referrer_domain}
                </span>
                <span
                  className={clsx(
                    "text-[1.3em] font-semibold",
                    isDark ? "text-red-400" : "text-red-500"
                  )}
                >
                  {ref.total} violations
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  color,
  isDark,
}: {
  label: string;
  value: number;
  color: "red" | "orange" | "yellow" | "blue";
  isDark: boolean;
}) {
  const colorClasses = {
    red: isDark
      ? "bg-red-500/10 text-red-400 border-red-500/30"
      : "bg-red-50 text-red-600 border-red-100",
    orange: isDark
      ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
      : "bg-orange-50 text-orange-600 border-orange-100",
    yellow: isDark
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      : "bg-yellow-50 text-yellow-600 border-yellow-100",
    blue: isDark
      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
      : "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <div className={clsx("px-4 py-4 rounded-xl border", colorClasses[color])}>
      <p className="text-[2em] font-bold">{value.toLocaleString()}</p>
      <p className="text-[1.2em] opacity-80">{label}</p>
    </div>
  );
}
