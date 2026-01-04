import apiClient from "./apiClient";
import type { Admin, AdminStats } from "@/types/type";

interface GetAdminsParams {
  page?: number;
  search?: string;
  status?: string;
  role?: string;
}

/**
 * Get admins list with pagination and filters
 */
export async function getAdmins(
  params: GetAdminsParams
): Promise<{ data: Admin[]; totalPages: number; totalCount: number }> {
  try {
    const response = await apiClient.get("/super-admin/admins", {
      params: {
        page: params.page || 1,
        per_page: 10,
        search: params.search || undefined,
        status: params.status !== "all" ? params.status : undefined,
        role: params.role !== "all" ? params.role : undefined,
      },
    });

    const result = response.data;
    return {
      data: result.data || [],
      totalPages: result.meta?.last_page || 1,
      totalCount: result.meta?.total || 0,
    };
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    throw error;
  }
}

/**
 * Get admin statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await apiClient.get("/super-admin/admins/stats");
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    throw error;
  }
}

/**
 * Create a new admin
 */
export async function createAdmin(data: {
  username: string;
  email: string;
  password: string;
  name?: string;
}): Promise<Admin> {
  try {
    const response = await apiClient.post("/super-admin/admins", {
      name: data.name || data.username,
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Failed to create admin:", error);
    throw error;
  }
}

/**
 * Update admin status (suspend/unsuspend)
 */
export async function updateAdminStatus(
  id: string,
  status: "active" | "suspended"
): Promise<void> {
  try {
    // Use toggle-status endpoint
    await apiClient.patch(`/super-admin/admins/${id}/toggle-status`);
  } catch (error) {
    console.error("Failed to update admin status:", error);
    throw error;
  }
}

/**
 * Delete an admin
 */
export async function deleteAdmin(id: string): Promise<void> {
  try {
    await apiClient.delete(`/super-admin/admins/${id}`);
  } catch (error) {
    console.error("Failed to delete admin:", error);
    throw error;
  }
}
