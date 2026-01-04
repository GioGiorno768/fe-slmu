// Auth Service - Handle semua API calls untuk authentication
import apiClient from "./apiClient";
import { clearAllCaches } from "@/utils/cacheUtils";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";
const HAS_REGISTERED_KEY = "has_registered";

// ==================== Helper Functions ====================

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token);
    // Also set as session cookie for middleware (no max-age = session cookie)
    document.cookie = `auth_token=${token}; path=/`;
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    // First check sessionStorage
    let token = sessionStorage.getItem(TOKEN_KEY);

    // If not in sessionStorage, try to get from cookie (for new tabs)
    if (!token) {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === TOKEN_KEY && value) {
          token = value;
          // Sync to sessionStorage for subsequent calls
          sessionStorage.setItem(TOKEN_KEY, token);
          break;
        }
      }
    }

    return token;
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    // Also clear old localStorage data (migration cleanup)
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Remove cookies
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "user_data=; path=/; max-age=0";
  }
};

/**
 * Store minimal user data for security
 * Only keeps id, name, email, role - no sensitive data
 */
export const setUser = (user: any) => {
  if (typeof window !== "undefined") {
    // 🔒 Only store minimal, non-sensitive data
    const minimalUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    sessionStorage.setItem(USER_KEY, JSON.stringify(minimalUser));
    // Also set as session cookie for middleware (no max-age = session cookie)
    document.cookie = `user_data=${encodeURIComponent(
      JSON.stringify(minimalUser)
    )}; path=/`;
  }
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    // First check sessionStorage
    let userData = sessionStorage.getItem(USER_KEY);

    // If not in sessionStorage, try to get from cookie (for new tabs)
    if (!userData) {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === USER_KEY && value) {
          userData = decodeURIComponent(value);
          // Sync to sessionStorage for subsequent calls
          sessionStorage.setItem(USER_KEY, userData);
          break;
        }
      }
    }

    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ==================== Referral Flow Helpers ====================

/**
 * Mark user as registered (persists in localStorage)
 * Used to detect returning users even after session expires
 */
export const markAsRegistered = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(HAS_REGISTERED_KEY, "true");
  }
};

/**
 * Check if user has ever registered on this browser
 */
export const hasEverRegistered = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(HAS_REGISTERED_KEY) === "true";
  }
  return false;
};

export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role || null;
};

export const getRedirectPath = (): string => {
  const role = getUserRole();

  // Redirect based on role
  if (role === "super_admin") {
    return "/super-admin/dashboard";
  } else if (role === "admin") {
    return "/admin/dashboard";
  } else {
    return "/dashboard";
  }
};

// ==================== Auth API Calls ====================

interface LoginCredentials {
  email: string;
  password: string;
  visitor_id?: string; // 🛡️ Anti-Fraud
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  referral_code?: string;
  visitor_id?: string; // 🛡️ Anti-Fraud
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Manual Login
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post("/login", credentials);
  const { token, user } = response.data;

  // Save token & user
  setToken(token);
  setUser(user);
  markAsRegistered(); // 🔖 Mark as registered user

  return response.data;
};

/**
 * Manual Register
 */
export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post("/register", credentials);
  const { token, user } = response.data;

  // Save token & user
  setToken(token);
  setUser(user);
  markAsRegistered(); // 🔖 Mark as registered user

  return response.data;
};

/**
 * Forgot Password - Request Reset Link
 */
export const forgotPassword = async (email: string) => {
  return await apiClient.post("/forgot-password", { email });
};

/**
 * Reset Password - Submit New Password
 */
export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const resetPassword = async (data: ResetPasswordData) => {
  return await apiClient.post("/reset-password", data);
};

/**
 * Google OAuth Login
 * @param credential - Credential JWT dari Google OAuth popup
 * @param visitorId - Device fingerprint for anti-fraud (optional)
 * @param referralCode - Referral code for new users (optional)
 */
export const googleLogin = async (
  credential: string,
  visitorId?: string,
  referralCode?: string
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/google/callback", {
    access_token: credential, // Backend expect 'access_token' key
    visitor_id: visitorId, // 🛡️ Anti-Fraud Fingerprint
    referral_code: referralCode, // 🎁 Referral code for new users
  });
  const { token, user } = response.data.data || response.data;

  // Save token & user
  setToken(token);
  setUser(user);
  markAsRegistered(); // 🔖 Mark as registered user

  return response.data;
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // 🧹 Clear ALL cached data to prevent stale data for next user
    clearAllCaches();
    removeToken();
    // 📢 Broadcast logout to all tabs
    broadcastLogout();
  }
};

// ==================== Cross-Tab Sync ====================

const LOGOUT_CHANNEL_NAME = "shortlink_logout_channel";

/**
 * Broadcast logout event to all tabs
 */
const broadcastLogout = () => {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    const channel = new BroadcastChannel(LOGOUT_CHANNEL_NAME);
    channel.postMessage({ type: "LOGOUT" });
    channel.close();
  }
};

/**
 * Setup cross-tab logout listener
 * Call this once in your app's root component
 */
export const setupCrossTabLogoutListener = (onLogout: () => void) => {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    const channel = new BroadcastChannel(LOGOUT_CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === "LOGOUT") {
        // Another tab logged out - clear local session and redirect
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        onLogout();
      }
    };

    // Return cleanup function
    return () => channel.close();
  }
  return () => {};
};

/**
 * Get Current User Profile (if needed)
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get("/user");
  return response.data;
};

/**
 * Update Password
 */
export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const updatePassword = async (data: UpdatePasswordData) => {
  const response = await apiClient.put("/user/password", data);
  return response.data;
};

// Export default object
const authService = {
  login,
  register,
  googleLogin,
  logout,
  getCurrentUser,
  updatePassword,
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  isAuthenticated,
  getUserRole,
  getRedirectPath,
  markAsRegistered,
  hasEverRegistered,
  setupCrossTabLogoutListener,
  forgotPassword,
  resetPassword,
};

export default authService;
