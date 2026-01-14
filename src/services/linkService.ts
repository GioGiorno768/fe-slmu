// src/services/linkService.ts
import type {
  Shortlink,
  CreateLinkFormData,
  EditableLinkData,
  FilterByType,
  SortByType,
  AdLevel,
  MemberLinkFilters,
} from "@/types/type";
import apiClient from "./apiClient";

export interface GeneratedLinkData {
  shortUrl: string;
  originalUrl: string;
  code: string;
  isGuest: boolean;
  earnPerClick: number;
}

// ============ AD LEVEL MAPPING HELPERS ============
// Maps between frontend slugs and backend numeric IDs
// Backend stores: 1=Low, 2=Medium, 3=High, 4=Aggressive

const AD_LEVEL_SLUG_TO_ID: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  aggressive: 4,
  // Legacy support
  noAds: 0,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 4,
};

const AD_LEVEL_ID_TO_SLUG: Record<number, AdLevel> = {
  0: "low", // noAds maps to low for safety
  1: "low",
  2: "medium",
  3: "high",
  4: "aggressive",
};

// Convert slug/legacy format to numeric ID for backend
const getAdLevelId = (adsLevel: string | undefined): number => {
  if (!adsLevel) return 2; // Default to medium
  return AD_LEVEL_SLUG_TO_ID[adsLevel] ?? 2;
};

// Convert numeric ID from backend to slug for frontend
const getAdLevelSlug = (id: number | undefined): AdLevel => {
  if (id === undefined || id === null) return "medium";
  return AD_LEVEL_ID_TO_SLUG[id] ?? "medium";
};
// ================================================

// Update params interface
interface GetLinksParams {
  page?: number;
  filters: MemberLinkFilters;
}

