"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Ban,
  Clock,
  Calendar,
  Crown,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import clsx from "clsx";
import type { Admin } from "@/types/type";

interface AdminListCardProps {
  admin: Admin;
  onToggleStatus: (id: string, currentStatus: "active" | "suspended") => void;
  onDelete: (id: string) => void;
}

export default function AdminListCard({
  admin,
  onToggleStatus,
  onDelete,
}: AdminListCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (date: string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300",
        "border-gray-100 hover:border-blue-200",
        "p-4 md:p-5"
      )}
    >
      {/* Main Row */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 relative overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-gray-500 font-bold text-xs md:text-sm">
          {admin.avatarUrl ? (
            <Image
              src={admin.avatarUrl}
              alt={admin.name}
              fill
              className="object-cover"
            />
          ) : (
            <span>{getInitials(admin.name)}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-sm md:text-base text-shortblack truncate">
              {admin.name}
            </h4>
            {admin.role === "super-admin" || admin.role === "super_admin" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase bg-yellow-50 text-yellow-700 border border-yellow-200">
                <Crown className="w-3 h-3" />
                Super
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                Admin
              </span>
            )}
            <span
              className={clsx(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase",
                admin.status === "active"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              )}
            >
              {admin.status === "active" ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Ban className="w-3 h-3" />
              )}
              {admin.status}
            </span>
          </div>
          <p className="text-grays text-xs md:text-sm truncate">
            {admin.email}
          </p>
        </div>

        {/* Actions - Desktop (only for non-super-admin) */}
        {admin.role !== "super-admin" && admin.role !== "super_admin" && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleStatus(admin.id, admin.status)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
                admin.status === "suspended"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              )}
            >
              {admin.status === "suspended" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Unsuspend
                </>
              ) : (
                <>
                  <Ban className="w-3.5 h-3.5" />
                  Suspend
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(admin.id);
              }}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Admin"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions - Mobile (only for non-super-admin) */}
        {admin.role !== "super-admin" && admin.role !== "super_admin" && (
          <div className="md:hidden">
            <button
              onClick={() => onToggleStatus(admin.id, admin.status)}
              className={clsx(
                "p-2 rounded-lg transition-colors",
                admin.status === "suspended"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              )}
            >
              {admin.status === "suspended" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Ban className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer Row - Joined & Last Login */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-grays text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Joined on {formatDate(admin.joinedAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Last active: {formatDateTime(admin.lastLogin)}</span>
        </div>
      </div>
    </div>
  );
}
