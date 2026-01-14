"use client";

import { useEffect, useState, use } from "react";
import { Loader2, AlertCircle, Ban, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { UserDetailData } from "@/types/type";
import * as adminUserService from "@/services/adminUserService";
import { useTranslations } from "next-intl";
import UserProfileCard from "@/components/dashboard/admin/users/UserProfileCard";
import UserDetailTabs from "@/components/dashboard/admin/users/UserDetailTabs";
import { ArrowLeft } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SuperAdminUserDetailPage({ params }: PageProps) {
  const t = useTranslations("AdminDashboard.UserDetail");
  const { id } = use(params);
  const { showAlert } = useAlert();

  const [data, setData] = useState<UserDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      adminUserService
        .getUserDetail(id)
        .then((res) => {
          if (res) {
            setData(res);
          } else {
            setError("User not found");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user detail:", err);
          setError("Failed to load user data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleSuspendClick = () => {
    if (!data) return;
    if (data.status === "suspended") {
      // Direct unsuspend
      handleConfirmSuspend();
    } else {
      // Show modal for suspend
      setIsSuspendModalOpen(true);
    }
  };

  const handleConfirmSuspend = async (reason?: string) => {
    if (!data) return;
    const newStatus = data.status === "suspended" ? "active" : "suspended";
    try {
      // TODO: Call API to update status
      // if (newStatus === "suspended" && reason) {
      //   await adminUserService.updateUserStatus(data.id, newStatus);
      //   await adminUserService.sendNotificationToUser(data.id, {
      //     subject: "Account Suspended",
      //     message: reason,
      //     type: "warning"
      //   });
      // } else {
      //   await adminUserService.updateUserStatus(data.id, newStatus);
      // }

      setData({ ...data, status: newStatus });
      showAlert(
        `User ${
          newStatus === "active" ? "activated" : "suspended"
        } successfully!`,
        "success"
      );
      setIsSuspendModalOpen(false);
    } catch (error) {
      showAlert("Failed to update user status", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div
          className={clsx(
            "p-4 rounded-full mb-4",
            isDark ? "bg-red-500/20" : "bg-red-50"
          )}
        >
          <AlertCircle
            className={clsx(
              "w-10 h-10",
              isDark ? "text-red-400" : "text-red-500"
            )}
          />
        </div>
        <h2
          className={clsx(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-shortblack"
          )}
        >
          {error || t("userNotFound")}
        </h2>
        <Link
          href="/super-admin/manage-user"
          className="text-bluelight hover:underline font-medium"
        >
          {t("backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="font-figtree pb-12 text-[10px]">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/super-admin/manage-user"
          className={clsx(
            "inline-flex items-center gap-2 transition-colors font-medium text-[1.2em] mb-4",
            isDark
              ? "text-gray-400 hover:text-white"
              : "text-grays hover:text-shortblack"
          )}
        >
          <ArrowLeft className="w-5 h-5" /> {t("backToUsers")}
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1
              className={clsx(
                "text-[2.5em] font-bold",
                isDark ? "text-white" : "text-shortblack"
              )}
            >
              {t("title")}
            </h1>
            <p
              className={clsx(
                "text-[1.4em]",
                isDark ? "text-gray-400" : "text-grays"
              )}
            >
              {t("subtitle")}
            </p>
          </div>

          {/* Suspend/Unsuspend Button */}
          <button
            onClick={handleSuspendClick}
            className={clsx(
              "px-6 py-3 rounded-xl text-[1.4em] font-medium transition-colors flex items-center gap-2",
              data.status === "suspended"
                ? isDark
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
                : isDark
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            )}
          >
            {data.status === "suspended" ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Unsuspend User
              </>
            ) : (
              <>
                <Ban className="w-5 h-5" />
                Suspend User
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <UserProfileCard data={data} />
        <UserDetailTabs data={data} />
      </div>

      {/* Suspend Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
        title="Suspend User Account"
        description="Please provide a reason for suspending this user. The reason will be sent to the user as a notification."
        confirmLabel="Suspend User"
        cancelLabel="Cancel"
        type="warning"
        showReasonInput={true}
        reasonPlaceholder="Enter suspension reason (e.g., violation of terms, inappropriate content, etc.)"
      />
    </div>
  );
}
