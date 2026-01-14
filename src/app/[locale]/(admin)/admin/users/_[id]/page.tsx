"use client";

import { useEffect, useState, use } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { UserDetailData } from "@/types/type";
import * as adminUserService from "@/services/adminUserService";
import { useTranslations } from "next-intl";
import UserDetailHeader from "@/components/dashboard/admin/users/UserDetailHeader";
import UserProfileCard from "@/components/dashboard/admin/users/UserProfileCard";
import UserDetailTabs from "@/components/dashboard/admin/users/UserDetailTabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const t = useTranslations("AdminDashboard.UserDetail");
  const { id } = use(params);

  const [data, setData] = useState<UserDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-shortblack mb-2">
          {error || t("userNotFound")}
        </h2>
        <Link
          href="/admin/users"
          className="text-bluelight hover:underline font-medium"
        >
          {t("backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="font-figtree pb-12 text-[10px]">
      <UserDetailHeader status={data.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <UserProfileCard data={data} />
        <UserDetailTabs data={data} />
      </div>
    </div>
  );
}
