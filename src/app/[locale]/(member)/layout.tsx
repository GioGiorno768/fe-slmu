// src/app/[locale]/(member)/layout.tsx
import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardAuthCheck from "@/components/dashboard/DashboardAuthCheck";
import BannedUserPopup from "@/components/auth/BannedUserPopup";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthCheck>
      <DashboardLayout role="member">{children}</DashboardLayout>
      <BannedUserPopup />
    </DashboardAuthCheck>
  );
}
