// src/services/adsInfoService.ts
import type { AdLevelConfig } from "@/types/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper: Get auth token (same pattern as other services)
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  let token = sessionStorage.getItem("auth_token");
  if (!token) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token" && value) {
        token = value;
        break;
      }
    }
  }
  return token;
}

// API response type
interface ApiAdLevel {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cpm_rate: number;
  cpm_rate_display: string;
  demo_url: string | null;
  color_theme: string;
  revenue_share: number;
  is_popular: boolean;
  is_default: boolean;
  features: { label: string; value: string | boolean; included: boolean }[];
  display_order: number;
}

/**
 * Fetch ad levels from API
 * Used by: ads-info page, create link dropdown
 */
export async function getAdLevels(): Promise<AdLevelConfig[]> {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/ad-levels`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const json = await res.json();
    const data: ApiAdLevel[] = json.data;

    // Transform to frontend format
    return data.map((level) => ({
      id: level.id.toString(),
      name: level.name,
      slug: level.slug,
      description: level.description || "",
      cpmRate: level.cpm_rate_display, // Use formatted display
      revenueShare: level.revenue_share,
      demoUrl: level.demo_url || "",
      colorTheme: level.color_theme as "green" | "blue" | "orange" | "red",
      isPopular: level.is_popular,
      is_default: level.is_default,
      features: level.features,
    }));
  } catch (error) {
    console.error("Failed to fetch ad levels:", error);
    // Return empty array on error - UI should handle empty state
    return [];
  }
}
