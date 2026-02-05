// src/hooks/useHeader.ts
"use client";

import { useState, useEffect } from "react";
import * as headerService from "@/services/headerService";
import { getToken } from "@/services/authService";
import type { HeaderStats, AdminHeaderStats } from "@/types/type";

export function useHeader(role: "member" | "admin" | "super-admin" = "member") {
  const [stats, setStats] = useState<HeaderStats | AdminHeaderStats | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // 🔐 Track auth token to detect user change
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check for auth token changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = getToken();
      if (currentToken !== authToken) {
        setAuthToken(currentToken);
      }
    };

    checkToken();

    // Listen for storage, focus, and header refresh events
    window.addEventListener("storage", checkToken);
    window.addEventListener("focus", checkToken);

    // Listen for manual refresh (e.g., after withdrawal)
    const handleRefresh = () => {
      // Force re-fetch by changing authToken temporarily
      setAuthToken((prev) => (prev ? prev + "_refresh" : null));
      setTimeout(() => setAuthToken(getToken()), 100);
    };
    window.addEventListener("headerStatsRefresh", handleRefresh);

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("focus", checkToken);
      window.removeEventListener("headerStatsRefresh", handleRefresh);
    };
  }, [authToken]);

  // Fetch data when token changes (user changed)
  useEffect(() => {
    if (!authToken) return; // Don't fetch if no token

    async function loadData() {
      setIsLoading(true);
      try {
        let data;
        if (role === "admin" || role === "super-admin") {
          data = await headerService.getAdminHeaderStats();
        } else {
          data = await headerService.getHeaderStats();
        }
        setStats(data);
      } catch (error) {
        console.error("Gagal load header stats", error);
        if (role === "admin" || role === "super-admin") {
          setStats({
            pendingWithdrawals: 0,
            abuseReports: 0,
            newUsers: 0,
          });
        } else {
          setStats({ balance: 0, payout: 0, cpm: 0 });
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [role, authToken]); // 🔐 Re-fetch when token changes

  return { stats, isLoading };
}