export const getLinks = async (
  params: GetLinksParams
): Promise<{ data: Shortlink[]; totalPages: number }> => {
  try {
    const { filters } = params;

    // Map frontend filters to backend params
    let backendFilter = undefined;

    // Sort mapping
    switch (filters.sort) {
      case "most_views":
        backendFilter = "top_links";
        break;
      case "least_views":
        backendFilter = "least_links"; // Placeholder
        break;
      case "most_earnings":
        backendFilter = "top_earned";
        break;
      case "least_earnings":
        backendFilter = "least_earned"; // Placeholder
        break;
      case "newest":
        backendFilter = "newest"; // Explicitly send newest
        break;
      case "oldest":
        backendFilter = "oldest";
        break;
    }

    // Status mapping
    // Backend expects 'status' param: 'active' | 'disabled'
    // 'expired' is likely a 'filter' in backend based on previous code: case "dateExpired": backendFilter = "expired";
    let backendStatus = filters.status !== "all" ? filters.status : undefined;

    // Handle 'expired' which was previously a filter, but in UI is a status
    if (filters.status === "expired") {
      backendFilter = "expired";
      backendStatus = undefined; // Clear status if expired is treated as filter
    } else if (filters.status === "password") {
      backendFilter = "link_password";
      backendStatus = undefined;
    }

    const response = await apiClient.get("/links", {
      params: {
        page: params.page || 1,
        search: filters.search,
        filter: backendFilter, // Sort/Special lists
        status: backendStatus, // Active/Disabled
        ad_level:
          filters.adsLevel !== "all"
            ? getAdLevelId(filters.adsLevel)
            : undefined, // Map slug to ID
      },
    });

    const apiData = response.data.data;
    const meta = response.data.meta || { last_page: 1 };

    // Format response to match Shortlink type
    const formattedLinks: Shortlink[] = apiData.map((link: any) => ({
      id: link.id,
      title: link.title || "Untitled",
      shortUrl: link.short_url,
      originalUrl: link.original_url,
      dateCreated: link.created_at,
      validViews: link.valid_views || 0,
      totalEarning: parseFloat(link.total_earned || 0),
      totalClicks: link.total_views || 0,
      averageCPM: parseFloat(link.calculated_cpm || 0),
      adsLevel: getAdLevelSlug(link.ad_level),
      password: link.password,
      passwordProtected: !!link.password,
      status: link.status,
      dateExpired: link.expired_at,
    }));

    return {
      data: formattedLinks,
      totalPages: meta.last_page,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch links");
  }
};

export const createLink = async (
  data: CreateLinkFormData
): Promise<Shortlink> => {
  try {
    const payload = {
      original_url: data.url,
      title: data.title,
      alias: data.alias || undefined,
      password: data.password || undefined,
      expired_at: data.expiresAt || undefined,
      ad_level: getAdLevelId(data.adsLevel),
    };

    const response = await apiClient.post("/links", payload);
    const link = response.data.data;

    return {
      id: link.code, // Assuming code can act as temporary ID for frontend
      title: link.title || "Untitled",
      shortUrl: link.short_url,
      originalUrl: link.original_url,
      dateCreated: new Date().toISOString(),
      validViews: 0,
      totalEarning: 0,
      totalClicks: 0,
      averageCPM: 0,
      adsLevel: data.adsLevel,
      passwordProtected: !!data.password,
      status: "active",
      dateExpired: data.expiresAt,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create link");
  }
};

export const updateLink = async (
  id: string,
  data: EditableLinkData
): Promise<Shortlink> => {
  try {
    const payload = {
      alias: data.alias,
      password: data.password || null, // Send null to remove password
      expired_at: data.expiresAt || null,
      ad_level: getAdLevelId(data.adsLevel),
    };

    const response = await apiClient.put(`/links/${id}`, payload);
    const link = response.data.data;

    return {
      id: link.id,
      title: link.title,
      shortUrl: link.short_url,
      originalUrl: link.original_url,
      dateCreated: link.created_at,
      validViews: link.valid_views_count || 0,
      totalEarning: link.total_earned || 0,
      totalClicks: link.total_views_count || 0,
      averageCPM: 0,
      adsLevel: getAdLevelSlug(link.ad_level),
      passwordProtected: !!link.password,
      status: link.status,
      dateExpired: link.expired_at,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update link");
  }
};

export const toggleLinkStatus = async (
  id: string,
  status: "active" | "disabled"
): Promise<Shortlink> => {
  try {
    const response = await apiClient.patch(`/links/${id}/toggle-status`);
    // Backend toggle logic flips status, so we just return the new state
    // We construct a partial Shortlink object just to satisfy return type
    return {
      id,
      status: response.data.data.status,
    } as Shortlink;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to toggle status");
  }
};

// --- GUEST SERVICES ---

export const createGuestLink = async (
  originalUrl: string,
  alias?: string
): Promise<GeneratedLinkData> => {
  try {
    const response = await apiClient.post("/links", {
      original_url: originalUrl,
      alias: alias || undefined,
      is_guest: true, // Force guest mode even if logged in
      // Backend handles rate limiting automatically
    });

    // Response structure from LinkController::store
    // 'data': { short_url, code, title, ... }
    const data = response.data.data;

    return {
      shortUrl: data.short_url,
      code: data.code,
      originalUrl: data.original_url || originalUrl, // fallback
      isGuest: data.is_guest,
      earnPerClick: data.earn_per_click,
    };
  } catch (error: any) {
    // Handle specific backend errors - use message from backend
    if (error.response && error.response.status === 429) {
      // Rate limit hit - use backend message which has dynamic limit info
      const message =
        error.response?.data?.message ||
        "Guest limit reached. Please register to create more.";
      throw new Error(message);
    }
    if (error.response && error.response.status === 403) {
      // Guest creation disabled
      const message =
        error.response?.data?.message ||
        "Guest link creation is disabled. Please register.";
      throw new Error(message);
    }
    throw error;
  }
};

export const validateContinueToken = async (
  code: string,
  token: string,
  password?: string,
  visitorId?: string // 🛡️ Anti-Fraud Device Fingerprint
): Promise<string> => {
  try {
    const payload: any = { token };
    if (password) {
      payload.password = password;
    }
    if (visitorId) {
      payload.visitor_id = visitorId; // 🛡️ Send fingerprint to backend
    }

    const response = await apiClient.post(`/links/${code}/continue`, payload);
    return response.data.data.original_url;
  } catch (error: any) {
    // Pass the specific error for handling (e.g. 401 password required)
    throw error;
  }
};

// --- MASS CREATE SERVICE ---

export interface MassCreateResult {
  original_url: string;
  short_url?: string;
  code?: string;
  error?: string;
}

export interface MassCreateParams {
  urls: string[]; // Array of URLs
  adLevel?: AdLevel; // Optional ad level (applies to all)
  password?: string; // Not supported by backend, but kept for future
  expiresAt?: string; // Not supported by backend, but kept for future
}

export const massCreateLinks = async (
  params: MassCreateParams
): Promise<MassCreateResult[]> => {
  try {
    // Backend expects: urls (string, newline separated), ad_level (int)
    const payload = {
      urls: params.urls.join("\n"), // Convert array to newline separated string
      ad_level: params.adLevel ? getAdLevelId(params.adLevel) : undefined,
    };

    const response = await apiClient.post("/links/mass", payload);
    const results = response.data.data;

    // Map backend response to frontend format
    return results.map((result: any) => ({
      original_url: result.original_url,
      short_url: result.short_url,
      code: result.code,
      error: result.error,
    }));
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create mass links"
    );
  }
};
