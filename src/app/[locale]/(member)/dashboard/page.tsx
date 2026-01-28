// src/app/[locale]/(member)/dashboard/page.tsx
"use client";

import DashboardSlider from "@/components/dashboard/DashboardSlider";
import MilestoneCard from "@/components/dashboard/MilestoneCard";
import LinkAnalyticsCard from "@/components/dashboard/LinkAnalyticsCard";
import TopPerformingLinksCard from "@/components/dashboard/TopPerformingLinksCard";
import TopCountriesCard from "@/components/dashboard/TopCountriesCard";
import ReferralCard from "@/components/dashboard/ReferralCard";
import { useDashboard } from "@/hooks/useDashboard";
import { useUser } from "@/hooks/useUser";
import { useFeatureLocks } from "@/hooks/useFeatureLocks";

export default function DashboardPage() {
  // Get current user data for personalized greeting
  const { user } = useUser("user");

  // Get feature lock status for rank-based features
  const { canViewTopCountries, levelForTopCountries } = useFeatureLocks();

  // Panggil hook dengan username untuk personalisasi slider
  const {
    slides,
    milestone,
    referralData,
    topCountries,
    topLinks,
    analyticsData,
    analyticsLoading,
    analyticsRange,
    analyticsStat,
    setAnalyticsRange,
    setAnalyticsStat,
  } = useDashboard(user?.username);

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      {/* Top Section: Slider & Milestone */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2 xl:col-span-2 h-full min-h-[200px]">
          <DashboardSlider slides={slides} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2 h-full">
          <MilestoneCard data={milestone} />
        </div>
      </div>

      {/* Middle Section: Chart & Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-3">
          <LinkAnalyticsCard
            data={analyticsData}
            isLoading={analyticsLoading}
            error={null}
            range={analyticsRange}
            stat={analyticsStat}
            onChangeRange={setAnalyticsRange}
            onChangeStat={setAnalyticsStat}
          />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <TopPerformingLinksCard data={topLinks} />
        </div>
      </div>

      {/* Bottom Section: Countries & Referral */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <TopCountriesCard
          data={topCountries}
          isLocked={!canViewTopCountries}
          requiredLevel={levelForTopCountries}
        />
        <ReferralCard data={referralData} />
      </div>
    </div>
  );
}
