"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import { useTranslations, useFormatter } from "next-intl";
import type { UserDetailData } from "@/types/type";
import { useTheme } from "next-themes";

interface UserProfileCardProps {
  data: UserDetailData;
}

export default function UserProfileCard({ data }: UserProfileCardProps) {
  const t = useTranslations("AdminDashboard.UserDetail");
  const format = useFormatter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="lg:col-span-1 space-y-6">
      <div
        className={clsx(
          "rounded-3xl shadow-sm border overflow-hidden p-8 text-center",
          isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
        )}
      >
        <div
          className={clsx(
            "w-32 h-32 mx-auto relative rounded-full overflow-hidden border-4 shadow-md mb-6",
            isDark ? "border-gray-700" : "border-white",
          )}
        >
          {data.avatarUrl ? (
            <Image
              src={data.avatarUrl}
              alt={data.name}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className={clsx(
                "w-full h-full flex items-center justify-center text-[3em] font-bold",
                isDark
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-blue-200 text-blue-600",
              )}
            >
              {data.name.charAt(0)}
            </div>
          )}
        </div>
        <h3
          className={clsx(
            "text-[2em] font-bold mb-1",
            isDark ? "text-white" : "text-shortblack",
          )}
        >
          {data.name}
        </h3>
        <p
          className={clsx(
            "text-[1.4em] mb-6",
            isDark ? "text-gray-400" : "text-grays",
          )}
        >
          @{data.username}
        </p>

        <div className="flex justify-center gap-3 mb-8">
          <span
            className={clsx(
              "px-4 py-1.5 rounded-full text-[1.1em] font-bold uppercase",
              data.status === "active"
                ? isDark
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-100 text-green-700"
                : isDark
                  ? "bg-red-500/20 text-red-400"
                  : "bg-red-100 text-red-700",
            )}
          >
            {data.status}
          </span>
          <span
            className={clsx(
              "px-4 py-1.5 rounded-full text-[1.1em] font-medium flex items-center gap-1 border",
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-400"
                : "bg-slate-50 border-gray-200 text-grays",
            )}
          >
            <MapPin className="w-3 h-3" />
            ID
          </span>
        </div>

        <div
          className={clsx(
            "space-y-4 text-left p-6 rounded-2xl border",
            isDark
              ? "bg-subcard border-gray-700"
              : "bg-slate-50 border-gray-100",
          )}
        >
          <InfoRow
            label={t("overview.email")}
            value={data.email}
            isDark={isDark}
          />
          <InfoRow
            label={t("overview.joined")}
            value={format.dateTime(new Date(data.joinedAt), {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Quick Stats - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={clsx(
            "p-5 rounded-2xl border shadow-sm text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
          )}
        >
          <p
            className={clsx(
              "text-[1.1em] mb-1",
              isDark ? "text-gray-400" : "text-grays",
            )}
          >
            {t("overview.totalViews")}
          </p>
          <p
            className={clsx(
              "text-[1.8em] font-bold",
              isDark ? "text-blue-400" : "text-bluelight",
            )}
          >
            {format.number(data.stats.totalViews)}
          </p>
        </div>
        <div
          className={clsx(
            "p-5 rounded-2xl border shadow-sm text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
          )}
        >
          <p
            className={clsx(
              "text-[1.1em] mb-1",
              isDark ? "text-gray-400" : "text-grays",
            )}
          >
            {t("overview.walletBalance")}
          </p>
          <p
            className={clsx(
              "text-[1.8em] font-bold",
              isDark ? "text-green-400" : "text-green-600",
            )}
          >
            {format.number(data.stats.walletBalance, {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 5,
              maximumFractionDigits: 5,
            })}
          </p>
        </div>
        <div
          className={clsx(
            "p-5 rounded-2xl border shadow-sm text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
          )}
        >
          <p
            className={clsx(
              "text-[1.1em] mb-1",
              isDark ? "text-gray-400" : "text-grays",
            )}
          >
            Total Earnings
          </p>
          <p
            className={clsx(
              "text-[1.8em] font-bold",
              isDark ? "text-emerald-400" : "text-emerald-600",
            )}
          >
            {format.number(data.stats.totalEarnings || 0, {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 5,
              maximumFractionDigits: 5,
            })}
          </p>
        </div>
        <div
          className={clsx(
            "p-5 rounded-2xl border shadow-sm text-center",
            isDark ? "bg-card border-gray-800" : "bg-white border-gray-100",
          )}
        >
          <p
            className={clsx(
              "text-[1.1em] mb-1",
              isDark ? "text-gray-400" : "text-grays",
            )}
          >
            Avg CPM
          </p>
          <p
            className={clsx(
              "text-[1.8em] font-bold",
              isDark ? "text-purple-400" : "text-purple-600",
            )}
          >
            {format.number(data.stats.avgCpm || 0, {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 5,
              maximumFractionDigits: 5,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex justify-between py-3 border-b last:border-0",
        isDark ? "border-gray-700" : "border-gray-100",
      )}
    >
      <span
        className={clsx(
          "text-[1.2em]",
          isDark ? "text-gray-400" : "text-grays",
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          "font-bold text-[1.2em] text-right break-all max-w-[60%]",
          isDark ? "text-white" : "text-shortblack",
        )}
      >
        {value}
      </span>
    </div>
  );
}
